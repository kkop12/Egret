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

    private _txInfo:egret.TextField;
    private _contMotion:egret.Sprite;
    private _vcBird:Array<MotionBMP>;
    private _bmpSnap:egret.Bitmap;
    private _rectClip:egret.Rectangle;
    private _shapeSnapEffect:egret.Shape;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {        
        this._txInfo = new egret.TextField;
        this.addChild( this._txInfo );

        this._txInfo.size = 28;
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
        this._txInfo.textColor = 0x000000;
        this._txInfo.type = egret.TextFieldType.DYNAMIC;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;
        this._txInfo.wordWrap = true;

        this._txInfo.text =
            "The screen is divided in two small areas, above is the screen transform area and below the screenshot display area. " +
            "\n Touch screen to take screenshots! ";
        this._txInfo.x = 50;
        this._txInfo.width =  this.stage.stageWidth - 100;
        this._txInfo.y = 50;
        //this._txInfo.y = this.stage.stageHeight - this._txInfo.height - L.PADDING_SIDE;

        var yClipsStart:number = this._txInfo.x + this._txInfo.height + L.GAP_UNIFIED;
        
        L.W_CLIP = this.stage.stageWidth - L.GAP_UNIFIED * 2;
        L.H_CLIP = ( this.stage.stageHeight - ( yClipsStart + L.GAP_UNIFIED * 2 ) ) /2;
        this._rectClip = new egret.Rectangle( 0, 0, L.W_CLIP, L.H_CLIP );
        // bird 그림들이 보여야 할 공간
        //egret.log( "L.H_CLIP:", L.H_CLIP );
        
        /////////////////////////////////////////////// animation container ////////////////////////////        
        var bmd:egret.BitmapData = RES.getRes("cartoon-egret_01_small_png");

        this._contMotion = new egret.Sprite;
        this._contMotion.x = L.GAP_UNIFIED;
        this._contMotion.y = yClipsStart ;
        this.addChild( this._contMotion );
        console.log( this._txInfo.y  );

        // 뒷배경        
        var iFillColor:number = ( Math.floor( Math.random() * 0xff ) << 16 )
            + ( Math.floor( Math.random() * 0xff ) << 8 )
            + Math.floor( Math.random() * 0xff ) ;
        var shpBg:egret.Shape = new egret.Shape;
        shpBg.graphics.beginFill( iFillColor );
        shpBg.graphics.drawRect( 0, 0, L.W_CLIP, L.H_CLIP );
        shpBg.graphics.endFill();
        shpBg.cacheAsBitmap = true;
        this._contMotion.addChild( shpBg );

        this._contMotion.mask = this._rectClip;

        this._vcBird = new Array<MotionBMP>();
        for( var i:number = 0; i<24; ++i ){
            var bird:MotionBMP = new MotionBMP( bmd );
            bird.anchorOffsetX = bird.width / 2;
            bird.anchorOffsetY = bird.height / 2;
            bird.x = L.W_CLIP * Math.random();
            bird.y = L.H_CLIP * Math.random();
            bird.scaleX = bird.scaleY = .5;
            bird.vx = Math.random() > .7 ? ( 1 + Math.random() * 3 ) * ( Math.random() > .5 ? 1 : -1 ) : 0;
            bird.vy = Math.random() > .7 ? ( 1 + Math.random() * 3 ) * ( Math.random() > .5 ? 1 : -1 ) : 0;
            bird.va = ( 1 + Math.random() * 3 ) * ( Math.random() > .5 ? 1 : -1 );
            this._contMotion.addChild( bird );
            this._vcBird.push( bird );
        }
        
        /////////////////////////////////////////////// snapshot ////////////////////////////        
        this._bmpSnap = new egret.Bitmap;
        //this._bmpSnap.anchorOffsetX = L.W_CLIP / 2;
        //this._bmpSnap.anchorOffsetY = L.H_CLIP / 2;
        this._bmpSnap.x = L.GAP_UNIFIED;
        this._bmpSnap.y = this._contMotion.y + L.H_CLIP + L.GAP_UNIFIED;
        this.addChild( this._bmpSnap );
                
        this._shapeSnapEffect = new egret.Shape;
        this._shapeSnapEffect.graphics.beginFill( 0xFFFFFF );
        this._shapeSnapEffect.graphics.drawRect( 0, 0, L.W_CLIP, L.H_CLIP );
        this._shapeSnapEffect.graphics.endFill();
        this._shapeSnapEffect.cacheAsBitmap = true;
        //this._shapeSnapEffect.anchorOffsetX = L.W_CLIP / 2;
        //this._shapeSnapEffect.anchorOffsetY = L.H_CLIP / 2;
        this._shapeSnapEffect.x = this._bmpSnap.x;
        this._shapeSnapEffect.y = this._bmpSnap.y;
        
        this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP, ()=>{
            console.log( "take!" );            
            var rt:egret.RenderTexture = new egret.RenderTexture;
            // drawToTexture의 범위에 있는 걸 bitmapData로 반환해줌            
            rt.drawToTexture( this._contMotion, this._rectClip );
            this._bmpSnap.texture = rt;            
            this.addChild( this._shapeSnapEffect );
            this._shapeSnapEffect.alpha = 1;
            egret.Tween.get( this._shapeSnapEffect ).to(  { alpha:0 }, 500 ).call( ()=>{
                if( this._shapeSnapEffect.parent ) this._shapeSnapEffect.parent.removeChild( this._shapeSnapEffect );
            } );
        }, this );

        // Bird 자동 이동        
        this.addEventListener( egret.Event.ENTER_FRAME, ()=>{
            for( var i:number = this._vcBird.length - 1; i > -1; --i ){
                var bird:MotionBMP = this._vcBird[i]; 
                var xTo:number = bird.x + bird.vx;
                if( xTo > L.W_CLIP ) xTo = 0;
                else if( xTo < 0 ) xTo = L.W_CLIP;
                bird.x = xTo;
                
                var yTo:number = bird.y + bird.vy;
                if( yTo > L.H_CLIP ) yTo = 0;
                else if( yTo < 0 ) yTo = L.H_CLIP;
                bird.y = yTo;
                
                bird.rotation +=  bird.va;
            }
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
}

class MotionBMP extends egret.Bitmap{
    public vx:number;       
    public vy:number;       
    public va:number;       
}

class L{
    public static GAP_UNIFIED:number = 50;
    public static W_CLIP:number ;
    public static H_CLIP:number ; 
}



