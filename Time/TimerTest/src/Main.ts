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
    private pointer = new egret.Shape();

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        
        var circle = new egret.Shape();
        circle.graphics.lineStyle(5, 0x000000, 1, true)
        circle.graphics.drawCircle(0,0,170);
        circle.graphics.endFill();
        circle.x = this.stage.stageWidth / 2;
        circle.y = this.stage.stageHeight / 2;
        this.addChild(circle);
        
        this.pointer = new egret.Shape();
        this.pointer.graphics.beginFill(0x000000);
        this.pointer.graphics.drawRect(0, 0, 160, 5);
        this.pointer.graphics.endFill();
        this.pointer.anchorOffsetY = this.pointer.height / 2;
        this.pointer.x = this.stage.stageWidth / 2 ;
        this.pointer.y = this.stage.stageHeight / 2;
        this.addChild(this.pointer);
        
        this._txInfo = new egret.TextField;
        this._txInfo.size = 24;
        this._txInfo.textColor = 0x000000;
        this._txInfo.lineSpacing = 10;
        this._txInfo.multiline = true;
        this._txInfo.text = "Timer example \nclick stage to start or pause the timer\n";
        this._txInfo.x = 30;
        this._txInfo.y = 30;
        this.addChild(this._txInfo);

        var self = this;

        // 1000ms에 반복하는 timer
        this.timer = new egret.Timer(1000, 0);

        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        
        this.timer.start();
        
        // timer 상황에 따라 터치하면 On/Off 함
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if(this.timer.running){
                this._txInfo.text += "Timer off！\n";
                this.timer.stop();
            }else{
                this._txInfo.text += "Timer on！\n";                
                this.timer.start();
            }
        }, this);         
    }

    private timerFunc(event: egret.Event) {
        this.pointer.rotation += 6;
        if(this.pointer.rotation > 360){
            this.pointer.rotation -= 360;
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