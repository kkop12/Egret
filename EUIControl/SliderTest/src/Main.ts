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

    ///Horizontal sliding selector
    private _hSlider:eui.HSlider;
    ///vertical sliding selector
    private _vSlider:eui.VSlider;
    ///display info
    private _info:eui.Label;
    ///the value of horizontal sliding selector
    private _hLabel:eui.Label;

    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {        
           var hSlilder:eui.HSlider = new eui.HSlider();
           hSlilder.width = 280;
           hSlilder.maximum = 100;
           hSlilder.horizontalCenter = 0;
           hSlilder.verticalCenter = 0;
           
           hSlilder.addEventListener(egret.Event.CHANGE,this.onHSliderChange,this);

           this._hSlider = hSlilder;
           this.addChild(this._hSlider);
           
           var vSlider:eui.VSlider = new eui.VSlider();
           vSlider.height = 200;
           vSlider.verticalCenter = 0;
           vSlider.horizontalCenter = 240;		   
           vSlider.minimum = 100;		   
           vSlider.maximum = 1000;		   
           vSlider.snapInterval = 100;
           
           vSlider.addEventListener(egret.Event.CHANGE,this.onVSLiderChange,this);

           this._vSlider = vSlider;
           this.addChild(this._vSlider);

           var hLabel:eui.Label = new eui.Label();
           
           hLabel.textColor = 0x1122cc;
           hLabel.size = 18;
           hLabel.verticalCenter = 30; 
           hLabel.horizontalCenter = 0;           
           hLabel.text = "Value:" + hSlilder.pendingValue;
           this._hLabel = hLabel;
           this.addChild(this._hLabel);
           
           var vLabel:eui.Label = new eui.Label();
           vLabel.textColor = 0x1122cc;
           vLabel.size = 18;
           vLabel.horizontalCenter = 240;
           vLabel.verticalCenter = -120;
           vLabel.text = "Max:1000"; 
           this.addChild(vLabel);
           
           var info:eui.Label = new eui.Label();
           info.size = 19;
           info.textColor = 0x000000;
           info.text = "Slide the vertical slider to set the maximum value of the horizontal slider."
           info.verticalCenter = 100;
           info.horizontalCenter = 0;
           this._info = info
           this.addChild(this._info);
    }

    // hSlider 의 Value값을 text로 보여줌
    private onHSliderChange(e:egret.Event) {
        var slilder = <eui.HSlider>e.target;
        var hSlider = this._hSlider;
        var hLabel = this._hLabel;
        
        hLabel.text = "Value:" + hSlider.pendingValue;
    }

    // vSlider의 pendinValue값에 의해 hSlider maximum값과 value의 값이 비례해서 올라가거나 내려감
    private onVSLiderChange(e:egret.Event) {
        var slilder = <eui.VSlider>e.target;
        var hSlider = this._hSlider;
        var info = this._info;
        var scale = slilder.pendingValue / hSlider.maximum;
        hSlider.maximum = slilder.pendingValue;
        hSlider.value *= scale;
        info.text = "Set the maximum value of the horizontal slider to" + slilder.pendingValue;

        var hLabel = this._hLabel;
        hLabel.text = "Value:" + hSlider.value.toFixed(0);
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
