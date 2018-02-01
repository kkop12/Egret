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
    private static NUM:number = 10;
    private static SCALE_BASE:number = .5;
    private static SCALE_RANGE:number = .5;

    private _vcBird:Array<egret.Bitmap>;
    private _vcMotion:Array<number>;
    private _iMotionMode:number;
    private _nScaleBase:number;
    
    private _txInfo:egret.TextField;
    private _bgInfo:egret.Shape;
    
    private _rectScope:egret.Rectangle;        
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        
        // 그래픽 최적화, 모든 프레임에 자동 적용, 랜더링이 크게 줄어듬
        var bmd = RES.getRes("egret_01_small_png");

        var wHalfBird:number = bmd.width / 2;
        var hHalfBird:number = bmd.height / 2;

        this._rectScope = new egret.Rectangle( 
            wHalfBird * Main.SCALE_BASE, hHalfBird * Main.SCALE_BASE
            , this.stage.stageWidth - wHalfBird * Main.SCALE_BASE * 2
            , this.stage.stageHeight - hHalfBird * Main.SCALE_BASE * 2 
        );

        this._vcBird = new Array<egret.Bitmap>();
        
        for ( var i = 0; i < Main.NUM; ++i ) {
            var bird:egret.Bitmap = new egret.Bitmap( bmd );
            bird.anchorOffsetX = wHalfBird;
            bird.anchorOffsetY = hHalfBird;

            /// Random initial position
            bird.x = this._rectScope.x + this._rectScope.width * Math.random();
            bird.y = this._rectScope.y + this._rectScope.height * Math.random();

            //bird.x = 50 * i;
            //bird.y = 50 * i;

            bird.scaleX = bird.scaleY = Main.SCALE_BASE;

            this._vcBird.push( bird );
            this.addChild( bird );
        }

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
        this._txInfo.touchEnabled = true;
        //this._txInfo.background = true;
        //this._txInfo.backgroundColor = 0xffffff;
        this._txInfo.wordWrap = true;
        this._txInfo.text =
            "Touch to change moving birds and their movement pattern to observe changes of dirty rectangles corresponding to the birds’ movement";
        
        this._bgInfo = new egret.Shape;
        this.addChild( this._bgInfo );
        
        this._bgInfo.x = this._txInfo.x;
        this._bgInfo.y = this._txInfo.y;
        this._bgInfo.graphics.clear();
        this._bgInfo.graphics.beginFill( 0xffffff, .5 );
        this._bgInfo.graphics.drawRect( 0, 0, this._txInfo.width, this._txInfo.height );
        this._bgInfo.graphics.endFill();
        this._bgInfo.cacheAsBitmap = true;
        
        
        this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP, ( evt:egret.TouchEvent )=>{
            this.planRdmMotion();
        }, this );

        this.planRdmMotion();
        
        this._nScaleBase = 0;
        
        /// animation
        this.stage.addEventListener( egret.Event.ENTER_FRAME, ( evt:egret.Event )=>{
            
            switch ( this._iMotionMode ){
                case MotionMode.ROT:        
                    this._vcBird[ this._vcMotion[0] ].rotation += 3;
                    this._vcBird[ this._vcMotion[1] ].rotation -= 3;
                    this._vcBird[ this._vcMotion[2] ].rotation += 3;
                    var scale:number = Main.SCALE_BASE + Math.abs( Math.sin( this._nScaleBase += 0.03 )) * Main.SCALE_RANGE;
                    //console.log( "scale at:", Math.abs( Math.sin( this._nScaleBase ) ) );
                    this._vcBird[ this._vcMotion[0] ].scaleX = this._vcBird[ this._vcMotion[0] ].scaleY = scale;
                    this._vcBird[ this._vcMotion[1] ].scaleX = this._vcBird[ this._vcMotion[1] ].scaleY = scale;
                    this._vcBird[ this._vcMotion[2] ].scaleX = this._vcBird[ this._vcMotion[2] ].scaleY = scale;
                    break;
                case MotionMode.MOV:
                    var xTo:number;
                    if( ( xTo = this._vcBird[ this._vcMotion[0] ].x - 3) < this._rectScope.left ) xTo = this._rectScope.right;
                    this._vcBird[ this._vcMotion[0] ].x = xTo;
                    if( (xTo = this._vcBird[ this._vcMotion[1] ].x + 3) > this._rectScope.right ) xTo = this._rectScope.left;
                    this._vcBird[ this._vcMotion[1] ].x = xTo;
                    if( (xTo = this._vcBird[ this._vcMotion[2] ].x - 3) < this._rectScope.left ) xTo = this._rectScope.right;
                    this._vcBird[ this._vcMotion[2] ].x = xTo;
                    break;
            }
            
        }, this );
    }

    /// 동작 내용을 무작위로 설정합니다.
    private planRdmMotion():void {
        
        /// 무작위 운동 모드
        this._iMotionMode = Math.random() > .5 ? 0 : 1;
        
        /// 비율 복원
        if( this._vcMotion && this._vcMotion.length == 3 ){
            this._vcBird[ this._vcMotion[0] ].scaleX = this._vcBird[ this._vcMotion[0] ].scaleY = Main.SCALE_BASE;
            this._vcBird[ this._vcMotion[1] ].scaleX = this._vcBird[ this._vcMotion[1] ].scaleY = Main.SCALE_BASE;
            this._vcBird[ this._vcMotion[2] ].scaleX = this._vcBird[ this._vcMotion[2] ].scaleY = Main.SCALE_BASE;
        }
        
        this.setChildIndex( this._txInfo, this.numChildren - 1 );       /// 프롬프트 텍스트 및 배경 깊이 재설정
        this.setChildIndex( this._bgInfo, this.numChildren - 2 );  

        /// 임의로 3마리의 egrets를 가져와서 가장 높은 깊이를 확보
        this._vcMotion = new Array<number>();
        this._vcMotion.push( Math.floor( Main.NUM * Math.random() ) );
        this._vcMotion.push( Math.floor( Main.NUM * Math.random() ) );
        this._vcMotion.push( Math.floor( Main.NUM * Math.random() ) );
        this.setChildIndex( this._vcBird[ this._vcMotion[0] ], this.numChildren - 3 );
        this.setChildIndex( this._vcBird[ this._vcMotion[1] ], this.numChildren - 4 );
        this.setChildIndex( this._vcBird[ this._vcMotion[2] ], this.numChildren - 5 );
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

class MotionMode{
    public static ROT:number = 0; 
    public static MOV:number = 1; 
}