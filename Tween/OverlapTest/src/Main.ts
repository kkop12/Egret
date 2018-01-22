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
    
    private _rotCommon:number;
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this._bird = this.createBitmapByName("mypicker_png");
        
        this._vcLocation = [
            new egret.Point( this._bird.width/2, 100 + this._bird.height/2 )
            ,new egret.Point( this.stage.stageWidth - this._bird.width/2, this.stage.stageHeight - this._bird.height/2 )
            ,new egret.Point( this._bird.width/2, this.stage.stageHeight - this._bird.height/2 )
            ,new egret.Point( this.stage.stageWidth - this._bird.width/2, 100 + this._bird.height/2 )
        ];
        
        this._rotCommon = 180/Math.PI * Math.atan2( 
            this._vcLocation[1].y - this._vcLocation[0].y, this._vcLocation[1].x - this._vcLocation[0].x );
        
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
        this._txInfo.width = 400;
        
        this._txInfo.text =
                "This is a composite animation composed with tween animations of 4 stages that loop back and forth (you don’t need to touch the screen!)";
        
        /// Start display
        this._idxCurrLocation = -1;
        
        this._bird.x = this._vcLocation[3].x;
        this._bird.y = this._vcLocation[3].y;
        this._bird.rotation = - 90;
        console.log( this._rotCommon );

        this.launchTween();
    }

    // 4방향에 맞는 좌표와 실행되는 시간, 그쪽 방향으로 가는 회전값, 기다리는 시간을 Tween에 입력
    private launchTween(){        
        egret.Tween.get( this._bird, { loop:true} )
            .to( {x:this._vcLocation[0].x, y:this._vcLocation[0].y}, 500 )
                .call( ()=>{ this._bird.rotation = 180 - this._rotCommon;  } ).wait( 200 )
            .to( {x:this._vcLocation[1].x, y:this._vcLocation[1].y}, 500 )
                .call( ()=>{ this._bird.rotation = - 90; } ).wait( 200 )
            .to( {x:this._vcLocation[2].x, y:this._vcLocation[2].y}, 500 )
                .call( ()=>{ this._bird.rotation = this._rotCommon; } ).wait( 200 )
            .to( {x:this._vcLocation[3].x, y:this._vcLocation[3].y}, 500 )
                .call( ()=>{ this._bird.rotation = - 90; } ).wait( 200 );
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