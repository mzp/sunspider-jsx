// Copyright (c) 2004 by Arthur Langereis (arthur_ext at domain xfinitegames, tld com)

class _Main {
    // 1 op = 2 assigns, 16 compare/branches, 8 ANDs, (0-8) ADDs, 8 SHLs
    // O(n)
    static function bitsinbyte(b : number) : number {
        var m = 1, c = 0;
        while(m<0x100) {
            if(b & m) c++;
            m <<= 1;
        }
        return c;
    }

    static function TimeFunc(func : (number) -> number) : number{
        var sum = 0;
        for(var x=0; x<350; x++)
        for(var y=0; y<256; y++) sum += func(y);
        return sum;
    }


    static function main(args : string[]) : void {
        var result = _Main.TimeFunc(_Main.bitsinbyte);
        log result;
    }
}
