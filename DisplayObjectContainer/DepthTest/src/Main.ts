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

class Main extends egret.DisplayObjectContainer {



    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })



    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private textfield: egret.TextField;
    private _txInfo:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {

        /***  First, initialize 4 egret birds ***/
        var upBird = this.createBitmapByName("mypicker_png");
        upBird.x = this.stage.stageWidth / 2 - upBird.width / 2;
        upBird.y = this.stage.stageHeight/2 - upBird.height/2;
        upBird.touchEnabled = true;
        upBird.pixelHitTest = true;
        this.addChild(upBird);
        
        var leftBird = this.createBitmapByName("mypicker_png");
        leftBird.x = 50;
        leftBird.y = this.stage.stageHeight / 2 - leftBird.height / 2;
        leftBird.touchEnabled = true;
        leftBird.pixelHitTest = true;
        this.addChild(leftBird);
        
        var rightBird = this.createBitmapByName("mypicker_png");
        rightBird.x = this.stage.stageWidth - rightBird.width - 50;
        rightBird.y = this.stage.stageHeight / 2 - rightBird.height / 2;
        rightBird.touchEnabled = true;
        rightBird.pixelHitTest = true;
        this.addChild(rightBird);
        /***  The following code adds listening events to 3 button3 ***/
        upBird.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            /***  The key code section of this sample begins ***/
            this.setChildIndex(upBird, this.numChildren - 1);
            /***  The key code section of this sample ends ***/
        }, this );      
        
        leftBird.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            /***  The key code section of this sample begins ***/
            this.setChildIndex(leftBird, this.numChildren - 1);
            /***  The key code section of this sample ends ***/
        }, this );      
        
        rightBird.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            /***  The key code section of this sample begins ***/
            this.setChildIndex(rightBird, this.numChildren - 1);
            /***  The key code section of this sample ends ***/
        }, this); 

        /// prompt
        this._txInfo = new egret.TextField;
        this._txInfo.size = 28;
        this._txInfo.textAlign = egret.HorizontalAlign.CENTER;
        this._txInfo.textColor = 0x843900;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;
        this._txInfo.width = 400;
        this._txInfo.text = "Click different egret birds to promote the object to the top layer";
        this._txInfo.x = this.stage.stageWidth/2 - this._txInfo.width/2;
        this._txInfo.y = 10;
        this.addChild( this._txInfo );
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: string[]) {
        
    }
}