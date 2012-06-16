// The Computer Language Shootout
// http://shootout.alioth.debian.org/
// contributed by Isaac Gouy

class Main {
    static function ack(m : number, n : number) : number {
        if (m==0) { return n+1; }
        if (n==0) { return Main.ack(m-1,1); }
        return Main.ack(m-1, Main.ack(m,n-1) );
    }

    static function fib(n : number) : number {
        if (n < 2){ return 1; }
        return Main.fib(n-2) + Main.fib(n-1);
    }

    static function tak(x : number,y : number,z : number) : number {
        if (y >= x) return z;
        return Main.tak(
            Main.tak(x-1,y,z),
            Main.tak(y-1,z,x),
            Main.tak(z-1,x,y));
    }

    static function main() : void {
        for ( var i = 3; i <= 5; i++ ) {
            Main.ack(3,i);
            Main.fib(17.0+i);
            Main.tak(3*i+3,2*i+2,i+1);
        }
    }
}

class _Main { static function main(args: string[]) : void { Main.main(); }}