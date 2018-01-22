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
    private _txInfo:egret.TextField;

    private _vcLocation:Array<egret.Point>;
    private _idxCurrLocation:number;

    private _idxEase:number;

    private _vcEaseFunc: Array<EaseFunc>;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this._bird = this.createBitmapByName("mypicker_png");

        this._vcLocation = [
            //new egret.Point( bmd.width/2, 160 + bmd.height/2 )
            //,new egret.Point( this.stage.stageWidth - bmd.width/2, this.stage.stageHeight - bmd.height/2 )
            new egret.Point( this._bird.width/2, this.stage.stageHeight - this._bird.height/2 )
            ,new egret.Point( this.stage.stageWidth - this._bird.width/2, 160 + this._bird.height/2 )
        ]

        this._bird.anchorOffsetX = this._bird.width/2;
        this._bird.anchorOffsetY = this._bird.height/2;
        this.addChild( this._bird );

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
        this._txInfo.wordWrap = true;

        this._idxEase = -1;

        /// Touch the stage to trigger a tween
        this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP, ()=>{
            this.launchTween();
        }, this );

        /// Definition of Tween ease Array
        this._vcEaseFunc = [];
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.sineIn" ,egret.Ease.sineIn ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.sineOut" ,egret.Ease.sineOut  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.sineInOut" ,egret.Ease.sineInOut  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.backIn" ,egret.Ease.backIn  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.backOut" ,egret.Ease.backOut  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.backInOut" ,egret.Ease.backInOut  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.circIn" ,egret.Ease.circIn  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.circOut" ,egret.Ease.circOut  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.circInOut" ,egret.Ease.circInOut  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.bounceIn" ,egret.Ease.bounceIn  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.bounceOut" ,egret.Ease.bounceOut  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.bounceInOut" ,egret.Ease.bounceInOut  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.elasticIn" ,egret.Ease.elasticIn  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.elasticOut" ,egret.Ease.elasticOut  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.elasticInOut" ,egret.Ease.elasticInOut  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.quadIn" ,egret.Ease.quadIn  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.quadOut" ,egret.Ease.quadOut  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.quadInOut" ,egret.Ease.quadInOut  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.cubicIn" ,egret.Ease.cubicIn  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.cubicOut" ,egret.Ease.cubicOut  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.cubicInOut" ,egret.Ease.cubicInOut  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.quartIn" ,egret.Ease.quartIn  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.quartOut" ,egret.Ease.quartOut  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.quartInOut" ,egret.Ease.quartInOut  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.quintIn" ,egret.Ease.quintIn  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.quintOut" ,egret.Ease.quintOut  ) );
        this._vcEaseFunc.push( new EaseFunc( "egret.Ease.quintInOut" ,egret.Ease.quintInOut  ) );

        this._idxCurrLocation = -1;
        this.updateRdmLocation( true );
        this.updatePrompt();
    }

    private updatePrompt( sAppend:string = "" ){
        this._txInfo.text =
            "Touch screen to start tween process of a random location. Every tween uses different interpolation equation" +
            "\n current interpolation：" + sAppend ;
    }

    // 중복 회피
    private updateRdmLocation( bApply:boolean = false ){
        var vcIdxLocation = [ 0, 1 ]; 
        if( this._idxCurrLocation != -1 ){     

            vcIdxLocation.splice( this._idxCurrLocation, 1 );
        }
        var loc:egret.Point = this._vcLocation[ this._idxCurrLocation = vcIdxLocation[ Math.floor( Math.random()*vcIdxLocation.length ) ] ];
        if( bApply ){
            this._bird.x = loc.x;
            this._bird.y = loc.y;
        }
        return loc;
    }
    
    private launchTween(){
        var loc:egret.Point = this.updateRdmLocation();
        
        // 나머지 값으로 배열 순서대로 값이 나오게 함
        var params:EaseFunc = this._vcEaseFunc[ ++this._idxEase % this._vcEaseFunc.length ];
        egret.Tween.get( this._bird )
            .to( {x:loc.x,y:loc.y}, 600, params.func );        
        this.updatePrompt( params.name );
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

class EaseFunc{
    public name:string;
    public func:Function;
    constructor( name:string, func:Function ){
        this.name = name;
        this.func = func;
    }
}