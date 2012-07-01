// The Great Computer Language Shootout
//  http://shootout.alioth.debian.org
//
//  Contributed by Ian Osgood

class _Main {
    var last = 42;
    var A = 3877;
    var C = 29573;
    var M = 139968;

    function rand(max : number) : number {
        this.last = (this.last * this.A + this.C) % this.M;
        return max * this.last / this.M;
    }

    var ALU =
    "GGCCGGGCGCGGTGGCTCACGCCTGTAATCCCAGCACTTTGG" +
    "GAGGCCGAGGCGGGCGGATCACCTGAGGTCAGGAGTTCGAGA" +
    "CCAGCCTGGCCAACATGGTGAAACCCCGTCTCTACTAAAAAT" +
    "ACAAAAATTAGCCGGGCGTGGTGGCGCGCGCCTGTAATCCCA" +
    "GCTACTCGGGAGGCTGAGGCAGGAGAATCGCTTGAACCCGGG" +
    "AGGCGGAGGTTGCAGTGAGCCGAGATCGCGCCACTGCACTCC" +
    "AGCCTGGGCGACAGAGCGAGACTCCGTCTCAAAAA";

    var IUB = {
        a:0.27, c:0.12, g:0.12, t:0.27,
        B:0.02, D:0.02, H:0.02, K:0.02,
        M:0.02, N:0.02, R:0.02, S:0.02,
        V:0.02, W:0.02, Y:0.02
    };

    var HomoSap = {
        a: 0.3029549426680,
        c: 0.1979883004921,
        g: 0.1975473066391,
        t: 0.3015094502008
    };

    function makeCumulative(table : Map.<number>) : void {
        var last : variant = null;
        for (var c in table) {
            if (last != null) table[c] += table[last as string];
            last = c;
        }
    }

    function fastaRepeat(n : number, seq : string) : void {
        var seqi = 0, lenOut = 60;
        while (n>0) {
            if (n<lenOut) lenOut = n;
            if (seqi + lenOut < seq.length) {
                this.ret = seq.substring(seqi, seqi+lenOut);
                seqi += lenOut;
            } else {
                var s = seq.substring(seqi);
                seqi = lenOut - s.length;
                this.ret = s + seq.substring(0, seqi);
            }
            n -= lenOut;
        }
    }

    function fastaRandom(n : number, table : Map.<number>) : void {
        var line = new Array.<string>(60);
        this.makeCumulative(table);
        while (n>0) {
            if (n<line.length) line = new Array.<string>(n);
            for (var i=0; i<line.length; i++) {
                var r = this.rand(1);
                for (var c in table) {
                    if (r < table[c]) {
                        line[i] = c;
                        break;
                    }
                }
            }
            this.ret = line.join('');
            n -= line.length;
        }
    }

    var ret : string;

    function constructor() {
        var count = 7;
        this.fastaRepeat(2*count*100000, this.ALU);
        this.fastaRandom(3*count*1000, this.IUB);
        this.fastaRandom(5*count*1000, this.HomoSap);
    }

    static function main(args : string[]) : void {
        new _Main();
    }
}