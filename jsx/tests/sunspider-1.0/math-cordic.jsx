/*
 * Copyright (C) Rich Moore.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY CONTRIBUTORS ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE COMPUTER, INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/////. Start CORDIC
class _Main {
    static const AG_CONST = 0.6072529350;

    function FIXED(X : number) : number
    {
        return X * 65536.0;
    }

    function FLOAT(X : number) : number
    {
        return X / 65536.0;
    }

    function DEG2RAD(X : number) : number
    {
        return 0.017453 * (X);
    }

    var Angles = new Array.<number>();

    var Target = 28.027;

    function cordicsincos(Target : number) : number {
        var X;
        var Y;
        var TargetAngle;
        var CurrAngle;
        var Step;

        X = this.FIXED(_Main.AG_CONST);         /* AG_CONST * cos(0) */
        Y = 0;                       /* AG_CONST * sin(0) */

        TargetAngle = this.FIXED(Target);
        CurrAngle = 0;
        for (Step = 0; Step < 12; Step++) {
            var NewX;
            if (TargetAngle > CurrAngle) {
                NewX = X - (Y >> Step);
                Y = (X >> Step) + Y;
                X = NewX;
                CurrAngle += this.Angles[Step];
            } else {
                NewX = X + (Y >> Step);
                Y = -(X >> Step) + Y;
                X = NewX;
                CurrAngle -= this.Angles[Step];
            }
        }

        return this.FLOAT(X) * this.FLOAT(Y);
    }

    ///// End CORDIC

    var total = 0;

    function cordic( runs : number) : number{
        var start = new Date();

        for ( var i = 0 ; i < runs ; i++ ) {
            this.total += this.cordicsincos(this.Target);
        }

        var end = new Date();

        return end.getTime() - start.getTime();
    }

    function constructor(){
        this.Angles = [
            this.FIXED(45.0), this.FIXED(26.565), this.FIXED(14.0362), this.FIXED(7.12502),
            this.FIXED(3.57633), this.FIXED(1.78991), this.FIXED(0.895174), this.FIXED(0.447614),
            this.FIXED(0.223811), this.FIXED(0.111906), this.FIXED(0.055953),
            this.FIXED(0.027977)
            ];
        this.cordic(25000);
    }

    static function main(args : string[]) : void {
        new _Main();
    }
}
