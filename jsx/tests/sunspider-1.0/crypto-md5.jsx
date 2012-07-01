/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
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
    function hex_md5(s : string) : string {
        return this.binl2hex(this.core_md5(this.str2binl(s), s.length * _Main.chrsz));
    }

    function b64_md5(s : string) : string {
        return this.binl2b64(this.core_md5(this.str2binl(s), s.length * _Main.chrsz));
    }

    function str_md5(s : string) : string {
        return this.binl2str(this.core_md5(this.str2binl(s), s.length * _Main.chrsz));
    }

    function hex_hmac_md5(key : string, data : string) : string {
        return this.binl2hex(this.core_hmac_md5(key, data));
    }

    function b64_hmac_md5(key : string, data : string) : string {
        return this.binl2b64(this.core_hmac_md5(key, data));
    }

    function str_hmac_md5(key : string, data : string) : string {
        return this.binl2str(this.core_hmac_md5(key, data));
    }

    /*
     * Perform a simple self-test to see if the VM is working
     */
    function md5_vm_test() : boolean
    {
        return this.hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
    }

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length
     */
    function core_md5(x : Array.<number>, len : number) : Array.<number>
    {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a =  1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d =  271733878;

        for(var i = 0; i < x.length; i += 16)
        {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = this.md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
            d = this.md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
            c = this.md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
            b = this.md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
            a = this.md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
            d = this.md5_ff(d, a, b, c, x[i+ 5] as number, 12,  1200080426);
            c = this.md5_ff(c, d, a, b, x[i+ 6] as number, 17, -1473231341);
            b = this.md5_ff(b, c, d, a, x[i+ 7] as number, 22, -45705983);
            a = this.md5_ff(a, b, c, d, x[i+ 8] as number, 7 ,  1770035416);
            d = this.md5_ff(d, a, b, c, x[i+ 9] as number, 12, -1958414417);
            c = this.md5_ff(c, d, a, b, x[i+10] as number, 17, -42063);
            b = this.md5_ff(b, c, d, a, x[i+11] as number, 22, -1990404162);
            a = this.md5_ff(a, b, c, d, x[i+12] as number, 7 ,  1804603682);
            d = this.md5_ff(d, a, b, c, x[i+13] as number, 12, -40341101);
            c = this.md5_ff(c, d, a, b, x[i+14] as number, 17, -1502002290);
            b = this.md5_ff(b, c, d, a, x[i+15] as number, 22,  1236535329);

            a = this.md5_gg(a, b, c, d, x[i+ 1] as number, 5 , -165796510);
            d = this.md5_gg(d, a, b, c, x[i+ 6] as number, 9 , -1069501632);
            c = this.md5_gg(c, d, a, b, x[i+11] as number, 14,  643717713);
            b = this.md5_gg(b, c, d, a, x[i+ 0] as number, 20, -373897302);
            a = this.md5_gg(a, b, c, d, x[i+ 5] as number, 5 , -701558691);
            d = this.md5_gg(d, a, b, c, x[i+10] as number, 9 ,  38016083);
            c = this.md5_gg(c, d, a, b, x[i+15] as number, 14, -660478335);
            b = this.md5_gg(b, c, d, a, x[i+ 4] as number, 20, -405537848);
            a = this.md5_gg(a, b, c, d, x[i+ 9] as number, 5 ,  568446438);
            d = this.md5_gg(d, a, b, c, x[i+14] as number, 9 , -1019803690);
            c = this.md5_gg(c, d, a, b, x[i+ 3] as number, 14, -187363961);
            b = this.md5_gg(b, c, d, a, x[i+ 8] as number, 20,  1163531501);
            a = this.md5_gg(a, b, c, d, x[i+13] as number, 5 , -1444681467);
            d = this.md5_gg(d, a, b, c, x[i+ 2] as number, 9 , -51403784);
            c = this.md5_gg(c, d, a, b, x[i+ 7] as number, 14,  1735328473);
            b = this.md5_gg(b, c, d, a, x[i+12] as number, 20, -1926607734);

            a = this.md5_hh(a, b, c, d, x[i+ 5] as number, 4 , -378558);
            d = this.md5_hh(d, a, b, c, x[i+ 8] as number, 11, -2022574463);
            c = this.md5_hh(c, d, a, b, x[i+11] as number, 16,  1839030562);
            b = this.md5_hh(b, c, d, a, x[i+14] as number, 23, -35309556);
            a = this.md5_hh(a, b, c, d, x[i+ 1] as number, 4 , -1530992060);
            d = this.md5_hh(d, a, b, c, x[i+ 4] as number, 11,  1272893353);
            c = this.md5_hh(c, d, a, b, x[i+ 7] as number, 16, -155497632);
            b = this.md5_hh(b, c, d, a, x[i+10] as number, 23, -1094730640);
            a = this.md5_hh(a, b, c, d, x[i+13] as number, 4 ,  681279174);
            d = this.md5_hh(d, a, b, c, x[i+ 0] as number, 11, -358537222);
            c = this.md5_hh(c, d, a, b, x[i+ 3] as number, 16, -722521979);
            b = this.md5_hh(b, c, d, a, x[i+ 6] as number, 23,  76029189);
            a = this.md5_hh(a, b, c, d, x[i+ 9] as number, 4 , -640364487);
            d = this.md5_hh(d, a, b, c, x[i+12] as number, 11, -421815835);
            c = this.md5_hh(c, d, a, b, x[i+15] as number, 16,  530742520);
            b = this.md5_hh(b, c, d, a, x[i+ 2] as number, 23, -995338651);

            a = this.md5_ii(a, b, c, d, x[i+ 0] as number, 6 , -198630844);
            d = this.md5_ii(d, a, b, c, x[i+ 7] as number, 10,  1126891415);
            c = this.md5_ii(c, d, a, b, x[i+14] as number, 15, -1416354905);
            b = this.md5_ii(b, c, d, a, x[i+ 5] as number, 21, -57434055);
            a = this.md5_ii(a, b, c, d, x[i+12] as number, 6 ,  1700485571);
            d = this.md5_ii(d, a, b, c, x[i+ 3] as number, 10, -1894986606);
            c = this.md5_ii(c, d, a, b, x[i+10] as number, 15, -1051523);
            b = this.md5_ii(b, c, d, a, x[i+ 1] as number, 21, -2054922799);
            a = this.md5_ii(a, b, c, d, x[i+ 8] as number, 6 ,  1873313359);
            d = this.md5_ii(d, a, b, c, x[i+15] as number, 10, -30611744);
            c = this.md5_ii(c, d, a, b, x[i+ 6] as number, 15, -1560198380);
            b = this.md5_ii(b, c, d, a, x[i+13] as number, 21,  1309151649);
            a = this.md5_ii(a, b, c, d, x[i+ 4] as number, 6 , -145523070);
            d = this.md5_ii(d, a, b, c, x[i+11] as number, 10, -1120210379);
            c = this.md5_ii(c, d, a, b, x[i+ 2] as number, 15,  718787259);
            b = this.md5_ii(b, c, d, a, x[i+ 9] as number, 21, -343485551);

            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
        }
        return [a, b, c, d];

    }

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5_cmn(q : number, a : number, b : number, x : number, s : number, t : number) : number
    {
        return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s),b);
    }
    function md5_ff(a : number, b : number, c : number, d : number, x : number, s : number, t : number) : number
    {
        return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5_gg(a : number, b : number, c : number, d : number, x : number, s : number, t : number) : number
    {
        return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5_hh(a : number, b : number, c : number, d : number, x : number, s : number, t : number) : number
    {
        return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a : number, b : number, c : number, d : number, x : number, s : number, t : number) : number
    {
        return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
     * Calculate the HMAC-MD5, of a key and some data
     */
    function core_hmac_md5(key : string, data : string) : Array.<number>
    {
        var bkey = this.str2binl(key);
        if(bkey.length > 16) bkey = this.core_md5(bkey, key.length * _Main.chrsz);

        var ipad = new number[16];
        var opad = new number[16];
        for(var i = 0; i < 16; i++)
        {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = this.core_md5(ipad.concat(this.str2binl(data)), 512 + data.length * _Main.chrsz);
        return this.core_md5(opad.concat(hash), 512 + 128);
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
    function bit_rol(num : number, cnt : number) : number
    {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
 * Convert a string to an array of little-endian words
 * If _Main.chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
    function str2binl(str : string) : Array.<number>
    {
        var bin = new number[];
        var mask = (1 << _Main.chrsz) - 1;
        for(var i = 0; i < str.length * _Main.chrsz; i += _Main.chrsz)
        bin[i>>5] |= (str.charCodeAt(i / _Main.chrsz) & mask) << (i%32);
        return bin;
    }

    /*
 * Convert an array of little-endian words to a string
 */
    function binl2str(bin : Array.<number>) : string
    {
        var str = "";
        var mask = (1 << _Main.chrsz) - 1;
        for(var i = 0; i < bin.length * 32; i += _Main.chrsz)
        str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
        return str;
    }

    /*
 * Convert an array of little-endian words to a hex string.
 */
    function binl2hex(binarray : Array.<number>) : string
    {
        var hex_tab = _Main.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++)
        {
            str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
            hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
        }
        return str;
    }

    /*
 * Convert an array of little-endian words to a base-64 string
 */
    function binl2b64(binarray : Array.<number>) : string
    {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i += 3)
        {
            var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
            | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
            |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
            for(var j = 0; j < 4; j++)
            {
                if(i * 8 + j * 6 > binarray.length * 32) str += _Main.b64pad;
                else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
            }
        }
        return str;
    }

    function constructor() {
        var plainText =[
            "Rebellious subjects, enemies to peace,\n",
            "Profaners of this neighbour-stained steel,--\n",
            "Will they not hear? What, ho! you men, you beasts,\n",
            "That quench the fire of your pernicious rage\n",
            "With purple fountains issuing from your veins,\n",
            "On pain of torture, from those bloody hands\n",
            "Throw your mistemper'd weapons to the ground,\n",
            "And hear the sentence of your moved prince.\n",
            "Three civil brawls, bred of an airy word,\n",
            "By thee, old Capulet, and Montague,\n",
            "Have thrice disturb'd the quiet of our streets,\n",
            "And made Verona's ancient citizens\n",
            "Cast by their grave beseeming ornaments,\n",
            "To wield old partisans, in hands as old,\n",
            "Canker'd with peace, to part your canker'd hate:\n",
            "If ever you disturb our streets again,\n",
            "Your lives shall pay the forfeit of the peace.\n",
            "For this time, all the rest depart away:\n",
            "You Capulet; shall go along with me:\n",
            "And, Montague, come you this afternoon,\n",
            "To know our further pleasure in this case,\n",
            "To old Free-town, our common judgment-place.\n",
            "Once more, on pain of death, all men depart."].join("");
        for (var i = 0; i <4; i++) {
            plainText += plainText;
        }
        var md5Output = this.hex_md5(plainText);
        log md5Output;
    }

    static function main(args : string[]) : void {
        new _Main();
    }
}
