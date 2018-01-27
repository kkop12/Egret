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

    private _sound: egret.Sound;
    private _channel: egret.SoundChannel;

    /**  UI code **/
    private _playTxt:egret.TextField;
    private _pauseTxt:egret.TextField;
    private _stopTxt:egret.TextField;
    private _pauseTime: number = 30;

    private _bar:egret.Shape;
    private _progress:egret.Shape;
    private _updateTxt:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */

    private createGameScene() {        
        this.loadSound();
    }

    // Sound 로딩
    private loadSound() {
        var sound: egret.Sound = this._sound = new egret.Sound();;
        
        sound.addEventListener(egret.Event.COMPLETE, function (e: egret.Event) {
            this.init();
        }, this);
        
        sound.load("resource/assets/ccnn.mp3");     
    }
    // play / SOUND_COMPLETE로 음악이 끝날때를 알 수 있고, 관리 가능
    private play(){        
        this._channel = this._sound.play(this._pauseTime, 1);
        this._channel.addEventListener(egret.Event.SOUND_COMPLETE, this.onComplete, this);
        
        this.addEventListener(egret.Event.ENTER_FRAME, this.onTimeUpdate, this);
    }
    // stop / play할때 반환받은 soundchannel로 멈춤, 볼륨 조절 가능
    private stop() {
        if (this._channel) {
            this._channel.removeEventListener(egret.Event.SOUND_COMPLETE, this.onComplete, this);
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onTimeUpdate, this);
            
            this._channel.stop();
            this._channel = null;
        }
    }

    // mp3 파일이 다 재생되면 음악 멈춤, UI 상태 변화, Progress 초기화
    private onComplete(e:egret.Event){
        console.log("paly complete");
        this.stop();

        this.setAllAbled(false);
        
        this.setProgress(0);
    }

    // update progress
    private onTimeUpdate(e:egret.Event){
        var position:number = this._channel ? this._channel.position : 0;
        
        this.setProgress(position);
    }
    
    // Progress bar에 관한 Update
    private setProgress(position:number) {
        this._updateTxt.text = position.toFixed(1) + "/" +  this._sound.length.toFixed(1);
        
        var w:number= (position / this._sound.length) * 400;
        this._bar.x = w + this.stage.stageWidth / 2 - 200;
        
        var mask:egret.Rectangle = <egret.Rectangle>this._progress.mask || new egret.Rectangle(0, 0, 0, 60);
        
        mask.x = w;
        mask.width = 400 - w;
        this._progress.mask = mask;
    }

    // play, stop, pause text 상태를 설정
    private setAllAbled(isPlaying:boolean){
        this.setTextAbled(this._playTxt, !isPlaying);
        this.setTextAbled(this._stopTxt, isPlaying);
        this.setTextAbled(this._pauseTxt, isPlaying);
    }

    // play, stop, pause text의 설정에 따라 터치 On/Off    
    private setTextAbled(text:egret.TextField, touchEnabled:boolean) {
        text.touchEnabled = touchEnabled;
        if (touchEnabled) {
            text.textColor = 0xffffff;
        }
        else {
            text.textColor = 0x999999;
        }
    }
    
    private init(){
        var rap:number = 180;
        var rapH:number = 200;
        
        //play
        var playTxt: egret.TextField = this._playTxt = new egret.TextField();
        playTxt.text = "play";
        playTxt.size = 60;
        playTxt.x = 80;
        playTxt.y = 200 + rapH;
        playTxt.touchEnabled = true;
        playTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.play();

            this.setAllAbled(true);
        }, this);
        this.addChild(playTxt);

        //stop
        var stopTxt: egret.TextField = this._stopTxt = new egret.TextField();
        stopTxt.text = "stop";
        stopTxt.size = 60;
        stopTxt.x = playTxt.x + rap * 1;
        stopTxt.y = 200 + rapH;
        stopTxt.touchEnabled = true;
        stopTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (this._channel) {
                this._pauseTime = 0;
                
                this.stop();
                
                this.onTimeUpdate();
            }

            this.setAllAbled(false);

        }, this);
        this.addChild(stopTxt);

        //pause 
        var pauseTxt: egret.TextField = this._pauseTxt = new egret.TextField();
        pauseTxt.text = "pause";
        pauseTxt.size = 60;
        pauseTxt.x = playTxt.x + rap * 2;
        pauseTxt.y = 200 + rapH;
        pauseTxt.touchEnabled = true;
        pauseTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (this._channel) {
                this._pauseTime = this._channel.position;
                
                this.stop();
            }

            this.setAllAbled(false);
        }, this);
        this.addChild(pauseTxt);

        this.setAllAbled(false);
        
        var bg:egret.Shape = new egret.Shape();
        this.addChild(bg);
        bg.x = this.stage.stageWidth / 2 - 200;
        bg.y = 100 - 5 + rapH;
        bg.graphics.beginFill(0x999999);
        bg.graphics.drawRoundRect(0, 0, 400, 10, 5, 5);
        bg.graphics.endFill();
        
        this._progress = new egret.Shape();
        this.addChild(this._progress);
        this._progress.x = this.stage.stageWidth / 2 - 200;
        this._progress.y = 100 - 5 + rapH;
        this._progress.graphics.beginFill(0xffff00);
        this._progress.graphics.drawRoundRect(0, 0, 400, 10, 5, 5);
        this._progress.graphics.endFill();
        
        this._bar = new egret.Shape();
        this.addChild(this._bar);
        this._bar.x = this.stage.stageWidth / 2 - 200;
        this._bar.y = 100 + rapH;
        this._bar.graphics.beginFill(0xffff00);
        this._bar.graphics.drawCircle(0, 0, 20);
        this._bar.graphics.endFill();
        
        this._updateTxt = new egret.TextField();
        this._updateTxt.text = 0 + "/" +  this._sound.length.toFixed(1);
        this._updateTxt.width = 200;
        this._updateTxt.size = 30;
        this._updateTxt.x = this.stage.stageWidth / 2 - 100;
        this._updateTxt.y = 50 + rapH;
        this._updateTxt.textAlign = egret.HorizontalAlign.CENTER;
        this.addChild(this._updateTxt);        
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