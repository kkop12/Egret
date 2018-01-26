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
        var text:egret.TextField = new egret.TextField();
        text.textColor = 0xffffff;
        text.width = 540;
        text.size = 30;
        text.lineSpacing = 40;
        text.wordWrap = true;
                
        // text style을 일일이 정해줄 수 있음, 문법이 잘 이해가지않음.
        text.textFlow = <Array<egret.ITextElement>>[
            {text: "No longer to worry that I cannot say a word in ", style: {"size": 20}}, 
            {text: "Egret ", style: {"textColor": 0x336699, "size": 60, "strokeColor": 0x6699cc, "stroke": 2}},
            {text: "that cannot contain ", style: {"fontFamily": "楷体"}},
            {text: "all kinds of ", style: {"fontFamily": "楷体", "underline" : true}},
            {text: "texts ", style: {"textColor": 0xff0000}},
            {text: "with ", style: {"textColor": 0x00ff00}},
            {text: "different ", style: {"textColor": 0xf000f0}},
            {text: "colors ", style: {"textColor": 0x00ffff}},
            {text: "、\n"},
            {text: "s", style: {"size": 56}},
            {text: "i", style: {"size": 16}},
            {text: "e", style: {"size": 26}},
            {text: "s ", style: {"size": 34}},
            {text: "or "},
            {text: "f", style: {"italic": true, "textColor": 0x00ff00}},
            {text: "o", style: {"size": 26, "textColor": 0xf000f0}},
            {text: "m", style: {"italic": true, "textColor": 0xf06f00}},
            {text: "at", style: {"fontFamily": "KaiTi"}},//楷体
            {text: "s！"}
        ];
        
        this.addChild(text);
        text.x = 320 - text.textWidth / 2;
        text.y = 400 - text.textHeight / 2;

        // XML 스타일, 문법공부 필수
        // var text:egret.TextField = new egret.TextField();
        // text.textColor = 0xffffff;
        // text.width = 540;
        // text.size = 30;
        // text.lineSpacing = 40;
        // text.wordWrap = true;
        
        // var str = '<font size=20>No longer to worry that I cannot say a word in</font>'
        //           + '<font color=0x336699 size=60 strokecolor=0x6699cc stroke=2>Egret</font>'
        //           + '<font fontfamily="楷体"> that cannot contain</font>' 
        //           + '<font fontfamily="楷体"><u>all kinds of</u></font>' 
        //           + '<font color=0xff0000>texts </font>' 
        //           + '<font color=0x00ff00>with </font>' 
        //           + '<font color=0xf000f0>different </font>' 
        //           + '<font color=0x00ffff>colors</font>' 
        //           + '<font>、\n</font>' 
        //           + '<font size=56>s</font>' 
        //           + '<font size=16>i</font>' 
        //           + '<font size=26>z</font>' 
        //           + '<font size=34>es </font>' 
        //           + '<font>or </font>' 
        //           + '<font color=0x00ff00><i>f</i></font>' 
        //           + '<font size=26 color=0xf000f0>o</font>' 
        //           + '<font color=0xf06f00><i>r</i></font>' 
        //           + '<font fontfamily="KaiTi">mat</font>' 
        //           + '<font>s！</font>' 
        // text.textFlow = new egret.HtmlTextParser().parser(str);
                
        // this.addChild(text);
        // text.x = 320 - text.textWidth / 2;
        // text.y = 400 - text.textHeight / 2;
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