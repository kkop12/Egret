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

    public static UNITS_PER_CONT:number = 16;
    
    private static NUM:number = 64;
    private static SCALE_BASE:number = .7;
    private static SCALE_RANGE:number = .6;

    private _vcCont:Array<MotionSprite>; 
    private _iMotionMode:number;        
    
    private _nScaleBase:number;         
    private _txInfo:egret.TextField;    
    private _bgInfo:egret.Shape;        
    
    private _rectScope:egret.Rectangle;  
    
    private _bCache:boolean;

    private _bmd:egret.BitmapData;       

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this._bmd = RES.getRes("cartoon-egret_02_small_png");

        this._rectScope = new egret.Rectangle(
            0, 0, this.stage.stageWidth, this.stage.stageHeight 
        );
        
        this._vcCont = new Array<MotionSprite>();
        
        // 배열로 쉽게 관리
        for ( var i = 0; i < Main.NUM; ++i ) {
            var cont:MotionSprite = new MotionSprite();

            cont.anchorOffsetX = L.W_SHAPE / 2;
            cont.anchorOffsetY = L.H_SHAPE / 2;
            cont.x = this._rectScope.x + this._rectScope.width * Math.random();
            cont.y = this._rectScope.y + this._rectScope.height * Math.random();
            cont.factor = .8 + Math.random() * .4; // 고유값

            this._vcCont.push( cont );
            this.addChild( cont );
        }
        
        // 초기화, 배치 및 그리기, 앵커 설정
        BatchContentFiller.reset( this._vcCont );
        BatchContentFiller.fill( this._vcCont );
        BatchContentFiller.autoAncher( this._vcCont );

        this._txInfo = new egret.TextField;
        this.addChild( this._txInfo );

        this._txInfo.size = 28;
        this._txInfo.x = 250;
        this._txInfo.y = 10;
        this._txInfo.width = this.stage.stageWidth - 260;
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
        this._txInfo.textColor = 0x000000;
        this._txInfo.type = egret.TextFieldType.DYNAMIC;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;
        this._txInfo.touchEnabled = true;
        this._txInfo.cacheAsBitmap = true;
        //this._txInfo.background = true;
        //this._txInfo.backgroundColor = 0xffffff;

        this._bgInfo = new egret.Shape;
        this.addChildAt( this._bgInfo, this.numChildren - 1 );

        this._bgInfo.x = this._txInfo.x;
        this._bgInfo.y = this._txInfo.y;
        this._bgInfo.cacheAsBitmap = true;
        
        this._nScaleBase = 0;
        this._bCache = false;
        
        this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP, ( evt:egret.TouchEvent )=>{
            this.planRdmMotion();
        }, this );
        this._txInfo.addEventListener( egret.TouchEvent.TOUCH_TAP, ( evt:egret.TouchEvent )=>{
            evt.stopImmediatePropagation();
            this._bCache = !this._bCache;
            for( var i:number = this._vcCont.length - 1; i>=0; i-- ){
                this._vcCont[ i ].cacheAsBitmap = this._bCache;
            }
            this.updateInfo();
        }, this );

        this.planRdmMotion();
        
        /// 모드에 따라, 회전과 이동
        this.stage.addEventListener( egret.Event.ENTER_FRAME, ( evt:egret.Event )=>{            
            switch ( this._iMotionMode ){
                case MotionMode.ROT:       
                    var scale:number = Main.SCALE_BASE + Math.abs( Math.sin( this._nScaleBase += 0.05 )) * Main.SCALE_RANGE;
                    for( var i:number = this._vcCont.length - 1; i>=0; i-- ){
                        this._vcCont[ i ].rotation += 3 * ( i%2 ? 1 : -1 ) * this._vcCont[ i ].factor;
                        this._vcCont[ i ].scaleX = this._vcCont[ i ].scaleY = scale;
                    }
                    break;
                case MotionMode.MOV:  
                    var xTo:number;
                    for( var i:number = this._vcCont.length - 1; i>=0; i-- ){
                        xTo = this._vcCont[ i ].x + 3 * ( i%2 ? 1 : -1 ) * this._vcCont[ i ].factor;
                        if( xTo < this._rectScope.left ){
                            xTo = this._rectScope.right;
                        }else if( xTo > this._rectScope.right ){
                            xTo = this._rectScope.left;
                        }
                        this._vcCont[ i ].x = xTo;
                    }
                    break;
            }            
        }, this );
    }
    
    private planRdmMotion():void {
        
        if( arguments.callee['runyet'] == undefined ){ 
            arguments.callee['runyet'] = 1;
            this._iMotionMode = Math.random() > .5 ? MotionMode.ROT : MotionMode.MOV;
        }else{
            this._iMotionMode = ( this._iMotionMode + 1 ) % MotionMode.TOTAL ;
        }
        this.updateInfo();
                
        switch ( this._iMotionMode ){
            case MotionMode.ROT:
                for( var i:number = this._vcCont.length - 1; i>=0; i-- ){
                    this._vcCont[ i ].scaleX = this._vcCont[ i ].scaleY = Main.SCALE_BASE;
                }
                break;
            case MotionMode.MOV:
                for( var i:number = this._vcCont.length - 1; i>=0; i-- ){
                    this._vcCont[ i ].scaleX = this._vcCont[ i ].scaleY = Main.SCALE_BASE + Math.random() * Main.SCALE_RANGE;
                }
                break;
        }
    }

    private updateInfo():void {
        this._txInfo.text =
            "Touch text to switch whether or not use bitmap cache" +
            "\ncurrent bitmap cache：" + ( this._bCache ? "on\n still jammed? Change a phone!" : "off\n Your phone is too powerful if it’s not jammed!" ) +
            "\ntouch stage to switch among rotation, scale, translation" +
            "\nCurrent mode：" + ( ["Rotate and scale" , "translation"][this._iMotionMode]  ) ;

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

}

class MotionSprite extends egret.Sprite{    
    public factor:number;
}

class L{        
    public static W_SHAPE:number = 160;
    public static H_SHAPE:number = 210;
}

class MotionMode{     
    public static ROT:number = 0;
    public static MOV:number = 1;

    public static TOTAL:number = 2;
}

class BatchContentFiller{  
    constructor( ){
    }
    
    
    public  static  fill( vcCont:Array<egret.Sprite> ){
        for( var i:number = 0; i < Main.UNITS_PER_CONT; i++ ){
            this.prodRdmGraph( vcCont, L.W_SHAPE, L.H_SHAPE );
        }
    }
    
    public static prodRdmGraph( vcCont:Array<egret.Sprite>, w:number, h:number ):void{
        var iTypeShape:number = Math.floor( Math.random() * 2 );
        var iFillColor:number = ( Math.floor( Math.random() * 0xff ) << 16 ) 
            + ( Math.floor( Math.random() * 0xff ) << 8 ) 
            + Math.floor( Math.random() * 0xff ) ;
        var iLineColor:number = ( Math.floor( Math.random() * 0xff ) << 16 )
            + ( Math.floor( Math.random() * 0xff ) << 8 )
            + Math.floor( Math.random() * 0xff ) ;
        var radius:number = 20 + Math.random() * 10;
        var wRect:number = 30 + Math.random() * 20;
        var hRect:number = 20 + Math.random() * 10;
        var xRdm:number = L.W_SHAPE * Math.random();
        var yRdm:number = L.H_SHAPE * Math.random();
        console.log( "prodRdmGraph:", radius, wRect, hRect, xRdm, yRdm, iFillColor, iLineColor, iTypeShape );
        for( var i:number = vcCont.length - 1; i>=0; i-- ){
            switch ( iTypeShape ){
                case 0: /// rectangle
                    //vcCont[i].graphics.lineStyle( iLineColor );
                    vcCont[i].graphics.beginFill( iFillColor );
                    vcCont[i].graphics.drawRect( xRdm - wRect/2, yRdm - hRect/2, wRect, hRect );
                    vcCont[i].graphics.endFill();
                    console.log( "prodRdmGraph: Draw rectangle", i );
                    break;
                case 1:  /// circle
                    //vcCont[i].graphics.lineStyle( iLineColor );
                    vcCont[i].graphics.beginFill( iFillColor );
                    vcCont[i].graphics.drawCircle( xRdm, yRdm, radius );
                    vcCont[i].graphics.endFill();
                    break;
            }
        }
    }
    
    public static autoAncher( vcCont:Array<egret.Sprite> ):void{
        for( var i:number = vcCont.length - 1; i>=0; i-- ){
            vcCont[i].anchorOffsetX = vcCont[i].width / 2;
            vcCont[i].anchorOffsetY = vcCont[i].height / 2;
            console.log( "vcCont[i] New anchor：", vcCont[i].anchorOffsetX, vcCont[i].anchorOffsetY );
        }
    }

    public static reset( vcCont:Array<egret.Sprite> ):void{
        for( var i:number = vcCont.length - 1; i>=0; i-- ){
            vcCont[i].graphics.clear();
            vcCont[i].removeChildren();
        }
    }
}