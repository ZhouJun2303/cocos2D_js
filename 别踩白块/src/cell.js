
var  cell1=cc.Sprite.extend({
    ctor:function (url,rect,Index) {
        this._super(url,rect);
        this.setContorl();
        this.isblack=false;
        this.Index=Index;
    },
    setContorl:function () {
        var that=this;
        var listener=cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowtouches:true,
            onTouchBegan:function (touch,event) {
                //cc.log(touch.getLocation());
                var pos=touch.getLocation();
                var rect=cc.rect(0,0,that.width,that.height);
                pos=that.convertToNodeSpace(pos);//坐标转换
                if(cc.rectContainsPoint(rect,pos))
                {
                    cc.log(pos);
                    // 调用函数（获取点击方块的下标，执行交换）
                    // 调用其他js的函数，this.parent.parent.函数（that）
                    //this.newpos=that.convertToWorldSpace(pos);
                    //cc.log(newpos);
                    // cc.log(that.parent.parent.Point_width);
                    //交换坐标
                    //var expos=that.parent.parent.point_arr[2][2];
                    // for(var i=0;i<3;i++)
                    // {
                    //     for (var j=0;j<3;j++)
                    //     {
                    //         if((Math.abs(that.parent.parent.point_arr[i][j].x-this.newpos.x)<(that.parent.parent.Point_width)) && (Math.abs(that.parent.parent.point_arr[i][j].y-this.newpos.y)<(that.parent.parent.Point_width)))
                    //         {
                    //             cc.log("************************");
                    //             // cc.log(Math.abs(that.parent.parent.point_arr[i][j].x-newpos.x));
                    //             // cc.log(that.parent.parent.point_arr[i][j]);
                    //             // cc.log(that.parent.parent.Point_width/3);
                    //
                    //             // cc.log(newpos);
                    //             this.newpos=that.parent.parent.point_arr[i][j];
                    //             //当前图块坐标
                    //             cc.log(this.newpos);
                    //             cc.log(expos);
                    //
                    //             //that.parent.parent.exchangeCell(this.newpos,expos);
                    //             //that.gamechange(this.newpos,expos);
                    //             var tep=expos;
                    //             expos=this.newpos;
                    //             this.newpos=tep;
                    //             cc.log(expos);
                    //             cc.log(this.newpos);
                    //
                    //             //交换函数
                    //
                    //
                    //         }
                    //     }
                    // }
                    //cc.log(pos);
                    that.parent.parent.onClick(that);


                }
            }
        })
        cc.eventManager.addListener(listener,this)
    }




});