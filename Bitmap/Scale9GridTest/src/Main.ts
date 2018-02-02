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
    
    private _bmpUIUse9:egret.Bitmap;
    private _bmpUINouse9:egret.Bitmap;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        var bmd:egret.BitmapData = RES.getRes("dialog-bg_png");

        /// Produce definite numbers of egrets

        /// prompt
        this._txInfo = new egret.TextField;
        this.addChild( this._txInfo );

        this._txInfo.size = 28;
        this._txInfo.x = 50;
        this._txInfo.y = 50;
        
        this._txInfo.width = this.stage.stageWidth - 100;
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
        this._txInfo.textColor = 0x000000;
        this._txInfo.type = egret.TextFieldType.DYNAMIC;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;

        this._txInfo.text =
            "UI above uses 9 Grid\n UI below not uses 9 Grid";

        var yClipsStart = this._txInfo.x + this._txInfo.height + L.GAP_UNIFIED;
        L.W_UI_MAX = this.stage.stageWidth - L.GAP_UNIFIED * 2;
        L.H_UI_MAX = (this.stage.stageHeight - (yClipsStart + L.GAP_UNIFIED * 2)) / 2;

        /////////////////////////////////////////////// Use 9 Grid ////////////////////////////
        // 텍스쳐를 9 등분하여 scale이 커지거나 작아질때 모서리가 변형되지 않도록 1,3,7,9구역이 변형되지 않게 범위를 정함
        this._bmpUIUse9 = new egret.Bitmap( bmd );
        this.addChild( this._bmpUIUse9 );

        this._bmpUIUse9.width = L.W_UI_MAX;
        this._bmpUIUse9.height = L.H_UI_MIN;
        this._bmpUIUse9.anchorOffsetX = this._bmpUIUse9.width / 2;   
        this._bmpUIUse9.anchorOffsetY = this._bmpUIUse9.height / 2;

        this._bmpUIUse9.x = L.GAP_UNIFIED + L.W_UI_MAX / 2;      
        this._bmpUIUse9.y = yClipsStart + L.H_UI_MAX / 2 ;

        console.log("x :" + this._bmpUIUse9.x + " y :" + this._bmpUIUse9.y + " width :" + this._bmpUIUse9.width + " height :" + this._bmpUIUse9.height);        
        this._bmpUIUse9.scale9Grid = new egret.Rectangle( 84,84,572,572 );
                
        /////////////////////////////////////////////// Not use 9 Grid ////////////////////////////
        this._bmpUINouse9 = new egret.Bitmap( bmd );
        this.addChild( this._bmpUINouse9 );

        this._bmpUINouse9.width = L.W_UI_MAX;
        this._bmpUINouse9.height = L.H_UI_MIN;
        this._bmpUINouse9.anchorOffsetX = this._bmpUINouse9.width / 2;  
        this._bmpUINouse9.anchorOffsetY = this._bmpUINouse9.height / 2;

        this._bmpUINouse9.x = L.GAP_UNIFIED + L.W_UI_MAX / 2;          
        this._bmpUINouse9.y = this._bmpUIUse9.y + L.H_UI_MAX + L.GAP_UNIFIED ;
        
        // /// debug///
        // // var mark:egret.Shape = new egret.Shape;
        // // mark.graphics.lineStyle( 1, 0 );
        // // mark.graphics.moveTo( this._bmpUIUse9.x, this._bmpUIUse9.y );
        // // mark.graphics.lineTo( this._bmpUINouse9.x, this._bmpUINouse9.y );
        // // this.addChild( mark );

            egret.Tween.get( this._bmpUIUse9, {loop:true, onChange:()=>{
                this._bmpUIUse9.anchorOffsetX = this._bmpUIUse9.width / 2;
                this._bmpUIUse9.anchorOffsetY = this._bmpUIUse9.height / 2;
            }} )
                .to( {width:L.W_UI_MIN, height:L.H_UI_MAX}, 1000 ) 
                .to( {width:L.W_UI_MAX, height:L.H_UI_MIN}, 1000 );
        
            egret.Tween.get( this._bmpUINouse9, {loop:true, onChange:()=>{
                this._bmpUINouse9.anchorOffsetX = this._bmpUINouse9.width / 2;
                this._bmpUINouse9.anchorOffsetY = this._bmpUINouse9.height / 2;
            }} )
                .to( {width:L.W_UI_MIN, height:L.H_UI_MAX}, 1000 )
                .to( {width:L.W_UI_MAX, height:L.H_UI_MIN}, 1000 );
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

class MotionMode{
    public static ROT:number = 0; 
    public static MOV:number = 1; 
}

class L{
    public static GAP_UNIFIED:number = 10;
    public static W_UI_MAX:number ;
    public static H_UI_MAX:number ;  
    public static W_UI_MIN:number = 180; 
    public static H_UI_MIN:number = 180; 
}

