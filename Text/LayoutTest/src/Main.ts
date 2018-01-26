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

    private text:egret.TextField;
    private hAlignTexts:{[align:string]:string} = {};
    private vAlignTexts:{[align:string]:string} = {};
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this.initText();        
        this.changeText();        
    }

    private setAlgin(hAlign:string, vAlign:string){        
        var text:egret.TextField = this.text;
        text.textAlign = hAlign;
        text.verticalAlign = vAlign;
        text.text = this.hAlignTexts[text.textAlign] + "\n" + this.vAlignTexts[text.verticalAlign] + "\nTouch the stage to switch alignments";        
    }
    
    // 수평, 수직 기준에 관한 text를 넣어둠
    private initText(){
        this.hAlignTexts[egret.HorizontalAlign.LEFT] = "Horizontal alignment: align left";
        this.hAlignTexts[egret.HorizontalAlign.CENTER] = "Horizontal alignment: align center";
        this.hAlignTexts[egret.HorizontalAlign.RIGHT] = "Horizontal alignment: align right";
        
        this.vAlignTexts[egret.VerticalAlign.TOP] = "Vertical alignment: align top";
        this.vAlignTexts[egret.VerticalAlign.MIDDLE] = "Vertical alignment: align middle";
        this.vAlignTexts[egret.VerticalAlign.BOTTOM] = "Vertical alignment: align bottom";
        
        this.text = new egret.TextField();
        this.text.size = 30;
        this.text.width  = this.stage.stageWidth;
        this.text.height  = this.stage.stageHeight;
        this.text.lineSpacing = 10;
        this.addChild(this.text);
        
        this.setAlgin(egret.HorizontalAlign.CENTER, egret.VerticalAlign.MIDDLE);
    }

    // 수평기준 왼쪽, 중앙, 오른쪽 순서로, 수직기준 위, 중앙, 아래를 순서로 바뀜
    private changeText(){
        var self = this;
        
        var text:egret.TextField = self.text;
        
        var hAlign:Array<string> = [egret.HorizontalAlign.LEFT, 
            egret.HorizontalAlign.CENTER, egret.HorizontalAlign.RIGHT]; 
        var vAlign:Array<string> = [egret.VerticalAlign.TOP, 
            egret.VerticalAlign.MIDDLE, 
            egret.VerticalAlign.BOTTOM];
            
        var hCount:number = 0;
        var vCound:number = 0;
        self.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e:egret.TouchEvent) {
            self.setAlgin(hAlign[hCount], vAlign[vCound]);
            
            vCound++;
            if (vCound >= vAlign.length) {
                vCound = 0;
                hCount++;
                hCount %= hAlign.length;
            }
        }, self);
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