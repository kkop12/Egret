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

    private prevPoint:egret.Point;
    private moved:boolean = false;
    
    private mouseType = Object.freeze({UP:0,DOWN:1,RIGHT:2,LEFT:3});
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {        
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;

        this.prevPoint = new egret.Point();

        this.maps = new Array(4);

        this.maps[0] = new Array<Map>(4);
        this.maps[1] = new Array<Map>(4);
        this.maps[2] = new Array<Map>(4);
        this.maps[3] = new Array<Map>(4);

        //console.log(typeof(this.maps));
        
        // 랜덤하게 2나 4 맵 생성
        this.addRandomMap();
        this.addRandomMap();
        this.addRandomMap();

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
        
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler,this);

        // this.keyState = true;        
        
        // this.kb = new KeyBoard();
        // this.kb.addEventListener(KeyBoard.onkeydown,this.onkeydown,this);
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

    private move(type:number,maxCount: number, nextD: number): void
    {
        // 위 0,0 -> 3,0 , 아래 3,0 -> 0,0  
        // 왼쪽 0,0 -> 0,3, 오른쪽 0,3 -> 0,0
        let currX, currY, nextX, nextY;
        //currY = maxCount;

        switch(type)
        {
            case this.mouseType.UP:
            case this.mouseType.DOWN:
            // 위 , 아래
            for(let i = 0; i < this.index ; i++)
            {   
                // nextY = maxCount - nextD; // 현재 위치보다 다음 값( 위 or 아래 )
                // currY = maxCount; // 현재 위치

                nextY = maxCount;
                currY = maxCount + nextD;
                        
                // maps[maxCount][i]
                while(currY >= 0 && currY < this.index)
                {
                    var next:Map = this.maps[nextY][i];
                    var curr:Map = this.maps[currY][i];

                    console.log("currentY : " + currY + " currentX : " + i);

                    if(next == null)
                    {
                        this.maps[nextY][i] = curr;
                        this.maps[currY][i] = null;
                        //nextY = currY;
                        console.log("currY : " + currY + " nextY : " + nextY + " ok");                    
                        currY += nextD;                                         
                        nextY = maxCount;
                    }
                    else if(currY == nextY + nextD && curr != null && next.canMerge(curr))
                    {
                        console.log("merge");
                        next.doMerge();
                        this.maps[currY][i] = null;
                        currY += nextD;
                        nextY = maxCount;
                    }
                    else
                    {
                        nextY += nextD;

                        if(currY == nextY)
                        {
                            currY += nextD;
                            nextY = maxCount;
                        }                    
                    }

                    //nextY = maxCount;   
                }
            }

            break;
            case this.mouseType.RIGHT:
            case this.mouseType.LEFT:

            for(let i = 0; i < this.index ; i++)
            {   
                
                nextX = maxCount;
                currX = maxCount + nextD;
                
                while(currX >= 0 && currX < this.index)
                {
                    var next:Map = this.maps[i][nextX];
                    var curr:Map = this.maps[i][currX];

                    console.log("currentX : " + currX + " currentY : " + i);

                    if(next == null)
                    {
                        this.maps[i][nextX] = curr;
                        this.maps[i][currX] = null;
                        
                        console.log("currY : " + currX + " nextY : " + nextX + " ok");                    
                        currX += nextD;                                         
                        nextX = maxCount;
                    }
                    else if(currX == nextX + nextD && curr != null && next.canMerge(curr))
                    {
                        console.log("merge");
                        next.doMerge();
                        this.maps[i][currX] = null;
                        currX += nextD;
                        nextX = maxCount;
                    }
                    else
                    {
                        nextX += nextD;

                        if(currX == nextX)
                        {
                            currX += nextD;
                            nextX = maxCount;
                        }                    
                    }                    
                }
            }

            break;
        }

        this.addRandomMap();
        this.drawMap();
    }

    // 터치후 방향에 따른 관리
    private touchHandler(evt:egret.TouchEvent)
    {        
        switch(evt.type)
        {            
            case egret.TouchEvent.TOUCH_BEGIN:
                this.prevPoint.setTo(evt.stageX,evt.stageY);
                console.log(this.prevPoint);

                this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchHandler,this);
                this.stage.once(egret.TouchEvent.TOUCH_END,this.touchHandler,this);
            break;
            case egret.TouchEvent.TOUCH_MOVE:
                let currentX = evt.stageX - this.prevPoint.x;
                let currentY = evt.stageY - this.prevPoint.y;
                
                if(!this.moved)
                {
                    if(currentX < -50){console.log("왼쪽"); this.moved = true; this.move(this.mouseType.LEFT,0,1); }  // 왼쪽              
                    else if(currentX > 50){ console.log("오른쪽"); this.moved = true; this.move(this.mouseType.RIGHT,3,-1); } // 오른쪽
                    else if(currentY < -50){ console.log("위쪽"); this.moved = true; this.move(this.mouseType.UP,0,1); } // 위쪽
                    else if(currentY > 50) { console.log("아래쪽"); this.moved = true; this.move(this.mouseType.DOWN,3,-1); } // 아래쪽                    
                }
                
            break;
            case egret.TouchEvent.TOUCH_END:
                this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchHandler,this);
                this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler,this);
                this.prevPoint.normalize;
                this.moved = false;
            break;
        }
    }

    // 맵 하나 랜덤 생성
    private addRandomMap(): void
    {
        let num,col,row:number;
        
        let randomCell:Array<egret.Point> = [];

        // 밑 do while으로 썼을때 1~3개 남았을때의 랜덤생성이 너무 오래 걸림
        // 없는 칸만 따로 추려서 그 사이에서만 랜덤생성이 되게 바꿈
        for(let i = 0; i < this.index ; i++)
        {
            for(let j = 0; j < this.index ; j++)
            {
                if(this.maps[i][j] == null)
                {
                    randomCell.push(new egret.Point(i,j));
                }
            }
        }

        do
        {
            // Math.random()*vcIdxLocation.length
            // num = Math.floor(Math.random() * 15);
            // console.log("num :" + num);
            // this.testNum = num;
            // col = Math.floor(num / 4);
            // row = num % 4;

            // console.log("col :" + col);
            // console.log("row :" + row);

            num = Math.floor(Math.random() * randomCell.length);
                        
            col = randomCell[num].x;
            row = randomCell[num].y;

            console.log("col :" + col);
            console.log("row :" + row);

        }while(this.maps[col][row] != null)

        let temp = Math.random() < 0.7 ? 2 : 4;
        this.maps[col][row] = new Map(temp);
    }
    
    // Map 2차월 배열로 기본 값이나, 합쳐질 값 등을 다룬 다음에, 마지막에 TextField로 그려주는걸로 생각중    
    private drawMap()
    {
        this.removeChildren();       
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

    canMerge(other:Map):boolean
    {
        return this.value == other.getValue() ? true : false;
    }

    doMerge():void
    {
        this.value *= 2;
    }
}
