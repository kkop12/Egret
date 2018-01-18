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

    private _iTouchCollideStatus:number;
    private _bShapeTest:boolean;

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

        this._bird = this.createBitmapByName("mypicker_png");
        this.addChild( this._bird );

        this._bird.anchorOffsetX = this._bird.width / 2;
        this._bird.anchorOffsetY = this._bird.height / 2;
        this._bird.x = this.stage.stageWidth * 0.5;
        this._bird.y = this.stage.stageHeight * 0.618;
        
        ///  Small dots are used to prompt user of the position to  press
        this._dot = new egret.Shape;
        this._dot.graphics.beginFill( 0x00ff00 );
        this._dot.graphics.drawCircle( 0, 0, 5 );
        this._dot.graphics.endFill();

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
        this._txInfo.touchEnabled = true;
        this._txInfo.addEventListener( egret.TouchEvent.TOUCH_TAP, ( evt:egret.TouchEvent )=>{
            evt.stopImmediatePropagation();
            this._bShapeTest = ! this._bShapeTest;
            this.updateInfo( TouchCollideStatus.NO_TOUCHED );
        }, this );

        this.launchCollisionTest();        
    }
    
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    private startAnimation(result: string[]) {
        
    }

    private launchCollisionTest() {

        this._iTouchCollideStatus = TouchCollideStatus.NO_TOUCHED;
        this._bShapeTest = false;
        this.stage.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this );
        this.updateInfo( TouchCollideStatus.NO_TOUCHED );
    }

    private checkCollision( stageX:number, stageY:number ) {
        /***  The key code section of this sample begins ***/
        var bResult:boolean = this._bird.hitTestPoint( stageX, stageY, this._bShapeTest );
        /***  The key code section of this sample ends ***/

            ///  Small dots are used to synchronize figure positions
        this._dot.x = stageX;
        this._dot.y = stageY;

        /// Text message update
        this.updateInfo( bResult ? TouchCollideStatus.COLLIDED : TouchCollideStatus.TOUCHED_NO_COLLIDED );
    }

    private touchHandler( evt:egret.TouchEvent ){
        switch ( evt.type ){
            case egret.TouchEvent.TOUCH_MOVE:
                this.checkCollision( evt.stageX, evt.stageY );
                break;
            case egret.TouchEvent.TOUCH_BEGIN:
                if( !this._txInfo.hitTestPoint( evt.stageX, evt.stageY ) ){ /// Make sure that the touch start position is not in the text area
                    this.stage.addEventListener( egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this );
                    this.stage.once( egret.TouchEvent.TOUCH_END, this.touchHandler, this );
                    this.addChild( this._dot );
                    this.checkCollision( evt.stageX, evt.stageY );
                }
                break;
            case egret. TouchEvent.TOUCH_END:
                this.stage.removeEventListener( egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this );
                this.stage.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this );
                if( this._dot.parent ){
                    this._dot.parent.removeChild( this._dot );
                }
                this.updateInfo( TouchCollideStatus.NO_TOUCHED );
                break;
        }
    }
    
    private updateInfo( iStatus:number ){
        this._txInfo.text =
            "Switch collision detection result：\n" + ( ["Put your finger！","Wanna touch me？", "Don't touch me！"][iStatus] )
            +"\n\ncollision detection modes：\n" +( this._bShapeTest ? "non-transparent pixel region" : "rectangular surrounding box " )
            +"\n（touch text area）";
    }

    private _bird:egret.Bitmap;
    private _dot:egret.Shape;
    private _txInfo:egret.TextField;
}

class TouchCollideStatus{
    public static NO_TOUCHED:number = 0;
    public static TOUCHED_NO_COLLIDED:number = 1;
    public static COLLIDED:number = 2;
}