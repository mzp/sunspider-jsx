// 3D Cube Rotation
// http://www.speich.net/computer/moztesting/3d.htm
// Created by Simon Speich

class CreateP {
    var V = [] : number[];

    function constructor(X : number, Y : number, Z : number) {
        this.V = [X,Y,Z,1];
    }
}

class _Main {
    var Q : variant = new Object();
    var MTrans = [] : number[][];  // transformation matrix
    var MQube  = [] : number[][] ;  // position information of qube
    var I = [] : number[][];      // entity matrix
    var Origin : variant = new Object();
    var Testing : variant = new Object();
    var LoopTimer = 0;

    var DisplArea : variant = new Object();

    function DrawLine(From : variant, To : variant) : void {
        var x1 = From['V'][0] as number;
        var x2 = To['V'][0] as number;
        var y1 = From['V'][1] as number;
        var y2 = To['V'][1] as number;
        var dx = Math.abs(x2 - x1);
        var dy = Math.abs(y2 - y1);
        var x = x1;
        var y = y1;
        var IncX1, IncY1;
        var IncX2, IncY2;
        var Den;
        var Num;
        var NumAdd;
        var NumPix;

        if (x2 >= x1) {  IncX1 = 1; IncX2 = 1;  }
        else { IncX1 = -1; IncX2 = -1; }
        if (y2 >= y1)  {  IncY1 = 1; IncY2 = 1; }
        else { IncY1 = -1; IncY2 = -1; }
        if (dx >= dy) {
            IncX1 = 0;
            IncY2 = 0;
            Den = dx;
            Num = dx / 2;
            NumAdd = dy;
            NumPix = dx;
        }
        else {
            IncX2 = 0;
            IncY1 = 0;
            Den = dy;
            Num = dy / 2;
            NumAdd = dx;
            NumPix = dy;
        }

        NumPix = Math.round(this.Q['LastPx'] as number + NumPix);

        var i = this.Q['LastPx'] as number;
        for (; i < NumPix; i++) {
            Num += NumAdd;
            if (Num >= Den) {
                Num -= Den;
                x += IncX1;
                y += IncY1;
            }
            x += IncX2;
            y += IncY2;
        }
        this.Q['LastPx'] = NumPix;
    }

    function CalcCross(V0 : number[], V1 : number[]) : number[] {
        var Cross = [] : number[] ;
        Cross[0] = V0[1]*V1[2] - V0[2]*V1[1];
        Cross[1] = V0[2]*V1[0] - V0[0]*V1[2];
        Cross[2] = V0[0]*V1[1] - V0[1]*V1[0];
        return Cross;
    }

    function CalcNormal(V0 : number[], V1 : number[], V2 : number[]) : number[] {
        var A = [] : number[];
        var B = [] : number[];
        for (var i = 0; i < 3; i++) {
            A[i] = V0[i] - V1[i];
            B[i] = V2[i] - V1[i];
        }
        A = this.CalcCross(A, B);
        var Length = Math.sqrt(A[0]*A[0] + A[1]*A[1] + A[2]*A[2]);
        for (var i = 0; i < 3; i++) A[i] = A[i] / Length;
        A[3] = 1;
        return A;
    }

    // multiplies two matrices
    function MMulti(M1 : number[][], M2 : number[][]) : number[][] {
        var M = [[] : number[],[] : number[],[] : number[],[] : number[]];
        var i = 0;
        var j = 0;
        for (; i < 4; i++) {
            j = 0;
            for (; j < 4; j++) M[i][j] = M1[i][0] * M2[0][j] + M1[i][1] * M2[1][j] + M1[i][2] * M2[2][j] + M1[i][3] * M2[3][j];
        }
        return M;
    }

    //multiplies matrix with vector
    function VMulti(M : number[][], V : number[]) : number[] {
        var Vect = [] : number[];
        var i = 0;
        for (;i < 4; i++) Vect[i] = M[i][0] * V[0] + M[i][1] * V[1] + M[i][2] * V[2] + M[i][3] * V[3];
        return Vect;
    }

    function VMulti2(M : number[][], V : number[]) : number[] {
        var Vect = [] : number[];
        var i = 0;
        for (;i < 3; i++) Vect[i] = M[i][0] * V[0] + M[i][1] * V[1] + M[i][2] * V[2];
        return Vect;
    }

    // add to matrices
    function MAdd(M1 : number[][] , M2 : number[][]) : number[][] {
        var M = [[] : number[],[] : number[],[] : number[],[] : number[]];
        var i = 0;
        var j = 0;
        for (; i < 4; i++) {
            j = 0;
            for (; j < 4; j++) M[i][j] = M1[i][j] + M2[i][j];
        }
        return M;
    }

    function Translate(M : number[][], Dx : number, Dy : number, Dz : number) : number[][] {
        var T = [
            [1,0,0,Dx],
            [0,1,0,Dy],
            [0,0,1,Dz],
            [0,0,0,1]
            ];
        return this.MMulti(T, M);
    }

    function RotateX(M : number[][], Phi : number) : number[][] {
        var a = Phi;
        a *= Math.PI / 180;
        var Cos = Math.cos(a);
        var Sin = Math.sin(a);
        var R = [
            [1,0,0,0],
            [0,Cos,-Sin,0],
            [0,Sin,Cos,0],
            [0,0,0,1]
            ];
        return this.MMulti(R, M);
    }

    function RotateY(M : number[][], Phi : number) : number[][] {
        var a = Phi;
        a *= Math.PI / 180;
        var Cos = Math.cos(a);
        var Sin = Math.sin(a);
        var R = [
            [Cos,0,Sin,0],
            [0,1,0,0],
            [-Sin,0,Cos,0],
            [0,0,0,1]
            ];
        return this.MMulti(R, M);
    }

    function RotateZ(M : number[][], Phi : number) : number[][] {
        var a = Phi;
        a *= Math.PI / 180;
        var Cos = Math.cos(a);
        var Sin = Math.sin(a);
        var R = [
            [Cos,-Sin,0,0],
            [Sin,Cos,0,0],
            [0,0,1,0],
            [0,0,0,1]
            ];
        return this.MMulti(R, M);
    }

    function DrawQube() : void {
        // calc current normals
        var CurN = [] : number[][];
        var i = 5;
        this.Q['LastPx'] = 0;
        for (; i > -1; i--) CurN[i] = this.VMulti2(this.MQube, this.Q['Normal'][i] as number[]);
        if (CurN[0][2] < 0) {
            if (!this.Q['Line'][0]) { this.DrawLine(this.Q[0], this.Q[1]); this.Q['Line'][0] = true; };
            if (!this.Q['Line'][1]) { this.DrawLine(this.Q[1], this.Q[2]); this.Q['Line'][1] = true; };
            if (!this.Q['Line'][2]) { this.DrawLine(this.Q[2], this.Q[3]); this.Q['Line'][2] = true; };
            if (!this.Q['Line'][3]) { this.DrawLine(this.Q[3], this.Q[0]); this.Q['Line'][3] = true; };
        }
        if (CurN[1][2] < 0) {
            if (!this.Q['Line'][2]) { this.DrawLine(this.Q[3], this.Q[2]); this.Q['Line'][2] = true; };
            if (!this.Q['Line'][9]) { this.DrawLine(this.Q[2], this.Q[6]); this.Q['Line'][9] = true; };
            if (!this.Q['Line'][6]) { this.DrawLine(this.Q[6], this.Q[7]); this.Q['Line'][6] = true; };
            if (!this.Q['Line'][10]) { this.DrawLine(this.Q[7], this.Q[3]); this.Q['Line'][10] = true; };
        }
        if (CurN[2][2] < 0) {
            if (!this.Q['Line'][4]) { this.DrawLine(this.Q[4], this.Q[5]); this.Q['Line'][4] = true; };
            if (!this.Q['Line'][5]) { this.DrawLine(this.Q[5], this.Q[6]); this.Q['Line'][5] = true; };
            if (!this.Q['Line'][6]) { this.DrawLine(this.Q[6], this.Q[7]); this.Q['Line'][6] = true; };
            if (!this.Q['Line'][7]) { this.DrawLine(this.Q[7], this.Q[4]); this.Q['Line'][7] = true; };
        }
        if (CurN[3][2] < 0) {
            if (!this.Q['Line'][4]) { this.DrawLine(this.Q[4], this.Q[5]); this.Q['Line'][4] = true; };
            if (!this.Q['Line'][8]) { this.DrawLine(this.Q[5], this.Q[1]); this.Q['Line'][8] = true; };
            if (!this.Q['Line'][0]) { this.DrawLine(this.Q[1], this.Q[0]); this.Q['Line'][0] = true; };
            if (!this.Q['Line'][11]) { this.DrawLine(this.Q[0], this.Q[4]); this.Q['Line'][11] = true; };
        }
        if (CurN[4][2] < 0) {
            if (!this.Q['Line'][11]) { this.DrawLine(this.Q[4], this.Q[0]); this.Q['Line'][11] = true; };
            if (!this.Q['Line'][3]) { this.DrawLine(this.Q[0], this.Q[3]); this.Q['Line'][3] = true; };
            if (!this.Q['Line'][10]) { this.DrawLine(this.Q[3], this.Q[7]); this.Q['Line'][10] = true; };
            if (!this.Q['Line'][7]) { this.DrawLine(this.Q[7], this.Q[4]); this.Q['Line'][7] = true; };
        }
        if (CurN[5][2] < 0) {
            if (!this.Q['Line'][8]) { this.DrawLine(this.Q[1], this.Q[5]); this.Q['Line'][8] = true; };
            if (!this.Q['Line'][5]) { this.DrawLine(this.Q[5], this.Q[6]); this.Q['Line'][5] = true; };
            if (!this.Q['Line'][9]) { this.DrawLine(this.Q[6], this.Q[2]); this.Q['Line'][9] = true; };
            if (!this.Q['Line'][1]) { this.DrawLine(this.Q[2], this.Q[1]); this.Q['Line'][1] = true; };
        }
        this.Q['Line'] = [false,false,false,false,false,false,false,false,false,false,false,false];
        this.Q['LastPx'] = 0;
    }

    function Loop() : void {
        if (this.Testing['LoopCount'] as number > this.Testing['LoopMax'] as number) return;
        var TestingStr = this.Testing['LoopCount'] as string;
        while (TestingStr.length < 3) TestingStr = "0" + TestingStr;
        this.MTrans = this.Translate(this.I,
            -(this.Q[8]['V'][0] as number),
            -(this.Q[8]['V'][1] as number),
            -(this.Q[8]['V'][2] as number));
        this.MTrans = this.RotateX(this.MTrans, 1);
        this.MTrans = this.RotateY(this.MTrans, 3);
        this.MTrans = this.RotateZ(this.MTrans, 5);
        this.MTrans = this.Translate(this.MTrans,
            this.Q[8]['V'][0] as number,
            this.Q[8]['V'][1] as number,
            this.Q[8]['V'][2] as number);
        this.MQube = this.MMulti(this.MTrans, this.MQube);
        var i = 8;
        for (; i > -1; i--) {
            this.Q[i]['V'] = this.VMulti(this.MTrans, this.Q[i]['V'] as number[]);
        }
        this.DrawQube();
        this.Testing['LoopCount'] = this.Testing['LoopCount'] as number + 1;
        this.Loop();
    }

    function Init(CubeSize : number) : void {
        // init/reset vars
        this.Origin['V'] = [150,150,20,1];
        this.Testing['LoopCount'] = 0;
        this.Testing['LoopMax'] = 50;
        this.Testing['TimeMax'] = 0;
        this.Testing['TimeAvg'] = 0;
        this.Testing['TimeMin'] = 0;
        this.Testing['TimeTemp'] = 0;
        this.Testing['TimeTotal'] = 0;
        this.Testing['Init'] = false;

        // transformation matrix
        this.MTrans = [
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [0,0,0,1]
            ];

        // position information of qube
        this.MQube = [
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [0,0,0,1]
            ];

        // entity matrix
        this.I = [
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [0,0,0,1]
            ];

        // create qube
        this.Q[0] = new CreateP(-CubeSize,-CubeSize, CubeSize);
        this.Q[1] = new CreateP(-CubeSize, CubeSize, CubeSize);
        this.Q[2] = new CreateP( CubeSize, CubeSize, CubeSize);
        this.Q[3] = new CreateP( CubeSize,-CubeSize, CubeSize);
        this.Q[4] = new CreateP(-CubeSize,-CubeSize,-CubeSize);
        this.Q[5] = new CreateP(-CubeSize, CubeSize,-CubeSize);
        this.Q[6] = new CreateP( CubeSize, CubeSize,-CubeSize);
        this.Q[7] = new CreateP( CubeSize,-CubeSize,-CubeSize);

        // center of gravity
        this.Q[8] = new CreateP(0, 0, 0);

        // anti-clockwise edge check
        this.Q['Edge'] = [[0,1,2],[3,2,6],[7,6,5],[4,5,1],[4,0,3],[1,5,6]];

        // calculate squad normals
        this.Q['Normal'] = [] : number[];
        for (var i = 0; i < (this.Q['Edge'] as variant[]).length; i++) {
            this.Q['Normal'][i] =
              this.CalcNormal(this.Q[this.Q['Edge'][i][0] as number]['V'] as number[],
                              this.Q[this.Q['Edge'][i][1] as number]['V'] as number[],
                              this.Q[this.Q['Edge'][i][2] as number]['V'] as number[]);
        }

        // line drawn ?
        this.Q['Line'] = [false,false,false,false,false,false,false,false,false,false,false,false];

        // create line pixels
        this.Q['NumPx'] = 9 * 2 * CubeSize;
//        for (var i = 0; i < this.Q['NumPx'] as number; i++) CreateP(0,0,0);

        this.MTrans = this.Translate(this.MTrans,
            this.Origin['V'][0] as number,
            this.Origin['V'][1] as number,
            this.Origin['V'][2] as number);
        this.MQube = this.MMulti(this.MTrans, this.MQube);

        var i = 0;
        for (; i < 9; i++) {
            this.Q[i]['V'] = this.VMulti(this.MTrans, this.Q[i]['V'] as number[]);
        }
        this.DrawQube();
        this.Testing['Init'] = true;
        this.Loop();
    }

    function constructor() {
        this.DisplArea['Width'] = 300;
        this.DisplArea['Height'] = 300;
        for ( var i = 20; i <= 160; i *= 2 ) {
            this.Init(i);
            this.Q;
        }
    }

    static function main(args: string[]) : void {
        new _Main();
    }
}
