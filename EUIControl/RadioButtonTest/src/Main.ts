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

    private _info:eui.Label;

    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        
        var group = new eui.Group();
        group.width = this.stage.stageWidth;
        group.height = this.stage.stageHeight;
        this.addChild(group);

        // layout gap으로 자동으로 30만큼 간격을 벌림
        var layout = new eui.VerticalLayout();
        layout.gap = 30;
        layout.verticalAlign = egret.VerticalAlign.MIDDLE;
        layout.horizontalAlign = egret.HorizontalAlign.CENTER;
        group.layout = layout;

        var info:eui.Label = new eui.Label();
        info.text = "radio button";
        info.textColor = 0x030303;
        info.size = 24;
        this._info = info;
        group.addChild(this._info);
        
        var radioGroup:eui.RadioButtonGroup = new eui.RadioButtonGroup();
        
        var radio1:eui.RadioButton = new eui.RadioButton();
        radio1.label = "option A";
        
        radio1.group = radioGroup;
        radio1.value = "A";
        radio1.addEventListener(egret.Event.CHANGE,this.onChange,this);
        group.addChild(radio1);

        var radio2:eui.RadioButton = new eui.RadioButton();
        radio2.label = "option B";
        radio2.group = radioGroup;
        radio2.value = "B";
        radio2.addEventListener(egret.Event.CHANGE,this.onChange,this);
        group.addChild(radio2);

        var radio3:eui.RadioButton = new eui.RadioButton();
        radio3.label = "option C";
        radio3.group = radioGroup;
        radio3.value = "C";
        radio3.addEventListener(egret.Event.CHANGE,this.onChange,this);
        group.addChild(radio3);

        var radio4:eui.RadioButton = new eui.RadioButton();
        radio4.label = "option D";
        radio4.value = "D";        
        radio4.groupName = "Group2";
        radio4.addEventListener(egret.Event.CHANGE,this.onChange,this);
        group.addChild(radio4);

        var radio5:eui.RadioButton = new eui.RadioButton();
        radio5.label = "option E";
        radio5.value = "E";
        radio5.groupName = "Group2";
        radio5.addEventListener(egret.Event.CHANGE,this.onChange,this);
        group.addChild(radio5);        
    }

    // 터치된 RadioButton의 value 값을 text로 보여줌
    private onChange(e:egret.Event){
        var label:eui.Label = this._info;
        var radioButton = <eui.RadioButton>e.target;

        label.text = "selected " + radioButton.value;
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
