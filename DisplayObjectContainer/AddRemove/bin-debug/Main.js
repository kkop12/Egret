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
        /*** Shape and graphics are used to differentiate the 4 areas in code below  ***/
        var upLeft = new egret.Shape();
        upLeft.graphics.beginFill(0xf7acbc);
        upLeft.graphics.drawRect(0, 0, this.stage.stageWidth / 2, this.stage.stageHeight / 2);
        upLeft.graphics.endFill();
        upLeft.touchEnabled = true;
        upLeft.x = 0;
        upLeft.y = 0;
        this.addChild(upLeft);
        var upRight = new egret.Shape();
        upRight.graphics.beginFill(0xdeab8a);
        upRight.graphics.drawRect(0, 0, this.stage.stageWidth / 2, this.stage.stageHeight / 2);
        upRight.graphics.endFill();
        upRight.touchEnabled = true;
        upRight.x = this.stage.stageWidth / 2;
        upRight.y = 0;
        this.addChild(upRight);
        var downLeft = new egret.Shape();
        downLeft.graphics.beginFill(0xef5b9c);
        downLeft.graphics.drawRect(0, 0, this.stage.stageWidth / 2, this.stage.stageHeight / 2);
        downLeft.graphics.endFill();
        downLeft.touchEnabled = true;
        downLeft.x = 0;
        downLeft.y = this.stage.stageHeight / 2;
        this.addChild(downLeft);
        var downRight = new egret.Shape();
        downRight.graphics.beginFill(0xfedcbd);
        downRight.graphics.drawRect(0, 0, this.stage.stageWidth / 2, this.stage.stageHeight / 2);
        downRight.graphics.endFill();
        downRight.touchEnabled = true;
        downRight.x = this.stage.stageWidth / 2;
        downRight.y = this.stage.stageHeight / 2;
        this.addChild(downRight);
        /*** First, initialize 4 egret birds ***/
        var upLeftBird = this.createBitmapByName("mypicker_png");
        upLeftBird.x = upLeft.x + upLeft.width / 2 - upLeftBird.width / 2;
        upLeftBird.y = upLeft.y + upLeft.height / 2 - upLeftBird.height / 2;
        var upRightBird = this.createBitmapByName("mypicker_png");
        upRightBird.x = upRight.x + upRight.width / 2 - upRightBird.width / 2;
        upRightBird.y = upRight.y + upRight.height / 2 - upRightBird.height / 2;
        var downLeftBird = this.createBitmapByName("mypicker_png");
        downLeftBird.x = downLeft.x + downLeft.width / 2 - downLeftBird.width / 2;
        downLeftBird.y = downLeft.y + downLeft.height / 2 - downLeftBird.height / 2;
        var downRightBird = this.createBitmapByName("mypicker_png");
        downRightBird.x = downRight.x + downRight.width / 2 - downRightBird.width / 2;
        downRightBird.y = downRight.y + downRight.height / 2 - downRightBird.height / 2;
        // 4방향에 관한 Shape지역에 관해 터치 이벤트를 확인하고, 각 방향지역에 Bird 이미지가 있는지 없는지 확인 후 생성 및 삭제함
        upLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (_this.contains(upLeftBird)) {
                _this.removeChild(upLeftBird);
            }
            else {
                _this.addChild(upLeftBird);
            }
        }, this);
        upRight.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (_this.contains(upRightBird)) {
                _this.removeChild(upRightBird);
            }
            else {
                _this.addChild(upRightBird);
            }
        }, this);
        downLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (_this.contains(downLeftBird)) {
                _this.removeChild(downLeftBird);
            }
            else {
                _this.addChild(downLeftBird);
            }
        }, this);
        downRight.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (_this.contains(downRightBird)) {
                _this.removeChild(downRightBird);
            }
            else {
                _this.addChild(downRightBird);
            }
        }, this);
        /// prompt
        this._txInfo = new egret.TextField;
        this._txInfo.size = 28;
        this._txInfo.textAlign = egret.HorizontalAlign.CENTER;
        this._txInfo.textColor = 0x843900;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;
        this._txInfo.text = "Touch button with different color.";
        this._txInfo.x = this.stage.stageWidth / 2 - this._txInfo.width / 2;
        this._txInfo.y = 10;
        this.addChild(this._txInfo);
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
//# sourceMappingURL=Main.js.map