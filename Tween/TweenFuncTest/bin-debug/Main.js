//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
            context.onUpdate = function () {
            };
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, userInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        this.createGameScene();
                        return [4 /*yield*/, RES.getResAsync("description_json")];
                    case 2:
                        result = _a.sent();
                        this.startAnimation(result);
                        return [4 /*yield*/, platform.login()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, platform.getUserInfo()];
                    case 4:
                        userInfo = _a.sent();
                        console.log(userInfo);
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 2:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        var _this = this;
        this._bird = this.createBitmapByName("mypicker_png");
        this._vcLocation = [
            //new egret.Point( bmd.width/2, 160 + bmd.height/2 )
            //,new egret.Point( this.stage.stageWidth - bmd.width/2, this.stage.stageHeight - bmd.height/2 )
            new egret.Point(this._bird.width / 2, this.stage.stageHeight - this._bird.height / 2),
            new egret.Point(this.stage.stageWidth - this._bird.width / 2, 160 + this._bird.height / 2)
        ];
        this._bird.anchorOffsetX = this._bird.width / 2;
        this._bird.anchorOffsetY = this._bird.height / 2;
        this.addChild(this._bird);
        /// prompt
        this._txInfo = new egret.TextField;
        this.addChild(this._txInfo);
        this._txInfo.size = 28;
        this._txInfo.x = 50;
        this._txInfo.y = 50;
        this._txInfo.width = this.stage.stageWidth - 100;
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
        this._txInfo.textColor = 0x000000;
        this._txInfo.type = egret.TextFieldType.DYNAMIC;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;
        this._txInfo.wordWrap = true;
        this._idxEase = -1;
        /// Touch the stage to trigger a tween
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.launchTween();
        }, this);
        /// Definition of Tween ease Array
        this._vcEaseFunc = [];
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.sineIn", egret.Ease.sineIn));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.sineOut", egret.Ease.sineOut));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.sineInOut", egret.Ease.sineInOut));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.backIn", egret.Ease.backIn));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.backOut", egret.Ease.backOut));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.backInOut", egret.Ease.backInOut));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.circIn", egret.Ease.circIn));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.circOut", egret.Ease.circOut));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.circInOut", egret.Ease.circInOut));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.bounceIn", egret.Ease.bounceIn));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.bounceOut", egret.Ease.bounceOut));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.bounceInOut", egret.Ease.bounceInOut));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.elasticIn", egret.Ease.elasticIn));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.elasticOut", egret.Ease.elasticOut));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.elasticInOut", egret.Ease.elasticInOut));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.quadIn", egret.Ease.quadIn));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.quadOut", egret.Ease.quadOut));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.quadInOut", egret.Ease.quadInOut));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.cubicIn", egret.Ease.cubicIn));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.cubicOut", egret.Ease.cubicOut));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.cubicInOut", egret.Ease.cubicInOut));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.quartIn", egret.Ease.quartIn));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.quartOut", egret.Ease.quartOut));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.quartInOut", egret.Ease.quartInOut));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.quintIn", egret.Ease.quintIn));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.quintOut", egret.Ease.quintOut));
        this._vcEaseFunc.push(new EaseFunc("egret.Ease.quintInOut", egret.Ease.quintInOut));
        this._idxCurrLocation = -1;
        this.updateRdmLocation(true);
        this.updatePrompt();
    };
    Main.prototype.updatePrompt = function (sAppend) {
        if (sAppend === void 0) { sAppend = ""; }
        this._txInfo.text =
            "Touch screen to start tween process of a random location. Every tween uses different interpolation equation" +
                "\n current interpolation：" + sAppend;
    };
    // 중복 회피
    Main.prototype.updateRdmLocation = function (bApply) {
        if (bApply === void 0) { bApply = false; }
        var vcIdxLocation = [0, 1];
        if (this._idxCurrLocation != -1) {
            vcIdxLocation.splice(this._idxCurrLocation, 1);
        }
        var loc = this._vcLocation[this._idxCurrLocation = vcIdxLocation[Math.floor(Math.random() * vcIdxLocation.length)]];
        if (bApply) {
            this._bird.x = loc.x;
            this._bird.y = loc.y;
        }
        return loc;
    };
    Main.prototype.launchTween = function () {
        var loc = this.updateRdmLocation();
        // 나머지 값으로 배열 순서대로 값이 나오게 함
        var params = this._vcEaseFunc[++this._idxEase % this._vcEaseFunc.length];
        egret.Tween.get(this._bird)
            .to({ x: loc.x, y: loc.y }, 600, params.func);
        this.updatePrompt(params.name);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    Main.prototype.startAnimation = function (result) {
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
var EaseFunc = (function () {
    function EaseFunc(name, func) {
        this.name = name;
        this.func = func;
    }
    return EaseFunc;
}());
__reflect(EaseFunc.prototype, "EaseFunc");
//# sourceMappingURL=Main.js.map