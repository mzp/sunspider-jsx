/*
 * Copyright (C) 2007 Apple Inc.  All rights reserved.
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
 * THIS SOFTWARE IS PROVIDED BY APPLE COMPUTER, INC. ``AS IS'' AND ANY
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

class Main {
    static const loops = 15;
    static const nx = 120;
    static const nz = 120;

    static function morph(a : number[], f : number) : void {
        var PI2nx = Math.PI * 8/Main.nx;
        var sin = Math.sin;
        var f30 = -(50 * sin(f*Math.PI*2));

        for (var i = 0; i < Main.nz; ++i) {
            for (var j = 0; j < Main.nx; ++j) {
                a[3*(i*Main.nx+j)+1]    = sin((j-1) * PI2nx ) * -f30;
            }
        }
    }

    static function main() : void {
        var a = [] : number[];
        for (var i=0; i < Main.nx*Main.nz*3; ++i) {
            a[i] = 0;
        }

        for (var i = 0; i < Main.loops; ++i) {
            Main.morph(a, i/Main.loops);
        }

        var testOutput = 0;
        for (var i = 0; i < Main.nx; i++) {
            testOutput += a[3*(i*Main.nx+i)+1];
            log testOutput;
        }
        a = null;
    }
}
class _Main {
    static function main(args : string[]) : void {
        Main.main();
    }
}
