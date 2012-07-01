/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

class _Main {
    /*
     * Configurable variables. You may need to tweak these to be compatible with
     * the server-side, but the defaults work in most cases.
     */

    static const hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
    static const b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
    static const chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

    /*
     * These are the functions you'll usually want to call
     * They take string arguments and return either hex or base-64 encoded strings
     */
    function hex_sha1(s : string) : string {
        return this.binb2hex(this.core_sha1(this.str2binb(s),s.length * _Main.chrsz));
    }
    function b64_sha1(s : string) : string {
        return this.binb2b64(this.core_sha1(this.str2binb(s),s.length * _Main.chrsz));
    }
    function str_sha1(s : string) : string {
        return this.binb2str(this.core_sha1(this.str2binb(s),s.length * _Main.chrsz));
    }
    function hex_hmac_sha1(key : string, data : string) : string {
        return this.binb2hex(this.core_hmac_sha1(key, data));
    }
    function b64_hmac_sha1(key : string, data : string) : string {
        return this.binb2b64(this.core_hmac_sha1(key, data));
    }
    function str_hmac_sha1(key : string, data : string) : string {
        return this.binb2str(this.core_hmac_sha1(key, data));
    }

    /*
 * Perform a simple self-test to see if the VM is working
 */
    function sha1_vm_test() : boolean
    {
        return this.hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
    }

    /*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
    function core_sha1(x : Array.<number>, len : number) : Array.<number>
    {
        /* append padding */
        x[len >> 5] |= 0x80 << (24 - len % 32);
        x[((len + 64 >> 9) << 4) + 15] = len;

        var w = new number[80];
        var a =  1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d =  271733878;
        var e = -1009589776;

        for(var i = 0; i < x.length; i += 16)
        {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            var olde = e;

            for(var j = 0; j < 80; j++)
            {
                if(j < 16) w[j] = x[i + j];
                else w[j] = this.rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);

                var t : Nullable.<number> = w[j];
                var t = this.safe_add(this.safe_add(this.rol(a, 5), this.sha1_ft(j, b, c, d)),
                                      this.safe_add(this.safe_add(e, t as number), this.sha1_kt(j)));
                e = d;
                d = c;
                c = this.rol(b, 30);
                b = a;
                a = t;
            }

            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
            e = this.safe_add(e, olde);
        }
        return [a, b, c, d, e];

    }

    /*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
    function sha1_ft(t : number, b : number, c : number, d : number) : number
    {
        if(t < 20) return (b & c) | ((~b) & d);
        if(t < 40) return b ^ c ^ d;
        if(t < 60) return (b & c) | (b & d) | (c & d);
        return b ^ c ^ d;
    }

    /*
     * Determine the appropriate additive constant for the current iteration
     */
    function sha1_kt(t : number) : number
    {
        return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
        (t < 60) ? -1894007588 : -899497514;
    }

    /*
 * Calculate the HMAC-SHA1 of a key and some data
 */
    function core_hmac_sha1(key : string, data : string) : Array.<number>
    {
        var bkey = this.str2binb(key);
        if(bkey.length > 16) bkey = this.core_sha1(bkey, key.length * _Main.chrsz);

        var ipad = new number[16];
        var opad = new number[16];
        for(var i = 0; i < 16; i++)
        {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = this.core_sha1(ipad.concat(this.str2binb(data)), 512 + data.length * _Main.chrsz);
        return this.core_sha1(opad.concat(hash), 512 + 160);
    }

    /*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
    function safe_add(x : number, y : number) : number
    {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
 * Bitwise rotate a 32-bit number to the left.
 */
    function rol(num : number, cnt : number) : number
    {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
    function str2binb(str : string) : Array.<number>
    {
        var bin = new number[];
        var mask = (1 << _Main.chrsz) - 1;
        for(var i = 0; i < str.length * _Main.chrsz; i += _Main.chrsz)
        bin[i>>5] |= (str.charCodeAt(i / _Main.chrsz) & mask) << (32 - _Main.chrsz - i%32);
        return bin;
    }

    /*
 * Convert an array of big-endian words to a string
 */
    function binb2str(bin : Array.<number>) : string
    {
        var str = "";
        var mask = (1 << _Main.chrsz) - 1;
        for(var i = 0; i < bin.length * 32; i += _Main.chrsz)
        str += String.fromCharCode((bin[i>>5] >>> (32 - _Main.chrsz - i%32)) & mask);
        return str;
    }

    /*
 * Convert an array of big-endian words to a hex string.
 */
    function binb2hex(binarray : Array.<number>) : string
    {
        var hex_tab = _Main.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++)
        {
            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
            hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
        }
        return str;
    }

    /*
 * Convert an array of big-endian words to a base-64 string
 */
    function binb2b64(binarray : Array.<number>) : string
    {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i += 3)
        {
            var triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16)
            | (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 )
            |  ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
            for(var j = 0; j < 4; j++)
            {
                if(i * 8 + j * 6 > binarray.length * 32) str += _Main.b64pad;
                else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
            }
        }
        return str;
    }

    function constructor() {
        var plainText = [
            "Two households, both alike in dignity,\n",
            "In fair Verona, where we lay our scene,\n",
            "From ancient grudge break to new mutiny,\n",
            "Where civil blood makes civil hands unclean.\n",
            "From forth the fatal loins of these two foes\n",
            "A pair of star-cross'd lovers take their life;\n",
            "Whole misadventured piteous overthrows\n",
            "Do with their death bury their parents' strife.\n",
            "The fearful passage of their death-mark'd love,\n",
            "And the continuance of their parents' rage,\n",
            "Which, but their children's end, nought could remove,\n",
            "Is now the two hours' traffic of our stage;\n",
            "The which if you with patient ears attend,\n",
            "What here shall miss, our toil shall strive to mend."
            ].join("");
        for (var i = 0; i <4; i++) {
            plainText += plainText;
        }
        var sha1Output = this.hex_sha1(plainText);
        log sha1Output;
    }

    static function main(args : string[]) : void {
        new _Main();
    }
}
