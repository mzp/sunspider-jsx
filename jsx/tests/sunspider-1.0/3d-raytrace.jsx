/*
 * Copyright (C) 2007 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE COMPUTER, INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE COMPUTER, INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

class Util {
    static function createVector(x : number, y : number, z : number) : number[] {
        return [x, y, z];
    }

    static function sqrLengthVector(self : number[]) : number {
        return self[0] * self[0] + self[1] * self[1] + self[2] * self[2];
    }

    static function lengthVector(self : number[]) : number {
        return Math.sqrt(self[0] * self[0] + self[1] * self[1] + self[2] * self[2]);
    }

    static function addVector(self : number[], v : number[]) : number[] {
        self[0] += v[0];
        self[1] += v[1];
        self[2] += v[2];
        return self;
    }

    static function subVector(self : number[], v : number[]) : number[] {
        self[0] -= v[0];
        self[1] -= v[1];
        self[2] -= v[2];
        return self;
    }

    static function scaleVector(self : number[], scale : number) : number[] {
        self[0] *= scale;
        self[1] *= scale;
        self[2] *= scale;
        return self;
    }

    static function normaliseVector(self : number[]) : number[] {
        var len = Math.sqrt(self[0] * self[0] + self[1] * self[1] + self[2] * self[2]);
        self[0] /= len;
        self[1] /= len;
        self[2] /= len;
        return self;
    }

    static function add(v1 : number[], v2 : number[]) : number[] {
        return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
    }

    static function sub(v1 : number[], v2 : number[]) : number[] {
        return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
    }

    static function scalev(v1 : number[], v2 : number[]) : number[] {
        return [ v1[0] * v2[0], v1[1] * v2[1], v1[2] * v2[2] ];
    }

    static function dot(v1 : number[], v2 : number[]) : number {
        return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
    }

    static function scale(v : number[], scale : number) : number[] {
        return [v[0] * scale, v[1] * scale, v[2] * scale];
    }

    static function cross(v1 : number[], v2 : number[]) : number[] {
        return [v1[1] * v2[2] - v1[2] * v2[1],
            v1[2] * v2[0] - v1[0] * v2[2],
            v1[0] * v2[1] - v1[1] * v2[0]];

    }

    static function normalise(v : number[]) : number[] {
        var len = Util.lengthVector(v);
        return [v[0] / len, v[1] / len, v[2] / len];
    }

    static function transformMatrix(self : number[], v : number[]) : number[] {
        var vals = self;
        var x  = vals[0] * v[0] + vals[1] * v[1] + vals[2] * v[2] + vals[3];
        var y  = vals[4] * v[0] + vals[5] * v[1] + vals[6] * v[2] + vals[7];
        var z  = vals[8] * v[0] + vals[9] * v[1] + vals[10] * v[2] + vals[11];
        return [x, y, z];
    }

    static function invertMatrix(self : number[]) : number[] {
        var temp = new number[16];
        var tx = -self[3];
        var ty = -self[7];
        var tz = -self[11];
        for (var h = 0; h < 3; h++) {
            for (var v = 0; v < 3; v++) {
                temp[h + v * 4] = self[v + h * 4];
            }
        }
        for (var i = 0; i < 11; i++) {
            self[i] = temp[i];
        }
        self[3] = tx * self[0] + ty * self[1] + tz * self[2];
        self[7] = tx * self[4] + ty * self[5] + tz * self[6];
        self[11] = tx * self[8] + ty * self[9] + tz * self[10];
        return self;
    }
}

// Triangle intersection using barycentric coord method
class Triangle {
    var normal : number[];
    var nu : number;
    var nv : number;
    var nd : number;
    var det : number;
    var eu : number;
    var ev : number;
    var nu1 : number;
    var nv1 : number;
    var nu2 : number;
    var nv2 : number;
    var material = [0.7, 0.7, 0.7];
    var shader : Nullable.<(Nullable.<Triangle>, number[], number[]) -> number[]> = null;
    var axis : number;

    function constructor(p1 : number[], p2 : number[], p3 : number[]) {
        var edge1 = Util.sub(p3, p1);
        var edge2 = Util.sub(p2, p1);
        var normal = Util.cross(edge1, edge2);
        if (Math.abs(normal[0]) > Math.abs(normal[1])) {
            if (Math.abs(normal[0]) > Math.abs(normal[2])) {
                this.axis = 0;
            } else {
                this.axis = 2;
            }
        } else {
            if (Math.abs(normal[1]) > Math.abs(normal[2])) {
                this.axis = 1;
            } else {
                this.axis = 2;
            }
        }
        var u = (this.axis + 1) % 3;
        var v = (this.axis + 2) % 3;
        var u1 = edge1[u];
        var v1 = edge1[v];

        var u2 = edge2[u];
        var v2 = edge2[v];
        this.normal = Util.normalise(normal);
        this.nu = normal[u] / normal[this.axis];
        this.nv = normal[v] / normal[this.axis];
        this.nd = Util.dot(normal, p1) / normal[this.axis];
        var det = u1 * v2 - v1 * u2;
        this.eu = p1[u];
        this.ev = p1[v];
        this.nu1 = u1 / det;
        this.nv1 = -v1 / det;
        this.nu2 = v2 / det;
        this.nv2 = -u2 / det;
        this.material = [0.7, 0.7, 0.7];
    }

    function intersect(orig : number[], dir : number[], near : number, far : number) : Nullable.<number> {
        var u = (this.axis + 1) % 3;
        var v = (this.axis + 2) % 3;
        var d = dir[this.axis] + this.nu * dir[u] + this.nv * dir[v];
        var t = (this.nd - orig[this.axis] - this.nu * orig[u] - this.nv * orig[v]) / d;
        if (t < near || t > far)
          return null;
        var Pu = orig[u] + t * dir[u] - this.eu;
        var Pv = orig[v] + t * dir[v] - this.ev;
        var a2 = Pv * this.nu1 + Pu * this.nv1;
        if (a2 < 0)
          return null;
        var a3 = Pu * this.nu2 + Pv * this.nv2;
        if (a3 < 0)
          return null;

        if ((a2 + a3) > 1)
          return null;
        return t;
    }
}

class Scene {
    static const zero = [0,0,0];
    var triangles : Array.<Triangle>;
    var lights : Array.<variant>;

    var ambient = [0,0,0];
    var background = [0.8,0.8,1];

    function constructor(a_triangles : Array.<Triangle>) {
        this.triangles = a_triangles;
        this.lights = [] : variant[];

    }


    function intersect(origin : number[], dir : number[], near : number, far : number) : number[]{
        var closest : Nullable.<Triangle> = null;
        for (var i = 0; i < this.triangles.length; i++) {
            var triangle = this.triangles[i];
            var d = triangle.intersect(origin, dir, near, far);
            if (d == null || d > far || d < near)
            continue;
            far = d;
            closest = triangle;
        }

        if (!closest)
        return [this.background[0],this.background[1],this.background[2]];

        var normal = closest.normal;
        var hit = Util.add(origin, Util.scale(dir, far));
        if (Util.dot(dir, normal) > 0)
        normal = [-normal[0], -normal[1], -normal[2]];

        var colour : variant = null;
        if (closest.shader) {
            colour = closest.shader(closest, hit, dir);
        } else {
            colour = closest.material;
        }

        // do reflection
        var reflected : Nullable.<Array.<number>> = null;
        if (colour["reflection"] as number > 0.001) {
            var reflection = Util.addVector(Util.scale(normal, -2*Util.dot(dir, normal)), dir);
            reflected = this.intersect(hit, reflection, 0.0001, 1000000);
            if (colour["reflection"] as number >= 0.999999) {
                return reflected;
            }
        }

        var l = [this.ambient[0], this.ambient[1], this.ambient[2]];
        for (var i = 0; i < this.lights.length; i++) {
            var light = this.lights[i];
            var toLight = Util.sub(light as number[], hit);
            var distance = Util.lengthVector(toLight);
            Util.scaleVector(toLight, 1.0/distance);
            distance -= 0.0001;
            if (this.blocked(hit, toLight, distance))
            continue;
            var nl = Util.dot(normal, toLight);
            if (nl > 0)
            Util.addVector(l, Util.scale(light['colour'] as number[], nl));
        }
        l = Util.scalev(l, colour as number[]);
        if (reflected) {
            l = Util.addVector(Util.scaleVector(l, 1 - (colour['reflection'] as number)), Util.scaleVector(reflected, colour['reflection'] as number));
        }
        return l;
    }

    function blocked(O : number[], D : number[], far : number) : boolean {
        var near = 0.0001;
        for (var i = 0; i < this.triangles.length; i++) {
            var triangle = this.triangles[i];
            var d = triangle.intersect(O, D, near, far);
            if (d == null || d > far || d < near)
            continue;
            return true;
        }

        return false;
    }
}

// this camera code is from notes i made ages ago, it is from *somewhere* -- i cannot remember where That Somewhere is
class Camera {
    var origin : number[];
    var directions = new number[][4];
    function constructor(origin : number[], lookat : number[], up : number[]) {
        var zaxis = Util.normaliseVector(Util.subVector(lookat, origin));
        var xaxis = Util.normaliseVector(Util.cross(up, zaxis));
        var yaxis = Util.normaliseVector(Util.cross(xaxis, Util.subVector([0,0,0], zaxis)));
        var m = new number[16];
        m[0] = xaxis[0]; m[1] = xaxis[1]; m[2] = xaxis[2];
        m[4] = yaxis[0]; m[5] = yaxis[1]; m[6] = yaxis[2];
        m[8] = zaxis[0]; m[9] = zaxis[1]; m[10] = zaxis[2];
        Util.invertMatrix(m);
        m[3] = 0; m[7] = 0; m[11] = 0;
        this.origin = origin;
        this.directions[0] = Util.normalise([-0.7,  0.7, 1]);
        this.directions[1] = Util.normalise([ 0.7,  0.7, 1]);
        this.directions[2] = Util.normalise([ 0.7, -0.7, 1]);
        this.directions[3] = Util.normalise([-0.7, -0.7, 1]);
        this.directions[0] = Util.transformMatrix(m, this.directions[0]);
        this.directions[1] = Util.transformMatrix(m, this.directions[1]);
        this.directions[2] = Util.transformMatrix(m, this.directions[2]);
        this.directions[3] = Util.transformMatrix(m, this.directions[3]);
    }

    function generateRayPair(y : number) : variant[] {
        var rays = [(new Object()) as variant, (new Object()) as variant];
        rays[0]['origin'] = this.origin;
        rays[1]['origin'] = this.origin;
        rays[0]['dir'] = Util.addVector(Util.scale(this.directions[0], y), Util.scale(this.directions[3], 1 - y));
        rays[1]['dir'] = Util.addVector(Util.scale(this.directions[1], y), Util.scale(this.directions[2], 1 - y));
        return rays;
    }

    function renderRows(scene : Scene, pixels : number[][][], width : number, height : number, starty : number, stopy : number) : void {
        for (var y = starty; y < stopy; y++) {
            var rays = this.generateRayPair(y / height);
            for (var x = 0; x < width; x++) {
                var xp = x / width;
                var origin = Util.addVector(Util.scale(rays[0]['origin'] as number[], xp), Util.scale(rays[1]['origin'] as number[], 1 - xp));
                var dir = Util.normaliseVector(
                    Util.addVector(Util.scale(rays[0]['dir'] as number[], xp),
                                   Util.scale(rays[1]['dir'] as number[], 1 - xp)));
                var l = scene.intersect(origin, dir, NaN, NaN);
                pixels[y][x] = l;
            }
        }
    }

    function render(scene : Scene, pixels : number[][][], width : number, height : number) : void {
        var cam = this;
        var row = 0;
        this.renderRows(scene, pixels, width, height, 0, height);
    }
}

class _Main {
    function raytraceScene() : number[][][] {
        var startDate = new Date().getTime();
        var numTriangles = 2 * 6;
        var triangles = [] : Array.<Triangle>; //numTriangles);
        var tfl = Util.createVector(-10,  10, -10);
        var tfr = Util.createVector( 10,  10, -10);
        var tbl = Util.createVector(-10,  10,  10);
        var tbr = Util.createVector( 10,  10,  10);
        var bfl = Util.createVector(-10, -10, -10);
        var bfr = Util.createVector( 10, -10, -10);
        var bbl = Util.createVector(-10, -10,  10);
        var bbr = Util.createVector( 10, -10,  10);

        // cube!!!
        // front
        var i = 0;

        triangles[i++] = new Triangle(tfl, tfr, bfr);
        triangles[i++] = new Triangle(tfl, bfr, bfl);
        // back
        triangles[i++] = new Triangle(tbl, tbr, bbr);
        triangles[i++] = new Triangle(tbl, bbr, bbl);
        //        triangles[i-1].material = [0.7,0.2,0.2];
        //            triangles[i-1].material.reflection = 0.8;
        // left
        triangles[i++] = new Triangle(tbl, tfl, bbl);
        //            triangles[i-1].reflection = 0.6;
        triangles[i++] = new Triangle(tfl, bfl, bbl);
        //            triangles[i-1].reflection = 0.6;
        // right
        triangles[i++] = new Triangle(tbr, tfr, bbr);
        triangles[i++] = new Triangle(tfr, bfr, bbr);
        // top
        triangles[i++] = new Triangle(tbl, tbr, tfr);
        triangles[i++] = new Triangle(tbl, tfr, tfl);
        // bottom
        triangles[i++] = new Triangle(bbl, bbr, bfr);
        triangles[i++] = new Triangle(bbl, bfr, bfl);

        //Floor!!!!
        var green = Util.createVector(0.0, 0.4, 0.0);
        var grey  = Util.createVector(0.4, 0.4, 0.4) as variant;
        grey['reflection'] = 1.0;
        var floorShader = function(tri : Triangle, pos : number[], view : number[]) : number[] {
            var x = ((pos[0]/32) % 2 + 2) % 2;
            var z = ((pos[2]/32 + 0.3) % 2 + 2) % 2;
            if (x < 1 != z < 1) {
                return grey as number[];
            } else {
                return green as number[];
            }
        };
        var ffl = Util.createVector(-1000, -30, -1000);
        var ffr = Util.createVector( 1000, -30, -1000);
        var fbl = Util.createVector(-1000, -30,  1000);
        var fbr = Util.createVector( 1000, -30,  1000);
        triangles[i++] = new Triangle(fbl, fbr, ffr);
        triangles[i-1].shader = floorShader;
        triangles[i++] = new Triangle(fbl, ffr, ffl);
        triangles[i-1].shader = floorShader;

        var _scene = new Scene(triangles);
        _scene.lights[0] = Util.createVector(20, 38, -22);
        _scene.lights[0]['colour'] = Util.createVector(0.7, 0.3, 0.3);
        _scene.lights[1] = Util.createVector(-23, 40, 17);
        _scene.lights[1]['colour'] = Util.createVector(0.7, 0.3, 0.3);
        _scene.lights[2] = Util.createVector(23, 20, 17);
        _scene.lights[2]['colour'] = Util.createVector(0.7, 0.7, 0.7);
        _scene.ambient = Util.createVector(0.1, 0.1, 0.1);
        //  _scene.background = Util.createVector(0.7, 0.7, 1.0);

        var size = 30;
        var pixels = [] : number[][][];
        for (var y = 0; y < size; y++) {
            pixels[y] = [] : number[][];
            for (var x = 0; x < size; x++) {
                pixels[y][x] = [] : number[];
            }
        }

        var _camera = new Camera(Util.createVector(-40, 40, 40), Util.createVector(0, 0, 0), Util.createVector(0, 1, 0));
        _camera.render(_scene, pixels, size, size);

        return pixels;
    }

    function arrayToCanvasCommands(pixels : number[][][]) : string {
        var s = '<canvas id="renderCanvas" width="30px" height="30px"></canvas><scr' + 'ipt>\nvar pixels = [';
        var size = 30;
        for (var y = 0; y < size; y++) {
          s += "[";
          for (var x = 0; x < size; x++) {
              s += "[" + pixels[y][x].toString() + "],";
           }
           s+= "],";
        }
        s += '];\n    var canvas = document.getElementById("renderCanvas").getContext("2d");\n';
s += '        \n';
s += '        \n';
s += '        var size = 30;\n';
s += '        canvas.fillStyle = "red";\n';
s += '        canvas.fillRect(0, 0, size, size);\n';
s += '        canvas.scale(1, -1);\n';
s += '        canvas.translate(0, -size);\n';
s += '        \n';
s += '        if (!canvas.setFillColor)\n';
s += '        canvas.setFillColor = function(r, g, b, a) {\n';
s += '            this.fillStyle = "rgb("+[Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)]+")";\n';
s += '        }\n';
s += '        \n';
s += '        for (var y = 0; y < size; y++) {\n';
s += '            for (var x = 0; x < size; x++) {\n';
s += '                var l = pixels[y][x];\n';
s += '                canvas.setFillColor(l[0], l[1], l[2], 1);\n';
s += '                canvas.fillRect(x, y, 1, 1);\n';
s += '            }\n';
s += '        }</scr' + 'ipt>';

        return s;
    }

    function constructor() {
        var testOutput = this.arrayToCanvasCommands( this.raytraceScene());
        log testOutput;
    }

    static function main(args : string[]) : void {
        new _Main();
    }
}
