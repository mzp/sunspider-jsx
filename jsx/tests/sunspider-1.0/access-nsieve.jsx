// The Great Computer Language Shootout
// http://shootout.alioth.debian.org/
//
// modified by Isaac Gouy
class _Main {
    function pad(number : number, width : number) : string {
        var s = number.toString();
        var prefixWidth = width - s.length;
        if (prefixWidth>0){
            for (var i=1; i<=prefixWidth; i++) s = " " + s;
        }
        return s;
    }

    function nsieve(m : number, isPrime : Array.<boolean>) : number {
        var i, k, count;

        for (i=2; i<=m; i++) { isPrime[i] = true; }
        count = 0;

        for (i=2; i<=m; i++){
            if (isPrime[i]) {
                for (k=i+i; k<=m; k+=i) isPrime[k] = false;
                count++;
            }
        }
        return count;
    }

    function sieve() : void {
        for (var i = 1; i <= 3; i++ ) {
            var m = (1<<i)*10000;
            var flags = new boolean[m+1];
            this.nsieve(m, flags);
        }
    }

    function constructor() {
        this.sieve();
    }

    static function main(args: string[]) : void {
        new _Main();
    }
}
