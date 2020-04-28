
var level2Layer = cc.Layer.extend({
    sprite: null,
    ctor: function () {
        this._super();
        this.size = cc.winSize;
        var background = new cc.Sprite(res.gameground);
        background.attr({
            x: this.size.width / 2,
            y: this.size.height / 2
        });
        this.addChild(background);

        //返回按钮
        var returnButton = new cc.MenuItemImage(
            res.return1,
            res.return2,
            function () {
                cc.director.runScene(new slevelScene());

            }, this);
        returnButton.attr({
            x: this.size.width - 3 - returnButton.width,
            y: this.size.height-3-returnButton.height
        });
        var menu1 = new cc.Menu(returnButton);
        menu1.x = 0;
        menu1.y = 0;
        this.addChild(menu1);


        var minbox = new cc.Sprite(res.box);
        minbox.x = 3 + minbox.width / 4;
        minbox.y = this.size.height - 3 - minbox.height / 4;
        minbox.scale = 0.5;
        this.addChild(minbox);

        var simple1 = new cc.Sprite(res.level_2);
        simple1.attr({
            x: 3 + minbox.width / 4,
            y: this.size.height - 3 - minbox.height / 4,
            scale: 0.5
        })
        this.addChild(simple1);

        var maxbox = new cc.Sprite(res.box);
        maxbox.x = this.size.width / 2;
        maxbox.y = 10 + maxbox.height / 2;
        maxbox.opacity = 180;//透明度
        this.addChild(maxbox);

        //cc.Sprite()  //可传两个参数路径，区域 切图
        // var test=new cc.Sprite(res.level_1,cc.rect(0,0,simple1.width/3,simple1.height/3));
        // test.x=maxbox.width/2;
        // test.y=maxbox.height/2;
        // this.addChild(test);

        //切图
        var cell_width = simple1.width / 4;
        var cell_heigth = simple1.height / 4;
        this.gap = (maxbox.width - simple1.width) / 5;//缝隙
        var basepos = {
            x: this.gap + cell_width / 2,
            y: maxbox.height - this.gap - cell_heigth / 2
        };

        this.arr = [];
        this.id=1;
        for (var i = 0; i < 4; i++) {
            this.arr[i] = [];
            for (var j = 0; j < 4; j++,this.id++) {
               var cell = new Cell(res.level_2, cc.rect((j * cell_width), (i * cell_heigth), cell_width, cell_heigth),this.id,[i,j]);
                cell.x = basepos.x + j * (cell_width + this.gap);
                cell.y = basepos.y - i * (cell_heigth + this.gap);
                maxbox.addChild(cell);
                this.arr[i][j]=cell;
                //var cell=new Cell(res.level_1,cc.rect((j*cell_width),(i*cell_heigth),cell_width,cell_heigth));
                //cell.x=basepos.x+j*(cell_width+this.gap);
                // cell.y=basepos.y-i*(cell_heigth+this.gap);
                if (i === 3 && j === 3) {
                    this.arr[i][j].isBlack = true;
                }
                else {
                    this.arr[i][j].isBlack = false;
                }
            }
        }
        //黑色方块的下表
        this.blackIndex=[4-1,4-1];
        this.changeOpacity();
        this.init();
    },
    changeOpacity:function () {
        this.arr[3][3].opacity=0;
    },
    //初始化
    init:function () {
        //打乱
        this.disrupt();
        //黑块回到初始位置
        this.goHome();
    },
    //黑块回到初始位置
    goHome:function () {
        while(this.blackIndex[0]!=4-1){
            this.exchangCell(this.blackIndex,[this.blackIndex[0]+1,this.blackIndex[1]]);
            this.blackIndex = [this.blackIndex[0] + 1,this.blackIndex[1]];
        }
        while(this.blackIndex[1]!=4-1){
            this.exchangCell(this.blackIndex,[this.blackIndex[0],this.blackIndex[1]+1]);
            this.blackIndex = [this.blackIndex[0],this.blackIndex[1]+1];
        }
    },
    //打乱
    disrupt:function () {
        var dir=[[0,-1],[-1,0],[0,1],[1,0]];
        var count=0;//记录黑块走了多少步
        while(count<100){
            var ran=(Math.random()*4)|0;
            //用于交换的方块下标
            var index=[this.blackIndex[0]+dir[ran][0],this.blackIndex[1]+dir[ran][1]];

            if(this.cross(index)){
                this.exchangCell(this.blackIndex,index);
                this.blackIndex=index;
                count++;
            }

        }
    },

    //判断是否越界
    cross:function (index) {
        return index[0] <= 4 - 1 && index[0] >= 0 && index[1] <= 4 - 1 && index[1] >= 0;
    },

    //交换两个碎片
    exchangCell:function (index1,index2) {
        //index的属性也要交换
        var temp=this.arr[index1[0]][index1[1]].Index;
        this.arr[index1[0]][index1[1]].Index=this.arr[index2[0]][index2[1]].Index;
        this.arr[index2[0]][index2[1]].Index=temp;

        //显示层面的交换
        var pos=this.arr[index1[0]][index1[1]].getPosition();
        this.arr[index1[0]][index1[1]].setPosition(this.arr[index2[0]][index2[1]].getPosition());
        this.arr[index2[0]][index2[1]].setPosition(pos);

        //数组上的交换
        var obj= this.arr[index1[0]][index1[1]];
        this.arr[index1[0]][index1[1]]=this.arr[index2[0]][index2[1]];
        this.arr[index2[0]][index2[1]]=obj;



    },

    onClick:function (cell_index) {
        // 寻找方块的下标
        var dir=[[0,-1],[-1,0],[0,1],[1,0]];
        for(var i=0;i<4;i++){
        var temp=[this.blackIndex[0]+dir[i][0],this.blackIndex[1]+dir[i][1]];
        //判断是否与黑块相邻
       if((temp[0]===cell_index[0])&&(temp[1]===cell_index[1]))
            {

                this.exchangCell(cell_index, this.blackIndex);
                this.blackIndex = temp;
                //判断是否游戏胜利
                this.gameWin();
            }
        }
    },

    gameWin:function() {
        var count=1;
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                cc.log(this.arr[i][j].id);
                if(count==this.arr[i][j].id){
                    count++;
                }
            }
        }
        if(count===17){
            cc.log('恭喜通关！');
            //通关动画
            this.winAnimation();
        }
    },

    winAnimation:function () {
        var helloLabel = new cc.LabelTTF("you win", "Impact", 95);
        // position the label on the center of the screen
        helloLabel.x = this.size.width / 2;
        helloLabel.y = this.size.height/2;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);
        helloLabel.runAction(
            cc.sequence(
                cc.fadeIn(1),
                cc.tintTo(2,255,125,0)
            )
        );
    },
});

var level2Scene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new level2Layer();
        this.addChild(layer);
    }
})