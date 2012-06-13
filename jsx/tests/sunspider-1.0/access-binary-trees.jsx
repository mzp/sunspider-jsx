/* The Great Computer Language Shootout
   http://shootout.alioth.debian.org/
   contributed by Isaac Gouy */

class TreeNode {
    var item  : number;
    var left  : MayBeUndefined.<TreeNode>;
    var right : MayBeUndefined.<TreeNode>;

    function constructor(left : MayBeUndefined.<TreeNode>,
                         right : MayBeUndefined.<TreeNode>,
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

class Main {
    static function bottomUpTree(item : number, depth : number) : TreeNode {
        if (depth>0){
            return new TreeNode(
                Main.bottomUpTree(2*item-1, depth-1)
                ,Main.bottomUpTree(2*item, depth-1)
                ,item
            );
        } else {
            return new TreeNode(null,null,item);
        }
    }

    static function main() : void {
        var ret : number;
        for ( var n = 4; n <= 7; n += 1 ) {
            var minDepth = 4;
            var maxDepth = Math.max(minDepth + 2, n);
            var stretchDepth = maxDepth + 1;
            var check = Main.bottomUpTree(0,stretchDepth).itemCheck();

            var longLivedTree = Main.bottomUpTree(0,maxDepth);
            for (var depth=minDepth; depth<=maxDepth; depth+=2) {
                var iterations = 1 << (maxDepth - depth + minDepth);

                check = 0;
                for (var i=1; i<=iterations; i++){
                    check += Main.bottomUpTree(i,depth).itemCheck();
                    check += Main.bottomUpTree(-i,depth).itemCheck();
                }
            }
            ret = longLivedTree.itemCheck();
        }
    }
}
/*
function TreeNode(left,right,item){
   this.left = left;
   this.right = right;
   this.item = item;
}

TreeNode.prototype.itemCheck = function(){
   if (this.left==null) return this.item;
   else return this.item + this.left.itemCheck() - this.right.itemCheck();
}



*/