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

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


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
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private textfield: egret.TextField;

    private _icon:egret.DisplayObject;

    /**
     * 创建场景界面
     * Create scene interface
     */
    // 버튼들을 클릭하면 빨강색 점을 붙여줬다가 땜, 처음 botton 버튼엔 계속 달아둠
    protected createGameScene(): void {        
        var group = new eui.Group();
        group.width = this.stage.stageWidth;
        group.height = this.stage.stageHeight;
        this.addChild(group);
        
        var layout = new eui.VerticalLayout();
        layout.gap = 30;
        layout.verticalAlign = egret.VerticalAlign.MIDDLE;
        layout.horizontalAlign = egret.HorizontalAlign.CENTER;
        group.layout = layout;

        var icon:egret.Shape = new egret.Shape();
        icon.graphics.beginFill(0xcc2211);
        icon.graphics.drawCircle(12,12,6);
        icon.graphics.endFill();
        this._icon = icon;

        var renderTexture:egret.RenderTexture = new egret.RenderTexture();
        renderTexture.drawToTexture(icon);
        
        var btn1 = new eui.Button();        
        btn1.label = "botton";
        btn1.icon = renderTexture;
        btn1.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        group.addChild(btn1);

        var btn2 = new eui.Button();
        btn2.label = "down";        
        btn2.currentState = "down";
        //btn2.currentState = "disabled";
        btn2.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this);
        btn2.addEventListener(egret.TouchEvent.TOUCH_END,this.onTouch,this);
        group.addChild(btn2);

        var btn3 = new eui.Button();
        btn3.label = "disabled";        
        btn3.currentState = "disabled";
        btn3.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this);
        btn3.addEventListener(egret.TouchEvent.TOUCH_END,this.onTouch,this);
        group.addChild(btn3);

        var btn4 = new eui.Button();
        btn4.label = "normal";
        btn4.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        group.addChild(btn4);
        
        var label:eui.Label = <eui.Label>btn4.labelDisplay;
        label.size = 28;
        label.border = true;
        label.textColor = 0xcccccc;
        label.borderColor = 0xcccccc;
        label.text = "Define fonts";
    }
    
    private onTouch(event:egret.TouchEvent) {        
        var btn:eui.Button = <eui.Button>event.target;        
        var renderTexture:egret.RenderTexture = new egret.RenderTexture();
        renderTexture.drawToTexture(this._icon);

        switch (event.type) {
            case egret.TouchEvent.TOUCH_BEGIN:
                btn.icon = renderTexture;
                break;
            case egret.TouchEvent.TOUCH_END:
                btn.icon = null;
                break;
            default :
                break;
        }
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: Array<any>): void {
        
    }   
}
