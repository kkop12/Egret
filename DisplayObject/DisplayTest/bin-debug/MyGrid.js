var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var MyGrid = (function (_super) {
    __extends(MyGrid, _super);
    function MyGrid() {
        var _this = _super.call(this) || this;
        _this.drawGrid();
        return _this;
    }
    MyGrid.prototype.drawGrid = function () {
        var greenCode = 0x1DDB16;
        var blueCode = 0x00D8FF;
        var index = 0;
        for (var row = 0; row < 5; row++) {
            for (var col = 0; col < 5; col++) {
                if (index == 0) {
                    this.graphics.beginFill(greenCode);
                    index++;
                }
                else {
                    this.graphics.beginFill(blueCode);
                    index = 0;
                }
                this.graphics.drawRect(50 * row, 50 * col, 50, 50);
                this.graphics.endFill();
            }
        }
    };
    return MyGrid;
}(egret.Sprite));
__reflect(MyGrid.prototype, "MyGrid");
//# sourceMappingURL=MyGrid.js.map