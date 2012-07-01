// The Computer Language Shootout
// http://shootout.alioth.debian.org/
// contributed by Isaac Gouy

class _Main {
    static function ack(m : number, n : number) : number {
        if (m==0) { return n+1; }
        if (n==0) { return _Main.ack(m-1,1); }
        return _Main.ack(m-1, _Main.ack(m,n-1) );
    }

    static function fib(n : number) : number {
        if (n < 2){ return 1; }
        return _Main.fib(n-2) + _Main.fib(n-1);
    }

    static function tak(x : number,y : number,z : number) : number {
        if (y >= x) return z;
        return _Main.tak(
            _Main.tak(x-1,y,z),
            _Main.tak(y-1,z,x),
            _Main.tak(z-1,x,y));
    }

    static function main(args : string[]) : void {
        for ( var i = 3; i <= 5; i++ ) {
            _Main.ack(3,i);
            _Main.fib(17.0+i);
            _Main.tak(3*i+3,2*i+2,i+1);
        }
    }
}
