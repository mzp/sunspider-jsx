/* The Great Computer Language Shootout
   http://shootout.alioth.debian.org/
   contributed by Isaac Gouy */

class Body {
    static const PI = 3.141592653589793;
    static const SOLAR_MASS = 4 * Body.PI * Body.PI;
    static const DAYS_PER_YEAR = 365.24;

    var x : number;
    var y : number;
    var z : number;
    var vx : number;
    var vy : number;
    var vz : number;
    var mass : number;

    function constructor(
        x : number,
        y : number,
        z : number,
        vx : number,
        vy : number,
        vz : number,
        mass : number
    ) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.vx = vx;
        this.vy = vy;
        this.vz = vz;
        this.mass = mass;
    }

    function offsetMomentum(px : number, py : number, pz : number) : Body {
        this.vx = -px / Body.SOLAR_MASS;
        this.vy = -py / Body.SOLAR_MASS;
        this.vz = -pz / Body.SOLAR_MASS;
        return this;
    }

    static function Jupiter() : Body {
        return new Body(
            4.84143144246472090e+00,
            -1.16032004402742839e+00,
            -1.03622044471123109e-01,
            1.66007664274403694e-03 * Body.DAYS_PER_YEAR,
            7.69901118419740425e-03 * Body.DAYS_PER_YEAR,
            -6.90460016972063023e-05 * Body.DAYS_PER_YEAR,
            9.54791938424326609e-04 * Body.SOLAR_MASS
        );
    }

    static function Saturn() : Body {
        return new Body(
            8.34336671824457987e+00,
            4.12479856412430479e+00,
            -4.03523417114321381e-01,
            -2.76742510726862411e-03 * Body.DAYS_PER_YEAR,
            4.99852801234917238e-03 * Body.DAYS_PER_YEAR,
            2.30417297573763929e-05 * Body.DAYS_PER_YEAR,
            2.85885980666130812e-04 * Body.SOLAR_MASS
        );
    }

    static function Uranus() : Body {
        return new Body(
            1.28943695621391310e+01,
            -1.51111514016986312e+01,
            -2.23307578892655734e-01,
            2.96460137564761618e-03 * Body.DAYS_PER_YEAR,
            2.37847173959480950e-03 * Body.DAYS_PER_YEAR,
            -2.96589568540237556e-05 * Body.DAYS_PER_YEAR,
            4.36624404335156298e-05 * Body.SOLAR_MASS
        );
    }

    static function Neptune() : Body {
        return new Body(
            1.53796971148509165e+01,
            -2.59193146099879641e+01,
            1.79258772950371181e-01,
            2.68067772490389322e-03 * Body.DAYS_PER_YEAR,
            1.62824170038242295e-03 * Body.DAYS_PER_YEAR,
            -9.51592254519715870e-05 * Body.DAYS_PER_YEAR,
            5.15138902046611451e-05 * Body.SOLAR_MASS
        );
    }

    static function Sun() : Body {
        return new Body(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, Body.SOLAR_MASS);
    }
}

class NBodySystem {
    var bodies : Array.<Body>;
    function constructor(bodies : Array.<Body>) {
        this.bodies = bodies;
        var px = 0.0;
        var py = 0.0;
        var pz = 0.0;
        var size = this.bodies.length;
        for (var i=0; i<size; i++){
            var b = this.bodies[i];
            var m = b.mass;
            px += b.vx * m;
            py += b.vy * m;
            pz += b.vz * m;
        }
        this.bodies[0].offsetMomentum(px,py,pz);
    }

    function advance(dt : number) : void {
        var dx, dy, dz, distance, mag;
        var size = this.bodies.length;

        for (var i=0; i<size; i++) {
            var bodyi = this.bodies[i];
            for (var j=i+1; j<size; j++) {
                var bodyj = this.bodies[j];
                dx = bodyi.x - bodyj.x;
                dy = bodyi.y - bodyj.y;
                dz = bodyi.z - bodyj.z;

                distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
                mag = dt / (distance * distance * distance);

                bodyi.vx -= dx * bodyj.mass * mag;
                bodyi.vy -= dy * bodyj.mass * mag;
                bodyi.vz -= dz * bodyj.mass * mag;

                bodyj.vx += dx * bodyi.mass * mag;
                bodyj.vy += dy * bodyi.mass * mag;
                bodyj.vz += dz * bodyi.mass * mag;
            }
        }

        for (var i=0; i<size; i++) {
            var body = this.bodies[i];
            body.x += dt * body.vx;
            body.y += dt * body.vy;
            body.z += dt * body.vz;
        }
    }

    function energy() : number {
        var dx, dy, dz, distance;
        var e = 0.0;
        var size = this.bodies.length;

        for (var i=0; i<size; i++) {
            var bodyi = this.bodies[i];

            e += 0.5 * bodyi.mass *
            ( bodyi.vx * bodyi.vx
                + bodyi.vy * bodyi.vy
                + bodyi.vz * bodyi.vz );

            for (var j=i+1; j<size; j++) {
                var bodyj = this.bodies[j];
                dx = bodyi.x - bodyj.x;
                dy = bodyi.y - bodyj.y;
                dz = bodyi.z - bodyj.z;

                distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
                e -= (bodyi.mass * bodyj.mass) / distance;
            }
        }
        return e;
    }
}

class _Main {
    static function main(args : string[]) : void {
        var ret;

        for ( var n = 3; n <= 24; n *= 2 ) {
            (function() : void {
                    var bodies = new NBodySystem( [
                            Body.Sun(),
                            Body.Jupiter(),
                            Body.Saturn(),
                            Body.Uranus(),
                            Body.Neptune()
                        ]);
                    var max = n * 100;

                    ret = bodies.energy();
                    for (var i=0; i<max; i++){
                        bodies.advance(0.01);
                    }
                    ret = bodies.energy();
                })();
        }
    }
}
