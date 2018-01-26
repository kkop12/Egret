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

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        var input:egret.TextField = new egret.TextField();
        input.text = "This is a single line text input sample";
        this.addChild(input);
        input.width = 480;
        input.height = 60;
        input.x = 80;
        input.border = true;
        input.borderColor = 0x999999;
        input.verticalAlign = egret.VerticalAlign.MIDDLE;
        
        input.type = egret.TextFieldType.INPUT;        
        // input text만 지원되는 Focus로 이벤트 처리        
        input.addEventListener(egret.FocusEvent.FOCUS_IN, function (e:egret.FocusEvent) {
            label.text = "Input begins：";
        }, this);
        input.addEventListener(egret.FocusEvent.FOCUS_OUT, function (e:egret.FocusEvent) {
            label.text += "\nInput ends";
        }, this);
        input.addEventListener(egret.Event.CHANGE, function (e:egret.Event) {
            label.text = "Input begins：\n" + input.text;
        }, this);
        
        
        var area:egret.TextField = new egret.TextField();
        area.text = "This is a multi-line \ntext input sample";
        this.addChild(area);
        area.width = 480;
        area.height = 460;
        area.x = 80;
        area.y = 100;
        area.border = true;
        area.borderColor = 0x999999;
        
        area.multiline = true;
        area.type = egret.TextFieldType.INPUT;
        area.addEventListener(egret.FocusEvent.FOCUS_IN, function (e:egret.FocusEvent) {
            label.text = "Input begins";
        }, this);
        area.addEventListener(egret.FocusEvent.FOCUS_OUT, function (e:egret.FocusEvent) {
            label.text += "\nInput ends";
        }, this);
        area.addEventListener(egret.Event.CHANGE, function (e:egret.Event) {
            label.text = "Input begins：\n" + area.text;
        }, this);
        
        
        var label:egret.TextField = new egret.TextField();
        this.addChild(label);
        label.width = 480;
        label.x = 80;
        label.y = 600;
        label.textColor = 0xffffff;
        label.size = 18;
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