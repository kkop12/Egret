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

    private _txInfo:egret.TextField;
    private _grpLayout:eui.Group;

    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(){
        
        this._grpLayout = new eui.Group();
        this._grpLayout.horizontalCenter = 0;
        this._grpLayout.verticalCenter = 0;
        
        this.addChild( this._grpLayout );
        this._grpLayout.width = L.WBASE;
        this._grpLayout.height = L.HBASE;
        
        var iFillColor:number = ( Math.floor( Math.random() * 0xff ) << 16 )
            + ( Math.floor( Math.random() * 0xff ) << 8 )
            + Math.floor( Math.random() * 0xff ) ;
        var outline:egret.Shape = new egret.Shape;
        outline.graphics.lineStyle( 3, iFillColor );
        outline.graphics.beginFill(0x000000,0);        
        outline.graphics.drawRect( 0,0,L.WBASE, L.HBASE );
        outline.graphics.endFill();
        this._grpLayout.addChild( outline );

        this._grpLayout.layout = new eui.BasicLayout();
        
        var btn:eui.Button = new eui.Button();
        btn.label = "Center positioned button";
        btn.horizontalCenter = 0;
        btn.verticalCenter = 0;
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this); // button이라 클릭 후 패널 뜨게 해봄
        this._grpLayout.addChild( btn );
        
        // top, left, right, bottom은 Layout에서 얼마나 떨어지는거에 관한 값
        var btn:eui.Button = new eui.Button();
        btn.label = "button fixed at upper left";
        btn.top = 20;
        btn.left = 20;
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
        this._grpLayout.addChild( btn );

        var btn:eui.Button = new eui.Button();
        btn.label = "button fixed at lower right";
        btn.right = 5;
        btn.bottom = 5;
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
        this._grpLayout.addChild( btn );
            
        this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP, ()=>{
            var w:number = L.WBASE + L.WRANGE * Math.random();
            var h:number = L.HBASE + L.HRANGE * Math.random();
            outline.graphics.clear();
            outline.graphics.lineStyle( 3, iFillColor );
            outline.graphics.beginFill(0x000000,0);
            outline.graphics.drawRect( 0,0,w, h ); 
            outline.graphics.endFill();
            this._grpLayout.width = w;
            this._grpLayout.height = h;
        }, this );
        
        this._txInfo = new egret.TextField;
        this.addChild( this._txInfo );

        this._txInfo.size = 28;
        this._txInfo.x = 0;
        this._txInfo.y = 50;
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
        this._txInfo.textColor = 0x000000;
        this._txInfo.type = egret.TextFieldType.DYNAMIC;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;
        this._txInfo.width = this.stage.stageWidth;
        this._txInfo.wordWrap = true;

        this._txInfo.text =
            "Touch the stage to randomly adjust the size of the layout container";
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

    private onButtonClick(e: egret.TouchEvent) {
        let panel = new eui.Panel();
        panel.title = "Title";
        panel.horizontalCenter = 0;
        panel.verticalCenter = 0;
        this.addChild(panel);
    }

}

class L{
    public static WBASE:number = 400;
    public static HBASE:number = 300;
    public static WRANGE:number = 120;
    public static HRANGE:number = 300;
}