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

    private textInput: egret.TextField;
    private textTips: egret.TextField;
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        /***First, Initialize 1 egret***/
        var egretBird = this.createBitmapByName("mypicker_png");
        egretBird.anchorOffsetX = egretBird.width/2;
        egretBird.anchorOffsetY = egretBird.height/2;
        egretBird.x = this.stage.stageWidth/2;
        egretBird.y = this.stage.stageHeight/2 + 50;
        this.addChild(egretBird);
        egretBird.touchEnabled = false;

        // Enter frame rate
        this.textInput = new egret.TextField;
        this.textInput.size = 40;
        this.textInput.type = "input";
        this.textInput.width = 300;
        this.textInput.height = 60;
        this.textInput.border = true;
        this.textInput.borderColor = 0x000000;
        this.textInput.textAlign = egret.HorizontalAlign.CENTER;
        this.textInput.textColor = 0x77787b;
        this.textInput.text = "Enter frame rate";
        this.textInput.x = this.stage.stageWidth / 2 - this.textInput.width / 2;
        this.textInput.y = 200;
        this.textInput.touchEnabled = true;
        this.addChild(this.textInput);

        // prompt
        this.textTips = new egret.TextField;
        this.textTips.size = 24;
        this.textTips.textAlign = egret.HorizontalAlign.CENTER;
        this.textTips.textColor = 0x843900;
        this.textTips.text = "Click stage to set projects’ framerate";
        this.textTips.x = this.stage.stageWidth / 2 - this.textTips.width / 2;
        this.textTips.y = this.stage.stageHeight - 100;
        this.addChild(this.textTips);

        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {            
            this.stage.frameRate = Number(this.textInput.text);            
        }, this); 

        // 중앙 위쪽 TextField를 터치 후 숫자를 입력하면 프레임값이 바뀜 
        this.textInput.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.textInput.text = "";
            this.textInput.textColor = 0x000000;
        }, this); 
       
        this.addEventListener( egret.Event.ENTER_FRAME, ( evt:egret.Event )=>{
            egretBird.rotation += 3;
        }, this ); 
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