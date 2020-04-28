var pingtuLayer=cc.Layer.extend({
    ctor:function () {
        this._super();
        var size=cc.winSize;
        var backGround= new cc.Sprite(res.gameBackgroun_png);

        this.leve_num=cc.vv.config[cc.vv.level];

        //添加位置
        backGround.attr({
            x:size.width/2,
            y:size.height/2
            }
        );

        this.addChild(backGround);

        //小盒子
        var minbox=new cc.Sprite(res.box_png);

        minbox.scale=0.5;//先缩小再定位

        minbox.x=3+minbox.width/4;
        minbox.y=size.height-3-minbox.height/4;

        this.addChild(minbox);

        var simple=new cc.Sprite(this.leve_num.pic);
        simple.scale=0.5;

        simple.x=minbox.x;
        //锚点坐标f赋值
        simple.y=minbox.y;
        this.addChild(simple);


        //游戏区
        var maxbox=new cc.Sprite(res.box_png);
        maxbox.x=size.width/2;
        maxbox.y=10+maxbox.height/2;

        //透明度
        maxbox.opacity=155;//满值为255
        this.addChild(maxbox);

        //返回按钮
        var returnButton = new cc.MenuItemImage(
            res.return1,
            res.return2,
            function () {
                cc.director.runScene(new levelScene())
            },this);

        returnButton.attr({
            x:size.width - returnButton.width/2-3,
            y:size.height-returnButton.height / 2 -3
        });

        var Menu1 = new cc.Menu(returnButton);
        Menu1.attr({
            x:0,
            y:0
        });
        this.addChild(Menu1);

        //刷新按钮
        var returnButton1 = new cc.MenuItemImage(
            res.return1,
            res.return2,
            function () {
                cc.director.runScene(new pingtuScene())
            },this);

        returnButton1.attr({
            x:size.width - returnButton1.width/2-3,
            y:returnButton1.height / 2 +3
        });

        var Menu2 = new cc.Menu(returnButton1);
        Menu2.attr({
            x:0,
            y:0
        });
        this.addChild(Menu2);



        //重点来了
        //*************//
        //cc.Sprite(路径，区域)切图以左上角为坐标
        // var test =new cc.Sprite(res.level_png,cc.rect(0,0,500,500));
        // test.x=maxbox.width/2;
        // test.y=maxbox.height/2;
        //
        // maxbox.addChild(test);

        //小碎片宽高
        var cell_wid=simple.width/this.leve_num.wid;
        var cell_heg=simple.height/this.leve_num.hei;
        this.gap=(maxbox.width-simple.width)/(this.leve_num.wid+1);

        //位置
        var base_pos={
            x:this.gap+cell_wid/2,
            y:maxbox.height-this.gap-cell_heg/2
        };


        this.point_arr=[];


        //坐标位置数组
        this.cellList=[];
        //切割图片的高
        // this.Point_width=cell_wid/2;


        //切图
        for(var i=0;i<this.leve_num.hei;i++)
        {
            this.cellList[i]=[];
            // this.point_arr[i]=[];
            for(var j=0;j<this.leve_num.wid;j++)
            {
                var cell=new cell1(this.leve_num.pic,cc.rect(j*cell_wid,i*cell_heg,cell_wid,cell_heg),[i,j]);

                //确定切割图片的位置
                cell.x=base_pos.x+j*(cell_wid+this.gap);

                cell.y=base_pos.y-i*(cell_heg+this.gap);
                //添加到图层上
                maxbox.addChild(cell);
                this.cellList[i][j]=cell;

                if(i ===this.leve_num.hei-1 &&j ===this.leve_num.wid-1)
                {
                    this.cellList[i][j].isblack=true;
                }
                else
                {
                    this.cellList[i][j].isblack=false;
                }
                // cc.log(cell.getPosition());
                // this.point_arr[i][j]=cell.getPosition();
            }
        }
        // cc.log(this.point_arr);



        //保存黑块的下标
        this.blackCell= [this.leve_num.hei-1,this.leve_num.wid-1];

        this.changeOpcity();

        this.init();






    },

    //右下角方块的透明度
    changeOpcity:function () {
        this.cellList[this.leve_num.hei-1][this.leve_num.wid-1].opacity=0;
    },

    //初始化
    init:function () {
        //打乱
        this.disrupt();
        this.gohome();
    },

    //黑块归位
    gohome:function () {
        while(this.blackCell[0] != this.leve_num.hei-1)
        {
            this.exchangeCell(this.blackCell,[this.blackCell[0] + 1,this.blackCell[1]]);
            this.blackCell = [this.blackCell[0] + 1,this.blackCell[1]];
        }
        while(this.blackCell[1] != this.leve_num.wid-1)
        {
            this.exchangeCell(this.blackCell,[this.blackCell[0] ,this.blackCell[1]+ 1]);
            this.blackCell = [this.blackCell[0] ,this.blackCell[1]+ 1];
        }

    },
    //打乱
    disrupt:function () {
        //黑块的四个方向
        var dir=[[0,-1],[-1,0],[0,1],[1,0]];
        var count=0;
        while(count<100)
        {
            var ran=(Math.random()*4)|0;//取整

            var index=[this.blackCell[0]+dir[ran][0],this.blackCell[1]+dir[ran][1]];
            //越界判断
            if(this.crows(index))
            {
                this.exchangeCell(this.blackCell,index);
                this.blackCell=index;
                count++;

            }
            //this.exchangeCell(this.blackCell,[this.blacklist[0]+dir[ran][0],this.blacklist[1]+dir[ran][1]]);

        }
    },
    //越界判断
    crows:function (index) {

        return index[0]<=this.leve_num.hei-1&& index[0] >= 0 && index[1]<=this.leve_num.wid-1&&index[1]>=0;
    },

    //交换两个片段
    exchangeCell:function(index1,index2) {
       //显示层面的交换
        var pos=this.cellList[index1[0]][index1[1]].getPosition();
        //存入数据
        this.cellList[index1[0]][index1[1]].setPosition(this.cellList[index2[0]][index2[1]]);
        this.cellList[index2[0]][index2[1]].setPosition(pos);

        //数组上的交换
        var obj= this.cellList[index1[0]][index1[1]];
        this.cellList[index1[0]][index1[1]]=this.cellList[index2[0]][index2[1]];
        this.cellList[index2[0]][index2[1]]=obj;

    },
    //定义一个函数
    onClick:function (cell) {
        var cellPos=this.getIndexByCell(cell);

        //点击的方块是否与褐色方块相邻
        if(this.isNeighbor(cellPos))
        {
            this.exchangeCell(cellPos,this.blackCell);
            this.blackCell=cellPos;
            this.isWin();
        }
    },
    //判断是否相邻
    isNeighbor:function (index) {
       return  (1 === Math.abs(index[0]-this.blackCell[0])+Math.abs(index[1]-this.blackCell[1]));
    },


    //寻找传入方块的下标
    getIndexByCell:function () {
        for(var i=0;i<this.cellList.length;i++)
        {
            for(var j=0;j<this.cellList[i].length;j++)
            {
                if(this.cellList[i][j]===cell1)
                {
                    return[i,j];
                }
            }
        }
    },

    isWin:function () {
        for(var i=0;i<this.cellList.length;i++)
        {
            for(var j=0;j<this.cellList[i].length;j++)
            {
                if(!(this.cellList[i][j].Index[0] == i&&this.cellList[i][j].Index[1]==j))
                {
                    return;
                }
            }
        }
        this.gameOver();
        return true;
    },

    gameOver:function () {
        cc.log("胜利");
    }


});

var pingtuScene=cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer=new pingtuLayer();
        this.addChild(layer)
    }
});