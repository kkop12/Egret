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

    private _shpBeMask:egret.Shape;
    private _bird:egret.Bitmap;
    private _txInfo:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        let sky = new egret.Shape();
        sky.graphics.beginFill(0xffffff);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;        
        sky.graphics.drawRect(0,0,stageW,stageH);
        sky.graphics.endFill();
        this.addChild(sky);

        /// Shape used as mask
        this._shpBeMask = new egret.Shape;
        this._shpBeMask.graphics.lineStyle( 0x000000 )
        this._shpBeMask.graphics.beginFill( this.getRdmClr() );
        this._shpBeMask.graphics.drawEllipse( 0, 0, 200, 300 );
        this._shpBeMask.graphics.endFill();
        this._shpBeMask.x = ( this.stage.stageWidth - 200 ) / 2;
        this._shpBeMask.y = ( this.stage.stageHeight - 300 ) / 2;
        this.addChild( this._shpBeMask );
        
        /// Demo display object: an egret bird
        this._bird = this.createBitmapByName("myduck_png");
        var wHalfBird:number = this._bird.width / 2;
        var hHalfBird:number = this._bird.height / 2;
        this._bird.anchorOffsetX = wHalfBird;
        this._bird.anchorOffsetY = hHalfBird;
        /// Assign a random initialization location
        this._bird.x = wHalfBird + ( this.stage.stageWidth - wHalfBird * 2 ) * Math.random() ;
        this._bird.y = hHalfBird + ( this.stage.stageHeight - hHalfBird * 2 ) * Math.random() ;
        this.addChild( this._bird );

        /// prompt
        this._txInfo = new egret.TextField;
        this.addChildAt( this._txInfo, 1 );

        this._txInfo.size = 28;
        this._txInfo.x = 50;
        this._txInfo.y = 50;
        this._txInfo.width = this.stage.stageWidth - 100;
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
        this._txInfo.textColor = 0x000000;
        this._txInfo.type = egret.TextFieldType.DYNAMIC;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;
        this._txInfo.touchEnabled = true;
        this._txInfo.text =
            "Once touching the screen, the egret bird will turn into an oval-shaped mask area. You may move your finger (the egret bird) and observe the display changes of the oval under the mask ";
        
        this.launchMask();

    }

    private launchMask():void {

        this.stage.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this );

    }

    private updateBird( stageX:number, stageY:number ):void {
        /// The bird synchronizes finger position
        this._bird.x = stageX;
        this._bird.y = stageY;

    }

    private touchHandler( evt:egret.TouchEvent ){
        switch ( evt.type ){
            case egret.TouchEvent.TOUCH_MOVE:
                this.updateBird( evt.stageX, evt.stageY );
                break;
            case egret.TouchEvent.TOUCH_BEGIN:
                this.stage.addEventListener( egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this );
                this.stage.once( egret.TouchEvent.TOUCH_END, this.touchHandler, this );

                /***  The key code section of this sample begins ***/
                this._shpBeMask.mask = this._bird;
                /*** The key code section of this sample ends ***/
                
                this.updateBird( evt.stageX, evt.stageY );
                break;
            case egret. TouchEvent.TOUCH_END:
                this.stage.removeEventListener( egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this );
                this.stage.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this );
                
                this._shpBeMask.mask = null;
                this._bird.$maskedObject = null;
                break;
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

    private getRdmClr():number{
        return ( Math.floor( Math.random() * 0xff ) << 16 )
            + ( Math.floor( Math.random() * 0xff ) << 8 )
            + Math.floor( Math.random() * 0xff ) ;
    }
}