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

    private _txInfo: egret.TextField;
    private timer: egret.Timer
    private timer2: egret.Timer

    private bird:egret.Bitmap;
    private isUpdate:boolean;
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {       
        
        // Set frame rate
        this.stage.frameRate = 5;

        this.bird = this.createBitmapByName("mypicker_png");
        this.bird.anchorOffsetX = this.bird.width/2;
        this.bird.anchorOffsetY = this.bird.height/2;
        this.bird.x = this.stage.stageWidth/2;
        this.bird.y = this.stage.stageHeight/2;
        this.addChild(this.bird);
        
        /// prompt
        this._txInfo = new egret.TextField;
        this._txInfo.size = 24;
        this._txInfo.textColor = 0x000000;
        this._txInfo.lineSpacing = 10;
        this._txInfo.multiline = true;
        this._txInfo.text = "Set frame rate to 5\nForce Update is default to off \n click stage to switch Force Update to on or off";
        this._txInfo.x = 30;
        this._txInfo.y = 150;
        this.addChild(this._txInfo);

        this.timer = new egret.Timer(50, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this.timer.start();
        
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, (e) => {
            this.isUpdate = !this.isUpdate;
        }, this); 
    }

    // updateAfterEvent가 아직 잘 이해가 안됌
    // updateAfterEvent가 되기전에는 Timer가 50ms마다 반복이 되지만, 실행되면 timerFunc안을 계속 도는 느낌임.    
    private timerFunc(event: egret.TimerEvent) {
        this.bird.rotation += 10;
        if(this.isUpdate){            
            event.updateAfterEvent();            
        }
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