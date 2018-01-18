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

    private static STEP_ROT:number = 3;
    private static STEP_SCALE:number = .03;

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
    private _iAnimMode:number;
    private _nScaleBase:number;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {

        let sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        this._bird = this.createBitmapByName("mypicker_png");        
        this._bird.x = 150;
        this._bird.y = 500;
                                
        // Bitmap 자체의 texture의 폭과 너비, &getWidth, Height로도 가능하다는걸 확인
        this._bird.anchorOffsetX = this._bird.texture.textureWidth / 2;
        this._bird.anchorOffsetY = this._bird.texture.textureHeight / 2;

        this.addChild(this._bird);        

        this._txInfo = new egret.TextField();
        this.addChild( this._txInfo );
        
        this._txInfo.size = 28;
        this._txInfo.x = 50;
        this._txInfo.y = 50;
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
        this._txInfo.textColor = 0x000000;
        this._txInfo.type = egret.TextFieldType.DYNAMIC;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;


        this._bird.touchEnabled = true;

        
        // 5 x 5 격자식 색깔 배치
        /*
        var _myGrid = new MyGrid();
        this.addChild(_myGrid);
        _myGrid.x = 350;
        _myGrid.y = 700;
        */
        
        // 객체끼리의 자식 추가, 제거, 객체 깊이 바꾸기, 하위 객체 참조
        /*
        var _myGrid = new MyGrid();
        this.addChild(_myGrid);
        _myGrid.x = 350;
        _myGrid.y = 700;

        var _myGrid2 = new MyGrid();
        this.addChild(_myGrid2);
        _myGrid2.x = 0;
        _myGrid2.y = 0;

        var _myGrid3 = new MyGrid();
        _myGrid3.x = 100;
        _myGrid3.y = 100;
        _myGrid.addChild(_myGrid3);
        _myGrid2.addChild(_myGrid3);

        _myGrid2.removeChildren();
        this.removeChild(_myGrid2);
        this.removeChild(_myGrid3);

        _myGrid2.getChildAt(0).alpha = 0.5; // getComponent랑 비슷
        this.swapChildrenAt(0,1);
        */

        //화면 터치시 상황들
        this.stage.addEventListener( egret.TouchEvent.TOUCH_BEGIN, ( evt:egret.TouchEvent )=>{
            console.log("Clicked");
            
            // 터치 좌표쪽으로 이동시킴
            /*
            this._bird.x = evt.localX ;
            this._bird.y = evt.localY ;
            */

            //this._bird.alpha = 0.5;            

            // 그림을 앵커 x, y 축으로 돌림
            /*            
            this._bird.skewX += 20;
            this._bird.skewY += 20;
            */

        }, this );
        
        // let topMask = new egret.Shape();
        // topMask.graphics.beginFill(0x000000, 0.5);
        // topMask.graphics.drawRect(0, 0, stageW, 172);
        // topMask.graphics.endFill();
        // topMask.y = 33;
        // this.addChild(topMask);

        // let icon = this.createBitmapByName("egret_icon_png");
        // this.addChild(icon);
        // icon.x = 26;
        // icon.y = 33;

        // let line = new egret.Shape();
        // line.graphics.lineStyle(2, 0xffffff);
        // line.graphics.moveTo(0, 0);
        // line.graphics.lineTo(0, 117);
        // line.graphics.endFill();
        // line.x = 172;
        // line.y = 61;
        // this.addChild(line);


        // let colorLabel = new egret.TextField();
        // colorLabel.textColor = 0xffffff;
        // colorLabel.width = stageW - 172;
        // colorLabel.textAlign = "center";
        // colorLabel.text = "Hello Egret";
        // colorLabel.size = 24;
        // colorLabel.x = 172;
        // colorLabel.y = 80;
        // this.addChild(colorLabel);

        let textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;
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
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();

        this._iAnimMode = AnimModes.ANIM_ROT;
        this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP, ()=>{
            this._iAnimMode = ( this._iAnimMode + 1 ) % 3;
        }, this );

        this._nScaleBase = 0;
        
        this.addEventListener( egret.Event.ENTER_FRAME, ( evt:egret.Event )=>{

            switch ( this._iAnimMode ){
                case AnimModes.ANIM_ROT:        /// Rotate only
                    this._bird.rotation += Main.STEP_ROT;
                    break;
                case AnimModes.ANIM_SCALE:        /// Scale only,scale ratio 0.5~1
                    this._bird.scaleX = this._bird.scaleY = 0.5 + 0.5* Math.abs( Math.sin( this._nScaleBase += Main.STEP_SCALE ) );
                    break;
            }

            this._txInfo.text = 
                  "Rotation:" + this._bird.rotation 
                +"\nScale:" + this._bird.scaleX.toFixed(2) // toFixed 고정소수점 2자리로 표현
                +"\n\nTouch" +([" Scale"," Still"," Rotation"][this._iAnimMode])+ " Mode";
            
            return false;
        }, this );
    }
}

class AnimModes{
    public static ANIM_ROT:number = 0;
    public static ANIM_SCALE:number = 1;
}
