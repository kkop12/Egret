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

    private _label:eui.Label;

    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        
        var group = new eui.Group();
        group.width = 150;
        group.height = this.stage.stageHeight;
        this.addChild(group);

        var layout = new eui.VerticalLayout();
        layout.gap = 45;
        layout.verticalAlign = egret.VerticalAlign.MIDDLE;
        layout.horizontalAlign = egret.HorizontalAlign.LEFT;
        group.layout = layout;

        group.horizontalCenter = 0;

        var label = new eui.Label();
        label.text = "current selected：4 5 6";
        label.textColor = 0x000000;
        label.size = 20;
        this._label = label;
        group.addChild(this._label);

        var checkBox1:eui.CheckBox = new eui.CheckBox();        
        checkBox1.label = "1.normal";
        checkBox1.addEventListener(egret.Event.CHANGE,this.onChange,this);
        group.addChild(checkBox1);

        var checkBox2:eui.CheckBox = new eui.CheckBox();
        checkBox2.label = "2.down";
        ///The view state of the display setting button is  down。
        checkBox2.currentState = "down";
        checkBox2.addEventListener(egret.Event.CHANGE,this.onChange,this);
        group.addChild(checkBox2);

        var checkBox3:eui.CheckBox = new eui.CheckBox();
        checkBox3.label = "3.disabled";
        ///The view state of the display setting button is  disabled
        checkBox3.currentState = "disabled";
        checkBox3.addEventListener(egret.Event.CHANGE,this.onChange,this);
        group.addChild(checkBox3);

        var checkBox4:eui.CheckBox = new eui.CheckBox();
        checkBox4.label = "4.upAndSelected";
        ///The view state of the display setting button is  upAndSelected
        checkBox4.currentState = "upAndSelected";
        checkBox4.addEventListener(egret.Event.CHANGE,this.onChange,this);
        group.addChild(checkBox4);

        var checkBox5:eui.CheckBox = new eui.CheckBox();
        checkBox5.label = "5.downAndSelected";
        ///The view state of the display setting button is  downAndSelected
        checkBox5.currentState = "downAndSelected";
        checkBox5.addEventListener(egret.Event.CHANGE,this.onChange,this);
        group.addChild(checkBox5);

        var checkBox6:eui.CheckBox = new eui.CheckBox();
        checkBox6.label = "6.disabledAndSelected";
        ///The view state of the display setting button is  downAndSelected
        checkBox6.currentState = "disabledAndSelected";
        checkBox6.addEventListener(egret.Event.CHANGE,this.onChange,this);
        group.addChild(checkBox6);
        
    }

    // currentState에 따라서 버튼이 클릭된 모양이 조금씩 다름
    private onChange(event:egret.TouchEvent) {        
        var checkBox:eui.CheckBox = <eui.CheckBox>event.target;

        var label = this._label;

        if (checkBox.currentState === "disabled" || checkBox.currentState === "disabledAndSelected" ) {
            label.text = "Disabled status, cannot select";
        } else {            
            label.text = "State change：" + checkBox.label;            
            checkBox.currentState = null;
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
