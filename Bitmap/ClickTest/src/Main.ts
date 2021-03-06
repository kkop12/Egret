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

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {
                console.log('hello,world')
            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }


        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;

    private _bigbird:egret.Bitmap;
    private _dot:egret.Shape;
    private _txInfo:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        
        this._bigbird = this.createBitmapByName("mypicker_png");
        this.addChild( this._bigbird );

        this._bigbird.anchorOffsetX = this._bigbird.width / 2;
        this._bigbird.anchorOffsetY = this._bigbird.height / 2;
        this._bigbird.x = this.stage.stageWidth * 0.5;
        this._bigbird.y = this.stage.stageHeight * 0.618;
        this._bigbird.rotation = 35;
        
        this._dot = new egret.Shape;
        this._dot.graphics.beginFill( 0x00ff00 );
        this._dot.graphics.drawCircle( 0, 0, 5 );
        this._dot.graphics.endFill();
        
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
        this._txInfo.wordWrap = true;
        this._txInfo.width = 400;
        this._txInfo.addEventListener( egret.TouchEvent.TOUCH_TAP, ( evt:egret.TouchEvent )=>{
            evt.stopImmediatePropagation();
            
            this._bigbird.pixelHitTest = !this._bigbird.pixelHitTest;
                        
            this.updateInfo( false );
        }, this );
        
        this.launchCollisionTest();
    }                
    
    private updateInfo( bTouch:boolean ){
        this._txInfo.text =
            "Click through result：" + ( bTouch ? "don’t touch me！！": "Not yet touched！" )
            +"\n\n click through detection mode：" +( this._bigbird.pixelHitTest ? " little egret is transparent" : "little egret is not transparent" )
            +"\n（Touch text area to toggle）";
    }

    private touchHandler( evt:egret.TouchEvent ){        
        switch ( evt.type ){
            case egret.TouchEvent.TOUCH_MOVE:
                this.checkCollision( evt.stageX, evt.stageY, true );
                break;
            case egret.TouchEvent.TOUCH_BEGIN:
                // 터치 시작이 텍스트 영역이 아니라면 터치 표시 점과 이벤트 지정
                if( !this._txInfo.hitTestPoint( evt.stageX, evt.stageY ) ){ 
                    evt.currentTarget.addEventListener( egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this );
                    evt.currentTarget.once( egret.TouchEvent.TOUCH_END, this.touchHandler, this );
                    this.addChild( this._dot );
                    this.checkCollision( evt.stageX, evt.stageY, true );
                }
                break;
            case egret. TouchEvent.TOUCH_END:
            case egret. TouchEvent.TOUCH_RELEASE_OUTSIDE:
                evt.currentTarget.removeEventListener( egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this );
                evt.currentTarget.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this );
                if( this._dot.parent ){
                    this._dot.parent.removeChild( this._dot );
                }
                this.updateInfo( false );
                break;
        }
    }

    private launchCollisionTest():void {

        this._bigbird.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this );        
        this._bigbird.pixelHitTest = false; // texture의 그려질 투명한 부분을 충돌 체크 할 것인지 명령
        this._bigbird.touchEnabled = true;

        this.updateInfo( false );
    }

    // 터치 좌표 = 점 좌표
    private checkCollision( stageX:number, stageY:number, bTouch:boolean ):void {
            
        this._dot.x = stageX;
        this._dot.y = stageY;
        
        this.updateInfo( bTouch );
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
}

class TouchCollideStatus{
    public static NO_TOUCHED:number = 0;
    public static TOUCHED_NO_COLLIDED:number = 1;
    public static COLLIDED:number = 2;
}


