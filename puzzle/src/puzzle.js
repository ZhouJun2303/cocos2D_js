/*
* @ author:J Zhou
* @ describe ：拼图主界面
* @ date：2019年5月20日15:39:54
* */
var puzzleLayer=cc.Layer.extend({

    cell_list:[],
    data_list:[],
    clone_date_list:[],
    Dir:[-3,+3,-1,+1],
    ctor:function () {
        this._super();
        var size = cc.winSize;
        this.step=cc.vv.ROW*cc.vv.LINE*5;
        this.path=[];



        //添加有色层
        var colorBg = new cc.LayerGradient(cc.color(123,23,34), cc.color(32,234,34),cc.p(0,1));
        this.addChild(colorBg);
        //添加游戏背景
        var gameBg = new cc.Sprite(res.gameBackgroun_png);
        gameBg.attr({
            x:size.width / 2,
            y:size.height / 2
        });
        this.addChild(gameBg);
        //计算碎图尺寸
        var spr = new cc.Sprite(res.level1_png);
        cc.vv.wid = spr.width / cc.vv.LINE;
        cc.vv.hei = spr.height / cc.vv.ROW;
        //计算拼图区域大小
        var area = cc.size(
            spr.width + (cc.vv.LINE - 1) * cc.vv.GAP,
            spr.height + (cc.vv.ROW - 1) * cc.vv.GAP
        );
        var boxPng = new cc.Sprite(res.box_png);
        boxPng.scaleX = area.width / boxPng.width;
        boxPng.scaleY = area.height / boxPng.height;
        boxPng.setPosition(size.width / 2,size.height / 2);
        this.addChild(boxPng);
        //计算基准点的坐标
        this.basePoint = cc.p(
            (size.width - area.width + cc.vv.wid) / 2,
            (size.height + area.height - cc.vv.hei) / 2
        );

        //碎片的裁剪
        for(var i = 0; i < cc.vv.TOT; i++){
            this.data_list[i] = i;
            this.clone_date_list[i]=i;
        }

        //this.data_list = [5,6,7,8,0,1,2,3,4]
        for(var i = 0; i < this.data_list.length; i++){
            var row1 = parseInt(this.data_list[i] / cc.vv.LINE);
            var line1 = parseInt(this.data_list[i] % cc.vv.LINE);
            var row2 = parseInt(i / cc.vv.LINE);
            var line2 = parseInt(i % cc.vv.LINE);
            var rect = cc.rect(
                0 + cc.vv.wid * line1,
                0 + cc.vv.hei * row1,
                cc.vv.wid,
                cc.vv.hei);
            var cell = new Cell(res['level' + cc.vv.level+"_png"],rect);
            var pos = cc.p(
                this.basePoint.x + line2 * (cc.vv.wid + cc.vv.GAP),
                this.basePoint.y - row2 * (cc.vv.hei + cc.vv.GAP)
            );
            if(this.data_list[i]===this.data_list.length-1){
                cell.visible=false;
            }
            cell.setPosition(pos);
            cc.log(pos);
            this.cell_list.push(cell);

            this.addChild(cell);

        }
        this.blackIndex=cc.vv.TOT-1;
        this.cell_list[this.blackIndex].color=cc.color.RED;


        //ssetTimeout(this.disturb.bind(this),1000);


        //API Button 按钮的使用
        var button = new ccui.Button();
        button.setTouchEnabled(true);
        button.setPressedActionEnabled(true);
        button.loadTextures(res.return1, res.return2, "");//悬停效果
        button.setTitleText("还原",35);
        button.x = size.width / 5;
        button.y = size.height / 8;
        button.addTouchEventListener(this.onButton ,this);
        this.addChild(button);

        // return true;
    },
    //按钮
    onButton:function (sender,type) {
        switch (type) {
                //按下
            case ccui.Widget.TOUCH_ENDED:
                cc.log(this.data_list,this.clone_date_list);
                if((this.data_list.join(""))===(this.clone_date_list.join(""))){
                    //this.button.setTitleText("打乱");
                    this.disturb();


                    cc.log("打乱");
                    break;
                }
                else{
                    //this.button.setTitleText("还原");
                    this.autoMove(this.backPath);
                    //this.clone_date_list=this.data_list;
                    //cc.log(this.clone_date_list,this.data_list);
                    cc.log("还原");
                    this.clone_date_list=cloneArr(this.data_list);
                }

        }
    },


    //打乱
    disturb:function () {
        //模拟交换
        this.step=50;
        while (this.step){
            var dir=Math.random()*4|0;
            //cc.log(dir);

            if(this.checkIndex(this.Dir[dir])){
                var direction=this.blackIndex+this.Dir[dir];
                this.path.push(this.Dir[dir]);
                //cc.log(this.path);

                var temp=this.clone_date_list[direction];
                this.clone_date_list[direction]=this.clone_date_list[this.blackIndex];
                this.clone_date_list[this.blackIndex]=temp;

                this.blackIndex=direction;
                this.step-=1;
            }

        }

        //黑块还原到角落
        if(this.blackIndex!==cc.vv.TOT-1){
            this.blackGoHome();
        }
        this.blackIndex=cc.vv.TOT-1;

        //判断黑块还原之后整个拼图是否还原
        // if(this.checkIsRecover()){
        //     this.disturb();
        // }
        this.autoMove(this.path);


        //上面是模拟交换，改变了blackIndex的下标



    },

    //判断是否还原
    checkIsRecover:function () {
      return  this.data_list.join("")===this.clone_date_list.join("");
    },

    //黑块回家
    blackGoHome:function () {
        while(parseInt(this.blackIndex/cc.vv.LINE)<cc.vv.LINE-1){
            var direction1=this.blackIndex+this.Dir[1];
            this.path.push(this.Dir[1]);


            var temp1=this.clone_date_list[direction1];
            this.clone_date_list[direction1]=this.clone_date_list[this.blackIndex];
            this.clone_date_list[this.blackIndex]=temp1;

            this.blackIndex=direction1;
        }

        while(parseInt(this.blackIndex%cc.vv.ROW)<cc.vv.ROW-1){
            var direction=this.blackIndex+this.Dir[3];
            this.path.push(this.Dir[3]);


            var temp=this.clone_date_list[direction];
            this.clone_date_list[direction]=this.clone_date_list[this.blackIndex];
            this.clone_date_list[this.blackIndex]=temp;

            this.blackIndex=direction;
        }
    },

    //自动移动
    autoMove:function (attr) {
            var dir=attr.shift();
            var target=this.blackIndex+dir;
            // cc.log(target);
            this.exchange(target,attr);

    },

    //判断是否越界
    checkIndex:function (index) {
        var row=parseInt(this.blackIndex/cc.vv.LINE);
        var line=parseInt(this.blackIndex%cc.vv.LINE);
        if(Math.abs(index)===1){
            return line+index>=0&& line +index<cc.vv.LINE;
        }
        else{
            return row+index/cc.vv.LINE>=0&&row +index /cc.vv.LINE<cc.vv.ROW;
        }
    },

    //交换
    exchange:function (target,attr) {

        var temp=this.cell_list[this.blackIndex];
        this.cell_list[this.blackIndex]=this.cell_list[target];
        this.cell_list[target]=temp;

        var a=this.cell_list[this.blackIndex].getPosition();
        var b=this.cell_list[target].getPosition();

        var callback=cc.callFunc(function () {
            //交换数据
            this.blackIndex=target;
            if(attr.length>0){
                this.autoMove(attr);
            }
            else{
                if(this.clone_date_list.join("")!==this.data_list.join("")){
                    console.log("打乱完成");
                    var s=new STATE(this.data_list,this.clone_date_list,{},this.blackIndex,null,0);
                    //var s1=new DSTATE(this.clone_date_list,this.data_list,{},cc.vv.TOT-1,null,0);

                    this.backPath=[];
                    //this.backPath=Controller(s,s1);
                    this.backPath=Controller(s);
                    console.log(this.backPath);
                    cc.log(this.clone_date_list,this.data_list);
                    //this.autoMove(this.backPath);
                }
            }
        }.bind(this));
        this.cell_list[this.blackIndex].runAction(cc.moveTo(0.1,b));
        this.cell_list[target].runAction(cc.sequence(cc.moveTo(0.15,a),callback));

    }
});

var puzzleScene=cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer=new puzzleLayer();
        this.addChild(layer);
    }

});

