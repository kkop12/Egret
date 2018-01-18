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
    private leftTF:egret.TextField;
    private rightTF:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        
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
        this.leftTF.x = this.stage.stageWidth/4 - this.leftTF.width/2;
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
        this.rightTF.x = this.stage.stageWidth/2 + this.stage.stageWidth/4 - this.rightTF.width/2;
        this.rightTF.y = 150;
        this.rightTF.touchEnabled = true;
        this.addChild(this.rightTF);

        /*** The following code implements two containers ***/
        var leftCon = new egret.DisplayObjectContainer();
        this.addChild(leftCon);

        var leftCage = new egret.Shape();
        leftCage.graphics.lineStyle(10, 0xd71345, 1, true)
        leftCage.graphics.lineTo(0,0);
        leftCage.graphics.lineTo(250,0);
        leftCage.graphics.lineTo(250,250);
        leftCage.graphics.lineTo(0,250);
        leftCage.graphics.lineTo(0,0);
        leftCage.graphics.endFill();
        leftCon.addChild(leftCage);

        leftCon.x = this.stage.stageWidth / 4 - leftCon.width / 2;
        leftCon.y = 200;
        

        var rightCon = new egret.DisplayObjectContainer();
        this.addChild(rightCon);

        var rightCage = new egret.Shape();
        rightCage.graphics.lineStyle(10, 0x102b6a, 1, true)
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
        this._txInfo.x = this.stage.stageWidth/2 - this._txInfo.width/2;
        this._txInfo.y = 10;
        this.addChild( this._txInfo );

        /*** The following code adds listening events to 2 buttons ***/
        this.leftTF.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            /***  The key code section of this sample begins ***/
            if (this.getChildIndex(egretBird) != -1) {
                this.removeChild(egretBird);
                leftCon.addChild(egretBird);
                egretBird.x = leftCage.width/2 - egretBird.width/2;
                egretBird.y = leftCage.height / 2 - egretBird.height / 2;
            } else if (rightCon.getChildIndex(egretBird) != -1) {
                rightCon.removeChild(egretBird);
                leftCon.addChild(egretBird);
                egretBird.x = leftCage.width / 2 - egretBird.width / 2;
                egretBird.y = leftCage.height / 2 - egretBird.height / 2;
            } 
            leftCon.touchEnabled = true;
            rightCon.touchEnabled = false;
            /*** The key code section of this sample ends ***/
        }, this);

        this.rightTF.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            /***  The key code section of this sample begins ***/
            if (this.getChildIndex(egretBird) != -1) {
                this.removeChild(egretBird);
                rightCon.addChild(egretBird);
                egretBird.x = rightCage.width / 2 - egretBird.width / 2;
                egretBird.y = rightCage.height / 2 - egretBird.height / 2;
            } else if (leftCon.getChildIndex(egretBird) != -1) {
                leftCon.removeChild(egretBird);
                rightCon.addChild(egretBird);
                egretBird.x = rightCage.width / 2 - egretBird.width / 2;
                egretBird.y = rightCage.height / 2 - egretBird.height / 2;
            }
            leftCon.touchEnabled = false;
            rightCon.touchEnabled = true;
            /*** The key code section of this sample ends ***/
        }, this); 

        /*** Add dragging code to the two containers. ***/
        var leftDrag: boolean = false;
        var rightDrag: boolean = false;
        leftCon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => {
            leftDrag = true;
        }, this); 
        leftCon.addEventListener(egret.TouchEvent.TOUCH_END, () => {
            leftDrag = false;
        }, this); 
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, (e) => {
            if(leftDrag){
                leftCon.x = e.stageX - leftCage.width/2;
                leftCon.y = e.stageY - leftCage.height/2;
            }
        }, this); 

        rightCon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => {
            rightDrag = true;
        }, this); 
        rightCon.addEventListener(egret.TouchEvent.TOUCH_END, () => {
            rightDrag = false;
        }, this); 
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, (e) => {
            if(rightDrag){
                rightCon.x = e.stageX - rightCage.width/2;
                rightCon.y = e.stageY - rightCage.height/2;
            }
        }, this); 
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