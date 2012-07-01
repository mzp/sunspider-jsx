/* The Great Computer Language Shootout
   http://shootout.alioth.debian.org/
   contributed by Isaac Gouy */

class TreeNode {
    var item  : number;
    var left  : Nullable.<TreeNode>;
    var right : Nullable.<TreeNode>;

    function constructor(left : Nullable.<TreeNode>,
                         right : Nullable.<TreeNode>,
                         item  : number) {
        this.left  = left;
        this.right = right;
        this.item  = item;
    }

    function itemCheck() : number {
        if (this.left==null) return this.item;
        else return this.item + this.left.itemCheck() - this.right.itemCheck();
    }
}

class _Main {
    static function bottomUpTree(item : number, depth : number) : TreeNode {
        if (depth>0){
            return new TreeNode(
                _Main.bottomUpTree(2*item-1, depth-1)
                ,_Main.bottomUpTree(2*item, depth-1)
                ,item
            );
        } else {
            return new TreeNode(null,null,item);
        }
    }

    static function main(args : string[]) : void {
        var ret : number;
        for ( var n = 4; n <= 7; n += 1 ) {
            var minDepth = 4;
            var maxDepth = Math.max(minDepth + 2, n);
            var stretchDepth = maxDepth + 1;
            var check = _Main.bottomUpTree(0,stretchDepth).itemCheck();

            var longLivedTree = _Main.bottomUpTree(0,maxDepth);
            for (var depth=minDepth; depth<=maxDepth; depth+=2) {
                var iterations = 1 << (maxDepth - depth + minDepth);

                check = 0;
                for (var i=1; i<=iterations; i++){
                    check += _Main.bottomUpTree(i,depth).itemCheck();
                    check += _Main.bottomUpTree(-i,depth).itemCheck();
                }
            }
            ret = longLivedTree.itemCheck();
        }
    }
}
