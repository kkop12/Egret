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
    private _bird:egret.Bitmap;

    private touchPoints:Object = {names:[]};
    private distance:number = 0;
    private defAngle:number = 0;
    private touchCon:number = 0;
    private _currentBirdRotation:number = 0;

    private _txInfo:egret.TextField;
    private _bgInfo:egret.Shape;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this._bird = this.createBitmapByName("mypicker_png");
        this._bird.anchorOffsetX = this._bird.width/2;
        this._bird.anchorOffsetY = this._bird.height/2;
        this._bird.x = this.stage.stageWidth/2;
        this._bird.y = this.stage.stageHeight/2;
        this.addChild( this._bird );

        this.drawText();

        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
    }

    private mouseDown(evt:egret.TouchEvent)
    {
        egret.log("touch begin:"+evt.touchPointID);
        if(this.touchPoints[evt.touchPointID]==null)
        {
            this.touchPoints[evt.touchPointID] = new egret.Point(evt.stageX,evt.stageY);
            this.touchPoints["names"].push(evt.touchPointID);
        }
        this.touchCon++;

        if(this.touchCon==2)
        {
            this.distance = this.getTouchDistance();
            egret.log("distance:"+this.distance);

            this.defAngle = this.getTouchAngle();
            egret.log("touch angle:"+this.defAngle);
            egret.log("bird angle:"+this._bird.rotation);
        }

    }

    // 멀티 터치한 두 좌표가 멀어질수록 _bird가 시계방향으로 돌고 크기가 커짐
    private mouseMove(evt:egret.TouchEvent)
    {
        //egret.log("touch move:"+evt.touchPointID);

        this.touchPoints[evt.touchPointID].x = evt.stageX;
        this.touchPoints[evt.touchPointID].y = evt.stageY;
        if(this.touchCon==2)
        {
            var newdistance = this.getTouchDistance();
            this._bird.scaleX = newdistance/this.distance;
            this._bird.scaleY = this._bird.scaleX;

            var newangle = this.getTouchAngle();
            this._bird.rotation = this._currentBirdRotation + newangle - this.defAngle;
        }
    }

    // 회전값은 그대로, 크기는 복원
    private mouseUp(evt:egret.TouchEvent)
    {
        egret.log("touch end:"+evt.touchPointID);
        delete  this.touchPoints[evt.touchPointID];
        this.touchCon--;
        //
        this._bird.width *= this._bird.scaleX;
        this._bird.height *= this._bird.scaleY;
        this._bird.scaleX = 1;
        this._bird.scaleY = 1;
        this._bird.anchorOffsetX = this._bird.width/2;
        this._bird.anchorOffsetY = this._bird.height/2;
        this._currentBirdRotation = this._bird.rotation;

        egret.log("bird size [wdith:"+this._bird.width.toFixed(1) +", height:"+this._bird.height.toFixed(1)+"]");
        egret.log("bird angle:"+this._bird.rotation);
    }

    // 멀티 터치 두 좌표의 차이 값을 리턴
    private getTouchDistance()
    {
        var _distance:number = 0;
        var names = this.touchPoints["names"];
        _distance = egret.Point.distance( this.touchPoints[names[names.length-1]],
            this.touchPoints[names[names.length-2]]);
        return _distance;
    }
    
    private c:number = 0.017453292; //2PI/360
    private getTouchAngle()
    {
        var ang:number = 0;
        var names = this.touchPoints["names"];
        var p1:egret.Point = this.touchPoints[names[names.length-1]];
        var p2:egret.Point = this.touchPoints[names[names.length-2]];

        ang = Math.atan2((p1.y-p2.y),(p1.x-p2.x)) / this.c;
        return ang;
    }

    private drawText()
    {
        /// prompt
        this._txInfo = new egret.TextField;
        this.addChild( this._txInfo );

        this._txInfo.size = 28;
        this._txInfo.x = 50;
        this._txInfo.y = 50;
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
        this._txInfo.textColor = 0x000000;
        this._txInfo.type = egret.TextFieldType.DYNAMIC;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;
        this._txInfo.wordWrap = true;
        this._txInfo.width = 400;

        this._txInfo.text =
            "This example needs to be tested on mobile devices．Pinch with two fingers\ncan zoom display object. Two fingers can rotate display object.";

        this._bgInfo = new egret.Shape;
        this.addChildAt( this._bgInfo, this.numChildren - 1 );

        this._bgInfo.x = this._txInfo.x;
        this._bgInfo.y = this._txInfo.y;
        this._bgInfo.graphics.clear();
        this._bgInfo.graphics.beginFill( 0xffffff, .5 );
        this._bgInfo.graphics.drawRect( 0, 0, this._txInfo.width, this._txInfo.height );
        this._bgInfo.graphics.endFill();
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