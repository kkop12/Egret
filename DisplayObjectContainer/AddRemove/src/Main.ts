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
         /*** Shape and graphics are used to differentiate the 4 areas in code below  ***/
        var upLeft = new egret.Shape();
        upLeft.graphics.beginFill(0xf7acbc);
        upLeft.graphics.drawRect(0, 0, this.stage.stageWidth/2, this.stage.stageHeight/2);
        upLeft.graphics.endFill();
        upLeft.touchEnabled = true;
        upLeft.x = 0;
        upLeft.y = 0;
        this.addChild(upLeft);
        
        var upRight = new egret.Shape();
        upRight.graphics.beginFill(0xdeab8a);
        upRight.graphics.drawRect(0, 0, this.stage.stageWidth/2, this.stage.stageHeight/2);
        upRight.graphics.endFill();
        upRight.touchEnabled = true;
        upRight.x = this.stage.stageWidth/2;
        upRight.y = 0;       
        this.addChild(upRight);
        
        var downLeft = new egret.Shape();
        downLeft.graphics.beginFill(0xef5b9c);
        downLeft.graphics.drawRect(0, 0, this.stage.stageWidth/2, this.stage.stageHeight/2);
        downLeft.graphics.endFill();
        downLeft.touchEnabled = true;
        downLeft.x = 0;
        downLeft.y = this.stage.stageHeight/2;         
        this.addChild(downLeft);
        
        var downRight = new egret.Shape();
        downRight.graphics.beginFill(0xfedcbd);
        downRight.graphics.drawRect(0, 0, this.stage.stageWidth/2, this.stage.stageHeight/2);
        downRight.graphics.endFill();
        downRight.touchEnabled = true;
        downRight.x = this.stage.stageWidth/2;
        downRight.y = this.stage.stageHeight/2;   
        this.addChild(downRight);

        /*** First, initialize 4 egret birds ***/
        var upLeftBird = this.createBitmapByName("mypicker_png");
        upLeftBird.x = upLeft.x + upLeft.width/2 - upLeftBird.width/2;
        upLeftBird.y = upLeft.y + upLeft.height/2 - upLeftBird.height/2;
        
        var upRightBird = this.createBitmapByName("mypicker_png");
        upRightBird.x = upRight.x + upRight.width/2 - upRightBird.width/2;
        upRightBird.y = upRight.y + upRight.height/2 - upRightBird.height/2;
        
        var downLeftBird = this.createBitmapByName("mypicker_png");
        downLeftBird.x = downLeft.x + downLeft.width/2 - downLeftBird.width/2;
        downLeftBird.y = downLeft.y + downLeft.height/2 - downLeftBird.height/2;
        
        var downRightBird = this.createBitmapByName("mypicker_png");
        downRightBird.x = downRight.x + downRight.width/2 - downRightBird.width/2;
        downRightBird.y = downRight.y + downRight.height/2 - downRightBird.height/2;
        
        /*** The following code adds listening events to the 4 areas ***/
        upLeft.addEventListener( egret.TouchEvent.TOUCH_TAP, ()=>{
            /***  The key code section of this sample begins ***/
            if(this.contains(upLeftBird)){
                this.removeChild(upLeftBird);
            }else{
                this.addChild(upLeftBird);
            }
            /***  The key code section of this sample ends ***/
        }, this );      
        
        upRight.addEventListener( egret.TouchEvent.TOUCH_TAP, ()=>{
            /***  The key code section of this sample begins ***/
            if(this.contains(upRightBird)){
                this.removeChild(upRightBird);
            }else{
                this.addChild(upRightBird);
            }
            /***  The key code section of this sample ends ***/
        }, this );      
        
        downLeft.addEventListener( egret.TouchEvent.TOUCH_TAP, ()=>{
            /***  The key code section of this sample begins ***/
            if(this.contains(downLeftBird)){
                this.removeChild(downLeftBird);
            }else{
                this.addChild(downLeftBird);
            }
            /***  The key code section of this sample ends ***/
        }, this );      
        
        downRight.addEventListener( egret.TouchEvent.TOUCH_TAP, ()=>{
            /***  The key code section of this sample begins ***/
            if(this.contains(downRightBird)){
                this.removeChild(downRightBird);
            }else{
                this.addChild(downRightBird);
            }
            /***  The key code section of this sample ends ***/
        }, this );       

        /// prompt
        this._txInfo = new egret.TextField;
        this._txInfo.size = 28;
        this._txInfo.textAlign = egret.HorizontalAlign.CENTER;
        this._txInfo.textColor = 0x843900;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;
        this._txInfo.text = "Touch button with different color.";
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