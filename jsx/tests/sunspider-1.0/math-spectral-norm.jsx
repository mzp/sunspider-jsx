// The Great Computer Language Shootout
// http://shootout.alioth.debian.org/
//
// contributed by Ian Osgood

class _Main {
    function A(i : number, j : number) : number {
        return 1/((i+j)*(i+j+1)/2+i+1);
    }

    function Au(u : number[],v : number[]) : void {
        for (var i=0; i<u.length; ++i) {
            var t = 0;
            for (var j=0; j<u.length; ++j)
            t += this.A(i,j) * u[j];
            v[i] = t;
        }
    }

    function Atu(u : number[], v : number[]) : void {
        for (var i=0; i<u.length; ++i) {
            var t = 0;
            for (var j=0; j<u.length; ++j)
            t += this.A(j,i) * u[j];
            v[i] = t;
        }
    }

    function AtAu(u : number[], v : number[], w : number[]) : void {
        this.Au(u,w);
        this.Atu(w,v);
    }

    function spectralnorm(n : number) : number {
        var i = 0;
        var u = new Array.<number>;
        var v = new Array.<number>;;
        var w = new Array.<number>;;
        var vv = 0;
        var vBv = 0;
        for (i=0; i<n; ++i) {
            u[i] = 1; v[i] = w[i] = 0;
        }
        for (i=0; i<10; ++i) {
            this.AtAu(u,v,w);
            this.AtAu(v,u,w);
        }
        for (i=0; i<n; ++i) {
            vBv += u[i]*v[i];
            vv  += v[i]*v[i];
        }
        return Math.sqrt(vBv/vv);
    }

    function constructor() {
        for (var i = 6; i <= 48; i *= 2) {
            this.spectralnorm(i);
        }
    }

    static function main(args : string[]) : void {
        new _Main();
    }
}