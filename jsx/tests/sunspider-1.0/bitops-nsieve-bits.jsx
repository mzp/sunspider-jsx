// The Great Computer Language Shootout
//  http://shootout.alioth.debian.org
//
//  Contributed by Ian Osgood

class _Main  {
    static function pad(n : number,width : number) : string {
        var s = n.toString();
        while (s.length < width) s = ' ' + s;
        return s;
    }

    static function primes(isPrime : number[], n : number) : void {
        var i, count = 0, m = 10000<<n, size = m+31>>5;

        for (i=0; i<size; i++) isPrime[i] = 0xffffffff;

        for (i=2; i<m; i++)
        if (isPrime[i>>5] & 1<<(i&31)) {
            for (var j=i+i; j<m; j+=i)
            isPrime[j>>5] &= ~(1<<(j&31));
            count++;
        }
    }

    static function sieve() : number[] {
        for (var i = 4; i <= 4; i++) {
            var isPrime = new number[(10000<<i)+31>>5];
            _Main.primes(isPrime, i);
        }
        return isPrime;
    }

    static function main(args : string[]) : void {
        var result = _Main.sieve();
        log result;
    }
}