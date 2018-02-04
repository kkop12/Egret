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

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {
                console.log('hello,world')
            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }


        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;

    private kb:KeyBoard;
    private keyState:boolean;
    
    private maps;

    private index:number = 4;

    private testNum:number;
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {        
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;

        this.maps = new Array(4);

        this.maps[0] = new Array<Map>(4);
        this.maps[1] = new Array<Map>(4);
        this.maps[2] = new Array<Map>(4);
        this.maps[3] = new Array<Map>(4);

        //console.log(typeof(this.maps));
        
        // 랜덤하게 2나 4 맵 생성
        //this.addRandomMap();
        //this.addRandomMap();
        // console.log("col:"+ Math.floor(this.testNum/4));
        // console.log("row:"+ this.testNum%4);
        // console.log(this.maps[Math.floor(this.testNum/4)][this.testNum%4].getValue());
        
        // 맵 채우기 test
        // for(let i = 0; i < this.index; i++)
        // {
        //     for(let j = 0; j < this.index; j++)
        //     {
        //         this.maps[i][j] = new Map(2);
        //         console.log("x :" + j + " y :" + i + " " + this.maps[i][j].getValue());
        //     }
        // }
        
        this.drawMap();

        this.keyState = true;        
        
        this.kb = new KeyBoard();
        this.kb.addEventListener(KeyBoard.onkeydown,this.onkeydown,this);
        //this.kb.addEventListener(KeyBoard.onkeyup,this.onkeyup,this);        

    }
    
    private onkeydown(event)
    {        
        if(this.keyState)
        {            
            if(this.kb.isContain(event.data,KeyBoard.O))
            {
                this.keyState = false;
                console.log(event.data);
            }

            if(this.kb.isContain(event.data,KeyBoard.A))
            {
                this.keyState = false;
                console.log(event.data);
            }
        }                
    }

    private addRandomMap(): void
    {
        let num,col,row:number;
        
        do
        {
            num = Math.floor(Math.random() * 15);
            console.log("num :" + num);
            this.testNum = num;
            col = Math.floor(num / 4);
            row = num % 4;

            console.log("col :" + col);
            console.log("row :" + row);

        }while(this.maps[col][row] != null)

        let temp = Math.random() < 0.5 ? 2 : 4;
        this.maps[col][row] = new Map(temp);
    }
    
    // Map 2차월 배열로 기본 값이나, 합쳐질 값 등을 다룬 다음에, 마지막에 TextField로 그려주는걸로 생각중    
    private drawMap()
    {        
        for(let col = 0; col < 4; col++)
        {
            for(let row = 0; row < 4; row++)
            {
                if(this.maps[col][row] == null)
                    continue;

                let colorLabel = new egret.TextField();
                colorLabel.textColor = 0xffffff;        
                colorLabel.textAlign = "center";
                colorLabel.verticalAlign = "middle";        
                colorLabel.text = this.maps[col][row].getValue().toString();
                colorLabel.size = 24;
                colorLabel.x = row * 100 + 10;
                colorLabel.y = col * 100 + 10;
                colorLabel.width = 100;
                colorLabel.height = 100;
                colorLabel.border = true;
                colorLabel.borderColor = 0xffffff;        
                colorLabel.background = true;
                colorLabel.backgroundColor = 0x000000;
                this.addChild(colorLabel);
            }
        }        
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
}

class Map
{
    private value:number;

    public constructor(num:number) 
    {
        this.value = num;
    }   

    getValue(): number
    {
        return this.value;
    }
}
