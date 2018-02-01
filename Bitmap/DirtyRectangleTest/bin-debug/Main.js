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
        //var bmd:egret.BitmapData = evt.currentTarget.data;
        var _this = this;
        var bmd = RES.getRes("egret_01_small_png");
        /// Producing definite numbers of egrets-birds
        var wHalfBird = bmd.width / 2;
        var hHalfBird = bmd.height / 2;
        this._rectScope = new egret.Rectangle(wHalfBird * Main.SCALE_BASE, hHalfBird * Main.SCALE_BASE, this.stage.stageWidth - wHalfBird * Main.SCALE_BASE * 2, this.stage.stageHeight - hHalfBird * Main.SCALE_BASE * 2);
        this._vcBird = new Array();
        for (var i = 0; i < Main.NUM; ++i) {
            var bird = new egret.Bitmap(bmd);
            bird.anchorOffsetX = wHalfBird;
            bird.anchorOffsetY = hHalfBird;
            /// Random initial position
            bird.x = this._rectScope.x + this._rectScope.width * Math.random();
            bird.y = this._rectScope.y + this._rectScope.height * Math.random();
            //bird.x = 50 * i;
            //bird.y = 50 * i;
            bird.scaleX = bird.scaleY = Main.SCALE_BASE;
            this._vcBird.push(bird);
            this.addChild(bird);
        }
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
        this._txInfo.touchEnabled = true;
        //this._txInfo.background = true;
        //this._txInfo.backgroundColor = 0xffffff;
        this._txInfo.wordWrap = true;
        this._txInfo.text =
            "Touch to change moving birds and their movement pattern to observe changes of dirty rectangles corresponding to the birds’ movement";
        this._bgInfo = new egret.Shape;
        this.addChild(this._bgInfo);
        this._bgInfo.x = this._txInfo.x;
        this._bgInfo.y = this._txInfo.y;
        this._bgInfo.graphics.clear();
        this._bgInfo.graphics.beginFill(0xffffff, .5);
        this._bgInfo.graphics.drawRect(0, 0, this._txInfo.width, this._txInfo.height);
        this._bgInfo.graphics.endFill();
        this._bgInfo.cacheAsBitmap = true;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            _this.planRdmMotion();
        }, this);
        this.planRdmMotion();
        this._nScaleBase = 0;
        /// animation
        this.stage.addEventListener(egret.Event.ENTER_FRAME, function (evt) {
            /***  The key code section of this sample begins ***/
            switch (_this._iMotionMode) {
                case MotionMode.ROT:/// Rotate and scale
                    _this._vcBird[_this._vcMotion[0]].rotation += 3;
                    _this._vcBird[_this._vcMotion[1]].rotation -= 3;
                    _this._vcBird[_this._vcMotion[2]].rotation += 3;
                    var scale = Main.SCALE_BASE + Math.abs(Math.sin(_this._nScaleBase += 0.03)) * Main.SCALE_RANGE;
                    //console.log( "scale at:", Math.abs( Math.sin( this._nScaleBase ) ) );
                    _this._vcBird[_this._vcMotion[0]].scaleX = _this._vcBird[_this._vcMotion[0]].scaleY = scale;
                    _this._vcBird[_this._vcMotion[1]].scaleX = _this._vcBird[_this._vcMotion[1]].scaleY = scale;
                    _this._vcBird[_this._vcMotion[2]].scaleX = _this._vcBird[_this._vcMotion[2]].scaleY = scale;
                    break;
                case MotionMode.MOV:
                    var xTo;
                    if ((xTo = _this._vcBird[_this._vcMotion[0]].x - 3) < _this._rectScope.left)
                        xTo = _this._rectScope.right;
                    _this._vcBird[_this._vcMotion[0]].x = xTo;
                    if ((xTo = _this._vcBird[_this._vcMotion[1]].x + 3) > _this._rectScope.right)
                        xTo = _this._rectScope.left;
                    _this._vcBird[_this._vcMotion[1]].x = xTo;
                    if ((xTo = _this._vcBird[_this._vcMotion[2]].x - 3) < _this._rectScope.left)
                        xTo = _this._rectScope.right;
                    _this._vcBird[_this._vcMotion[2]].x = xTo;
                    break;
            }
            /***  The key code section of this sample ends ***/
        }, this);
    };
    /// 동작 내용을 무작위로 설정합니다.
    Main.prototype.planRdmMotion = function () {
        /// 무작위 운동 모드
        this._iMotionMode = Math.random() > .5 ? 0 : 1;
        /// 비율 복원
        if (this._vcMotion && this._vcMotion.length == 3) {
            this._vcBird[this._vcMotion[0]].scaleX = this._vcBird[this._vcMotion[0]].scaleY = Main.SCALE_BASE;
            this._vcBird[this._vcMotion[1]].scaleX = this._vcBird[this._vcMotion[1]].scaleY = Main.SCALE_BASE;
            this._vcBird[this._vcMotion[2]].scaleX = this._vcBird[this._vcMotion[2]].scaleY = Main.SCALE_BASE;
        }
        this.setChildIndex(this._txInfo, this.numChildren - 1); /// 프롬프트 텍스트 및 배경 깊이 재설정
        this.setChildIndex(this._bgInfo, this.numChildren - 2);
        /// 임의로 3마리의 egrets를 가져와서 가장 높은 깊이를 확보
        this._vcMotion = new Array();
        this._vcMotion.push(Math.floor(Main.NUM * Math.random()));
        this._vcMotion.push(Math.floor(Main.NUM * Math.random()));
        this._vcMotion.push(Math.floor(Main.NUM * Math.random()));
        this.setChildIndex(this._vcBird[this._vcMotion[0]], this.numChildren - 3);
        this.setChildIndex(this._vcBird[this._vcMotion[1]], this.numChildren - 4);
        this.setChildIndex(this._vcBird[this._vcMotion[2]], this.numChildren - 5);
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
    Main.NUM = 10;
    Main.SCALE_BASE = .5;
    Main.SCALE_RANGE = .5;
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
var MotionMode = (function () {
    function MotionMode() {
    }
    MotionMode.ROT = 0;
    MotionMode.MOV = 1;
    return MotionMode;
}());
__reflect(MotionMode.prototype, "MotionMode");
//# sourceMappingURL=Main.js.map