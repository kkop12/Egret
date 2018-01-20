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
        var sky = new egret.Shape();
        sky.graphics.beginFill(0xffffff);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.graphics.drawRect(0, 0, stageW, stageH);
        sky.graphics.endFill();
        this.addChild(sky);
        this._bird = this.createBitmapByName("mypicker_png");
        this.addChild(this._bird);
        this._bird.anchorOffsetX = this._bird.width / 2;
        this._bird.anchorOffsetY = this._bird.height / 2;
        this._bird.x = this.stage.stageWidth * 0.5;
        this._bird.y = this.stage.stageHeight * 0.618;
        ///  Small dots are used to prompt user of the position to  press
        this._dot = new egret.Shape;
        this._dot.graphics.beginFill(0x00ff00);
        this._dot.graphics.drawCircle(0, 0, 5);
        this._dot.graphics.endFill();
        /// prompt
        this._txInfo = new egret.TextField;
        this.addChild(this._txInfo);
        this._txInfo.size = 28;
        this._txInfo.x = 50;
        this._txInfo.y = 50;
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
        this._txInfo.textColor = 0x000000;
        this._txInfo.type = egret.TextFieldType.DYNAMIC;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;
        this._txInfo.touchEnabled = true;
        this._txInfo.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            evt.stopImmediatePropagation();
            _this._bShapeTest = !_this._bShapeTest;
            _this.updateInfo(TouchCollideStatus.NO_TOUCHED);
        }, this);
        this.launchCollisionTest();
    };
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    Main.prototype.startAnimation = function (result) {
    };
    Main.prototype.launchCollisionTest = function () {
        this._iTouchCollideStatus = TouchCollideStatus.NO_TOUCHED;
        this._bShapeTest = false;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
        this.updateInfo(TouchCollideStatus.NO_TOUCHED);
    };
    // 터치한 좌표에 _dot Shape를 옮겨주고, _bird 객체에 닿았는지 확인 및 글귀 바뀜
    Main.prototype.checkCollision = function (stageX, stageY) {
        /***  The key code section of this sample begins ***/
        var bResult = this._bird.hitTestPoint(stageX, stageY, this._bShapeTest);
        /***  The key code section of this sample ends ***/
        ///  Small dots are used to synchronize figure positions
        this._dot.x = stageX;
        this._dot.y = stageY;
        /// Text message update
        this.updateInfo(bResult ? TouchCollideStatus.COLLIDED : TouchCollideStatus.TOUCHED_NO_COLLIDED);
    };
    Main.prototype.touchHandler = function (evt) {
        switch (evt.type) {
            case egret.TouchEvent.TOUCH_MOVE:
                this.checkCollision(evt.stageX, evt.stageY);
                break;
            case egret.TouchEvent.TOUCH_BEGIN:
                // 화면 터치 시작시 _dot Shape를 stage에 추가 및 충돌 확인할 좌표를 전해줌
                if (!this._txInfo.hitTestPoint(evt.stageX, evt.stageY)) {
                    this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
                    this.stage.once(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
                    this.addChild(this._dot);
                    this.checkCollision(evt.stageX, evt.stageY);
                }
                break;
            case egret.TouchEvent.TOUCH_END:
                this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
                this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
                if (this._dot.parent) {
                    this._dot.parent.removeChild(this._dot);
                }
                this.updateInfo(TouchCollideStatus.NO_TOUCHED);
                break;
        }
    };
    Main.prototype.updateInfo = function (iStatus) {
        this._txInfo.text =
            "Switch collision detection result：\n" + (["Put your finger！", "Wanna touch me？", "Don't touch me！"][iStatus])
                + "\n\ncollision detection modes：\n" + (this._bShapeTest ? "non-transparent pixel region" : "rectangular surrounding box ")
                + "\n（touch text area）";
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
var TouchCollideStatus = (function () {
    function TouchCollideStatus() {
    }
    TouchCollideStatus.NO_TOUCHED = 0;
    TouchCollideStatus.TOUCHED_NO_COLLIDED = 1;
    TouchCollideStatus.COLLIDED = 2;
    return TouchCollideStatus;
}());
__reflect(TouchCollideStatus.prototype, "TouchCollideStatus");
//# sourceMappingURL=Main.js.map