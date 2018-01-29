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
    
    private _goodsUI:GoodsUI;

    private _txInfo:egret.TextField;
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        this._goodsUI = new GoodsUI();
        this._goodsUI.horizontalCenter = 0;

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
        this._txInfo.text =
            "This is an example of a typical list of objects in a game";
        this._txInfo.width = this.stage.stageWidth;
        this._txInfo.wordWrap = true;

        this.addChild( this._goodsUI );
        console.log( "Main.ts this._homeUI:", this._goodsUI.width, this._goodsUI.height );
    }
    
    // loadPage( pageName:string ):void{
    //     this.addChild( this._trueLoadingUI );
    //     console.log("pageName : " + pageName);
    //     this.idLoading = pageName;
    //     switch ( pageName ){
    //         case "goods":
    //             RES.loadGroup( "heros_goods" );
    //             break;
    //         default :
    //             RES.loadGroup( pageName );
    //             break;
    //     }
    // }
 
    private idLoading:string;
    
    private _trueLoadingUI:LoadingUI;
    
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

class GoodsUI extends eui.Component {

    constructor() {
        super();
        this.addEventListener( eui.UIEvent.COMPLETE, this.uiCompHandler, this );
        this.skinName = "resource/custom_skins/goodsUISkin.exml";
    }

    // 데이터 아이템들의 속성들을 정의한 배열
    private uiCompHandler():void {
        console.log( "\t\tGoodsUI uiCompHandler" );

        var dsListHeros:Array<Object> = [
            { icon: "goods01_png", goodsName: "item1", comment: "attribute1 +3" }
            , { icon: "goods02_png", goodsName: "item2", comment: "attribute2 +3" }
            , { icon: "goods03_png", goodsName: "item3", comment: "attribute3 +3" }
            , { icon: "goods04_png", goodsName: "item4", comment: "attribute4 +3" }
            , { icon: "goods05_png", goodsName: "item5", comment: "attribute5 +3" }
            , { icon: "goods06_png", goodsName: "item6", comment: "attribute6 +3" }
            , { icon: "goods07_png", goodsName: "item7", comment: "attribute7 +5" }
        ];
        this.listGoods.dataProvider = new eui.ArrayCollection( dsListHeros );        
        this.listGoods.itemRenderer = GoodsListIRSkin;
    }

    protected createChildren():void {
        super.createChildren();

    }

   public listGoods: eui.List;
}

// DataGroup에 들어가있는 데이터들을 이 스킨으로 인터페이스를 구현
class GoodsListIRSkin extends eui.ItemRenderer {

    private cb:eui.CheckBox;

    constructor() {
        super();
        this.skinName = "resource/custom_skins/goodsListIRSkin.exml";
    }

    protected createChildren():void {
        super.createChildren();
    }

    protected dataChanged():void {
    }

}