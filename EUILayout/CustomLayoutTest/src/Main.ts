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
    
    private _idxCount:number;

    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(){
       
        this._grpLayout = new eui.Group();
        this._grpLayout.bottom = 100;
        this._grpLayout.horizontalCenter = 0;

        this.addChild( this._grpLayout );
        this._grpLayout.width = L.WBASE_OUTLINE;
        this._grpLayout.height = L.HBASE_OUTLINE;

        var iFillColor:number = ( Math.floor( Math.random() * 0xff ) << 16 )
            + ( Math.floor( Math.random() * 0xff ) << 8 )
            + Math.floor( Math.random() * 0xff );
        var outline:egret.Shape = new egret.Shape;
        outline.graphics.clear();
        outline.graphics.lineStyle( 3, iFillColor );        
        outline.graphics.drawRect( 0, 0, L.WBASE_OUTLINE, L.HBASE_OUTLINE );
        outline.graphics.endFill();

        var vcButton:Array<eui.Button> = new Array<eui.Button>();
        var vcCountLib:Array<number> = [ 3, 4, 6, 10, 15, 18 ];
        this._idxCount = 0;

        for ( var i:number = 1; i <= 18; ++i ) {
            var btn:eui.Button = new eui.Button();
            btn.label = "button" + ( i < 10 ? "0" : "" ) + i;
            vcButton.push( btn );
        }
        
        // CustomLayout
        var rLayout:RingLayout = new RingLayout;
        this._grpLayout.layout = rLayout;
                
        // 배치되어있는 버튼을 다 지우고 배열에 있는 수에 따라 Layout에 다시 버튼들을 넣음
        var refillGroup= ()=>{
            this._grpLayout.removeChildren();
            this._grpLayout.addChild( outline );            
            var countRdm:number = vcCountLib[ ++this._idxCount% vcCountLib.length ];
            for ( var i:number = 0; i < countRdm; ++i ) {
                this._grpLayout.addChild( vcButton[i] );
            }
        }
        
        this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP, refillGroup, this );
        
        refillGroup();

        this._txInfo = new egret.TextField;
        this.addChild( this._txInfo );

        this._txInfo.size = 28;
        this._txInfo.x = 50;
        this._txInfo.y = 50;
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
        this._txInfo.textColor = 0x000000;
        this._txInfo.type = egret.TextFieldType.DYNAMIC;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;
        this._txInfo.text =
            "Touch to adjust the number of layout elements";

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

    /**
     * 点击按钮
     * Click the button
     */
    private onButtonClick(e: egret.TouchEvent) {
        let panel = new eui.Panel();
        panel.title = "Title";
        panel.horizontalCenter = 0;
        panel.verticalCenter = 0;
        this.addChild(panel);
    }
}

class L {
    public static WBASE_OUTLINE:number = 580;
    public static HBASE_OUTLINE:number = 650;
}

class AlignMode {
    public static GAP:number = 0;
    public static WH:number = 1;
}

var UIComponentClass = "eui.UIComponent";
class RingLayout extends eui.LayoutBase{
    public constructor(){
        super();
    }
    
    public measure(){
        super.measure();
    }

    public updateDisplayList(unscaledWidth:number, unscaledHeight:number){
        super.updateDisplayList(unscaledWidth, unscaledHeight);
        if (this.target==null)
            return;
        
        console.log( unscaledWidth, unscaledHeight );
        var angleBaseRdm:number = Math.PI * 2 * Math.random();  //  시작 각도 랜덤
        
        var centerX:number = unscaledWidth/2;// 컨테이너 중심의 X좌표를 구함
        var centerY:number = unscaledHeight/2;// 컨테이너 중심의 Y좌표를 구함
        var horizon:number = centerX/2;//  수평 절반
        var vertical:number = centerY/2;//  수직 절반
        var radius = horizon > vertical ? vertical : horizon;// 더 작은 값을 반지름으로 함
        var count:number = this.target.numElements;
        var maxX:number = 0;
        var maxY:number = 0;
        
        // Layout요소가 아닌 것들을 분별하고 작업에서 제외
        var vcElemInLayout:Array<eui.UIComponent> = new Array<eui.UIComponent>();
        for (var i:number = 0; i < count; i++) {
            var layoutElement:eui.UIComponent = <eui.UIComponent> ( this.target.getElementAt( i ) );
            if ( !egret.is( layoutElement, UIComponentClass ) || !layoutElement.includeInLayout ) {                
                console.log( "非布局", i );
            }else{
                vcElemInLayout.push( layoutElement );
            }
        }

        var mark:egret.Shape = new egret.Shape;
        mark.graphics.lineStyle( 1 );
        mark.graphics.beginFill( 0x00ff00, 1 );
        mark.graphics.drawRect( -2, -2 ,20, 20 );
        mark.graphics.endFill();
        mark.x = centerX;
        mark.y = centerY;
        this.target.addChild( mark );
        
        // count 수에 따라 원의 x,y좌표를 가져와 배치
        count = vcElemInLayout.length;
        for (var i:number = 0; i < count; i++){
            var elementWidth:number = 0;
            var elementHeight:number = 0;
            var angle:number = angleBaseRdm + 2 * Math.PI * i / count;
            var childX:number = centerX + radius * Math.sin(angle) - elementWidth/2;
            var childY:number = centerY - radius * Math.cos(angle) - elementHeight/2;

            vcElemInLayout[i].anchorOffsetX = vcElemInLayout[i].width / 2;
            vcElemInLayout[i].anchorOffsetY = vcElemInLayout[i].height / 2;
            
            vcElemInLayout[i].setLayoutBoundsPosition(childX, childY);
            maxX = Math.max(maxX,childX+elementWidth);
            maxY = Math.max(maxY,childY+elementHeight);
        }
        this.target.setContentSize(maxX,maxY);
    }
}