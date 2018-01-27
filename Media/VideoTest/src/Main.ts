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
    
    private _video:egret.Video;

    /**  UI code **/
    private _playTxt:egret.TextField;
    private _pauseTxt:egret.TextField;
    private _stopTxt:egret.TextField;
    private _fullTxt:egret.TextField;
    
    private _pauseTime: number = 0;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this.loadVideo();        
        this.initCtr();        
    }
   
    // video에 관한 설정 및 로드
    private loadVideo(){
        this._video = new egret.Video();
        this._video.x = 100;
        this._video.y = 200;
        this._video.width = 427;
        this._video.height = 240;
        this._video.fullscreen = false;
        this._video.poster = this._video.fullscreen ? "resource/assets/posterfullscreen.jpg" : "resource/assets/posterinline.jpg";
        this._video.load("resource/assets/trailer.mp4");
        this.addChild(this._video);

        this._video.addEventListener(egret.Event.COMPLETE, function (e) {
            console.log("complete");
        }, this);
        // this._video.fullscreen = false;
    }

    // play
    private play(){
        this.stop();
            
        this._video.play(this._pauseTime, false);
        this._video.addEventListener(egret.Event.ENDED, this.onComplete, this);
    }

    // stop
    private stop() {
        this._video.pause();
        this._video.fullscreen = false;        
    }

    // play complete
    private onComplete(e:egret.Event){
        console.log("play complete");
        this._video.removeEventListener(egret.Event.ENDED, this.onComplete, this);
        
        this.setAllAbled(false);
    }
    
    // fullscreen On/Off
    private changeScreen(){
        if (!this._video.paused) {
            this._video.fullscreen = !this._video.fullscreen;
        }
    }
    
    // pause했을때 화면은 멈추지만 소리가 멈추지않음. 해결방법 못찾음
    private initCtr() {
        var _video:egret.Video = this._video;
        var rap:number = this._video.width / 4 + 5;
        var rapH:number = 100;
        
        //play
        var playTxt: egret.TextField = this._playTxt = new egret.TextField();
        playTxt.text = "play";
        playTxt.size = 40;
        playTxt.x = this._video.x;
        playTxt.y = 400 + rapH;
        playTxt.touchEnabled = true;
        playTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {            
            this.play(this._pauseTime, false);            
            this.setAllAbled(true);
        }, this);
        this.addChild(playTxt);

        //stop
        var stopTxt: egret.TextField = this._stopTxt = new egret.TextField();
        stopTxt.text = "stop";
        stopTxt.size = 40;
        stopTxt.x = playTxt.x + rap * 1;
        stopTxt.y = 400 + rapH;
        stopTxt.touchEnabled = true;
        stopTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this._pauseTime = 0;
            _video.pause();

            this.setAllAbled(false);
        }, this);
        this.addChild(stopTxt);

        //pause 
        var pauseTxt: egret.TextField = this._pauseTxt = new egret.TextField();
        pauseTxt.text = "pause";
        pauseTxt.size = 40;
        pauseTxt.x = playTxt.x + rap * 2;
        pauseTxt.y = 400 + rapH;
        pauseTxt.touchEnabled = true;
        pauseTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this._pauseTime = _video.position;
            _video.pause();

            this.setAllAbled(false);
        }, this);
        this.addChild(pauseTxt);

        //fullscreen 
        var fullTxt: egret.TextField = this._fullTxt = new egret.TextField();
        fullTxt.text = "fullscreen";
        fullTxt.size = 40;
        fullTxt.x = playTxt.x + rap;
        fullTxt.y = 400 + rapH*2;
        fullTxt.touchEnabled = true;
        fullTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.changeScreen();
        }, this);
        this.addChild(fullTxt);
        
        this.setAllAbled(false);
    }
    
    // play, stop, pause, full text 상태 설정
    private setAllAbled(isPlaying:boolean) {
        this.setTextAbled(this._playTxt, !isPlaying);
        this.setTextAbled(this._stopTxt, isPlaying);
        this.setTextAbled(this._pauseTxt, isPlaying);
        this.setTextAbled(this._fullTxt, isPlaying);
    }
    
    // play, stop, pause, full text 상태에 따라 터치 On/Off
    private setTextAbled(text:egret.TextField, touchEnabled:boolean) {
        text.touchEnabled = touchEnabled;
        if (touchEnabled) {
            text.textColor = 0xffffff;
        }
        else {
            text.textColor = 0x999999;
        }
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