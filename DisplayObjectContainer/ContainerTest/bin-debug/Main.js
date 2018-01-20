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
        /***  First, initialize 1 egret birds ***/
        var egretBird = this.createBitmapByName("mypicker_png");
        egretBird.x = this.stage.stageWidth / 2 - egretBird.width / 2;
        egretBird.y = this.stage.stageHeight / 2 + 50;
        this.addChild(egretBird);
        egretBird.touchEnabled = false;
        /*** The buttons generate code ***/
        this.leftTF = new egret.TextField;
        this.leftTF.size = 28;
        this.leftTF.textAlign = egret.HorizontalAlign.CENTER;
        this.leftTF.textColor = 0xffffff;
        this.leftTF.background = true;
        this.leftTF.backgroundColor = 0xd71345;
        this.leftTF.text = "red container";
        this.leftTF.x = this.stage.stageWidth / 4 - this.leftTF.width / 2;
        this.leftTF.y = 150;
        this.leftTF.touchEnabled = true;
        this.addChild(this.leftTF);
        this.rightTF = new egret.TextField;
        this.rightTF.size = 28;
        this.rightTF.textAlign = egret.HorizontalAlign.CENTER;
        this.rightTF.textColor = 0xffffff;
        this.rightTF.background = true;
        this.rightTF.backgroundColor = 0x102b6a;
        this.rightTF.text = "blue container";
        this.rightTF.x = this.stage.stageWidth / 2 + this.stage.stageWidth / 4 - this.rightTF.width / 2;
        this.rightTF.y = 150;
        this.rightTF.touchEnabled = true;
        this.addChild(this.rightTF);
        /*** The following code implements two containers ***/
        var leftCon = new egret.DisplayObjectContainer();
        this.addChild(leftCon);
        var leftCage = new egret.Shape();
        leftCage.graphics.lineStyle(10, 0xd71345, 1, true);
        leftCage.graphics.lineTo(0, 0);
        leftCage.graphics.lineTo(250, 0);
        leftCage.graphics.lineTo(250, 250);
        leftCage.graphics.lineTo(0, 250);
        leftCage.graphics.lineTo(0, 0);
        leftCage.graphics.endFill();
        leftCon.addChild(leftCage);
        leftCon.x = this.stage.stageWidth / 4 - leftCon.width / 2;
        leftCon.y = 200;
        var rightCon = new egret.DisplayObjectContainer();
        this.addChild(rightCon);
        var rightCage = new egret.Shape();
        rightCage.graphics.lineStyle(10, 0x102b6a, 1, true);
        rightCage.graphics.lineTo(0, 0);
        rightCage.graphics.lineTo(250, 0);
        rightCage.graphics.lineTo(250, 250);
        rightCage.graphics.lineTo(0, 250);
        rightCage.graphics.lineTo(0, 0);
        rightCage.graphics.endFill();
        rightCon.addChild(rightCage);
        rightCon.x = this.stage.stageWidth / 2 + this.stage.stageWidth / 4 - rightCon.width / 2;
        rightCon.y = 200;
        /// prompt
        this._txInfo = new egret.TextField;
        this._txInfo.size = 28;
        this._txInfo.width = 550;
        this._txInfo.textAlign = egret.HorizontalAlign.CENTER;
        this._txInfo.textColor = 0x000000;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;
        this._txInfo.wordWrap = true;
        this._txInfo.text = "Click on buttons with different colors and put egret birds into different containers. When you drag the container, the birds will move along.";
        this._txInfo.x = this.stage.stageWidth / 2 - this._txInfo.width / 2;
        this._txInfo.y = 10;
        this.addChild(this._txInfo);
        // Left text를 누르면 display에 있는지 확인 후 지우고 Left Container에 생성시킴. 만약 Right text에 있다면 지우고 Left Contatiner로 생성함.
        this.leftTF.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (_this.getChildIndex(egretBird) != -1) {
                _this.removeChild(egretBird);
                leftCon.addChild(egretBird);
                egretBird.x = leftCage.width / 2 - egretBird.width / 2;
                egretBird.y = leftCage.height / 2 - egretBird.height / 2;
            }
            else if (rightCon.getChildIndex(egretBird) != -1) {
                rightCon.removeChild(egretBird);
                leftCon.addChild(egretBird);
                egretBird.x = leftCage.width / 2 - egretBird.width / 2;
                egretBird.y = leftCage.height / 2 - egretBird.height / 2;
            }
            leftCon.touchEnabled = true;
            rightCon.touchEnabled = false;
        }, this);
        // Right text를 누르면 display에 있는지 확인 후 지우고 Right Container에 생성시킴. 만약 Left text에 있다면 지우고 Right Contatiner로 생성함.
        this.rightTF.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (_this.getChildIndex(egretBird) != -1) {
                _this.removeChild(egretBird);
                rightCon.addChild(egretBird);
                egretBird.x = rightCage.width / 2 - egretBird.width / 2;
                egretBird.y = rightCage.height / 2 - egretBird.height / 2;
            }
            else if (leftCon.getChildIndex(egretBird) != -1) {
                leftCon.removeChild(egretBird);
                rightCon.addChild(egretBird);
                egretBird.x = rightCage.width / 2 - egretBird.width / 2;
                egretBird.y = rightCage.height / 2 - egretBird.height / 2;
            }
            leftCon.touchEnabled = false;
            rightCon.touchEnabled = true;
        }, this);
        var leftDrag = false;
        var rightDrag = false;
        // Left container에 egretBird가 있다면 container를 드래그로 움직일 수 있음
        leftCon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            leftDrag = true;
        }, this);
        leftCon.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            leftDrag = false;
        }, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, function (e) {
            if (leftDrag) {
                leftCon.x = e.stageX - leftCage.width / 2;
                leftCon.y = e.stageY - leftCage.height / 2;
            }
        }, this);
        // Right container에 egretBird가 있다면 container를 드래그로 움직일 수 있음
        rightCon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            rightDrag = true;
        }, this);
        rightCon.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            rightDrag = false;
        }, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, function (e) {
            if (rightDrag) {
                rightCon.x = e.stageX - rightCage.width / 2;
                rightCon.y = e.stageY - rightCage.height / 2;
            }
        }, this);
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