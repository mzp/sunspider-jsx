class _Main {
    var letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];
    var colors  = ["FF","CC","99","66","33","00"];

    var endResult : string;

    function doTest() : void
    {
        this.endResult = "";

        // make up email address
        for (var k=0;k<4000;k++)
        {
            var username = this.makeName(6);
            var email : string = "";
            (k%2 != 0)?email=username+"@mac.com":email=username+"(at)mac.com";

            // validate the email address
            var pattern = /^[a-zA-Z0-9\-\._]+@[a-zA-Z0-9\-_]+(\.?[a-zA-Z0-9\-_]*)\.[a-zA-Z]{2,3}$/;

            if(pattern.test(email))
            {
                var r = email + " appears to be a valid email address.";
                this.addResult(r);
            }
            else
            {
                r = email + " does NOT appear to be a valid email address.";
                this.addResult(r);
            }
        }

        // make up ZIP codes
        for (var s=0;s<4000;s++)
        {
            var zipGood = true;
            var zip : string = this.makeNumber(4);
            (s%2 != 0)?zip=zip+"xyz":zip=zip+"7";

            // validate the zip code
            for (var i = 0; i < zip.length; i++) {
                var ch = zip.charAt(i);
                if (ch < "0" || ch > "9") {
                    zipGood = false;
                    r = zip + " contains letters.";
                    this.addResult(r);
                }
            }
            if (zipGood && zip.length>5)
            {
                zipGood = false;
                r = zip + " is longer than five characters.";
                this.addResult(r);
            }
            if (zipGood)
            {
                r = zip + " appears to be a valid ZIP code.";
                this.addResult(r);
            }
        }
    }

    function makeName(n : number) : string
    {
        var tmp = "";
        for (var i=0;i<n;i++)
        {
            var l = Math.floor(26*Math.random());
            tmp += this.letters[l];
        }
        return tmp;
    }

    function makeNumber(n : number): string
    {
        var tmp = "";
        for (var i=0;i<n;i++)
        {
            var l = Math.floor(9*Math.random());
            tmp = tmp + l.toString();
        }
        return tmp;
    }

    function addResult(r : string) : void
    {
        this.endResult += "\n" + r;
    }

    function constructor() {
        this.doTest();
    }

    static function main(args : string[]) : void {
        new _Main();
    }
}