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
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        
        this._bird = this.createBitmapByName("mypicker_png");

        /// Define several positions for movement
        this._vcLocation = [
            new egret.Point( this._bird.width/2, 100 + this._bird.height/2 ) // 왼쪽 상단
            ,new egret.Point( this.stage.stageWidth - this._bird.width/2, this.stage.stageHeight - this._bird.height/2 ) // 오른쪽 하단
            ,new egret.Point( this._bird.width/2, this.stage.stageHeight - this._bird.height/2 ) // 왼쪽 하단
            ,new egret.Point( this.stage.stageWidth - this._bird.width/2, 100 + this._bird.height/2 ) // 오른쪽 상단
        ];
                
        this._bird.anchorOffsetX = this._bird.width/2;
        this._bird.anchorOffsetY = this._bird.height/2;
        this.addChild( this._bird );

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
        this._txInfo.wordWrap = true;
        this._txInfo.width = 400;
        
        this._txInfo.text =
                "Touch screen to start tween process from a random position";
        
        this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP, ()=>{
            this.launchTween();
        }, this );
                
        this._idxCurrLocation = -1;
        
        this.updateRdmLocation( true );
        this._bird.x = this.stage.stageWidth / 2; 
        this._bird.y = this.stage.stageHeight / 2; 
    }

    // 랜덤하게 뽑힌 포지션 배열 숫자를 기억해서 다음 터치할때 splice를 사용해서 전 포지션 배열 숫자를 지우고 중복을 피함
    private updateRdmLocation( bApply:boolean = false ) {
        var vcIdxLocation = [0,1,2,3];
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
    
    // Tween에 _bird로 정하고, 업데이트된 포지션으로 옮김.
    private launchTween(){
        var loc:egret.Point = this.updateRdmLocation();        
        egret.Tween.get( this._bird ).to( {x:loc.x,y:loc.y}, 300, egret.Ease.sineIn );        

        // Tween Event를 이용해서 0.5보다 크면 반시계 방향, 작으면 시계 방향으로 회전함
        // var loc:egret.Point = this.updateRdmLocation();
        // var funcChange = ():void=>{
        //     this._bird.rotation += 6 * iDirection;
        // }
        // var iDirection:number = Math.random() > .5 ? -1 : 1;
        // egret.Tween.get( this._bird, { onChange:funcChange, onChangeObj:this } )
        //     .to( {x:loc.x,y:loc.y}, 300, egret.Ease.sineIn );        
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