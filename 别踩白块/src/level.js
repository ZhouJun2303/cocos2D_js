var levelLayer=cc.Layer.extend({

   ctor:function () {
       this._super();
       var size=cc.winSize;
       var sprite=new cc.Sprite(res.gameBackgroun_png);

       this.isrun=false;
       sprite.attr({
           x:size.width/2,
           y:size.height/2
       });

       this.addChild(sprite);

       this.clover=new cc.Sprite(res.clover);

       this.clover.attr({
           x:size.width/2,
           y:size.height-5-this.clover.height/2
       });

       this.addChild(this.clover,2);

       //回调函数
       var runScene=cc.callFunc(
           function () {
               cc.director.runScene(new pingtuScene());
           }
       );
       //图片按钮
       var enter=new cc.MenuItemImage(
           res.enter1,
           res.enter2,

           function () {
               //console.log("3");
               this.isrun=true;
               this.star.runAction(
                   cc.sequence(
                       cc.moveTo(0.2,this.clover.width/2,this.clover.height/2),
                       cc.spawn(
                           cc.rotateBy(0.5,360),
                           cc.scaleTo(0.5,1.5,1.5)//scaleTo放大，缩小
                       ),
                       cc.fadeOut(0.5),

                        runScene//回调函数写在顺序执行里面
                   )
               )
           },this);

       enter.attr({
           x:size.width/2,
           y:size.height/6
       });


       var menu= new cc.Menu(enter);
       menu.attr({
           x:0,
           y:0
       });

       this.addChild(menu,4);

       var returns=new cc.MenuItemImage(
           res.return1,
           res.return2,
           function () {
               console.log("4");
               cc.director.runScene(new gameScene);

           },this
       );

       returns.attr({
           x:size.width-returns.width/2-3,
           y:returns.height/2+3
       });


       var menu1=new cc.Menu(returns);
       menu1.attr({
           x:0,
           y:0
       });

       this.addChild(menu1);

       //添加星星
       this.star=new cc.Sprite(res.star_png);

       this.star.x=this.clover.width/2;
       this.star.y=this.clover.height/2;

       this.star.scale=2;//设置为2倍


       //将星星添加到clover上面
       this.clover.addChild(this.star);
       //星星的动作
       this.star.runAction(
           cc.spawn(
               cc.scaleTo(1,1,1),
               cc.rotateBy(1,720)
           )
       );

       //添加点击属性
       this.setInputControl();



   },


    setInputControl:function () {
       var that=this;
       //创建一个监听者

        var listener=cc.EventListener.create({
            //指定监听类型  触摸类型
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            //设置事件吞没  为true时只触发当前监听
            swallowtouches:true,
            //鼠标点击反应
            onTouchBegan:function (touch,event) {

                if(that.isrun)
                {
                    return;
                }
                that.isrun=true;


                //回调函数
                var callback=  cc.callFunc(
                    function () {
                        that.isrun=false;
                    }
                );
                //设置一个变量接收点的坐标
                var pos =touch.getLocation();
                cc.log(pos);

                //转换成以clover图片左下角  为原点



                var rect=cc.rect(0,that.clover.y-that.clover.height/2,that.clover.width,that.clover.height);//rect像下为0

                if(cc.rectContainsPoint(rect,pos))
                {

                    pos =that.clover.convertToNodeSpaceAR(pos);

                    //第二象限
                    if(pos.x<0&&pos.y>0)
                    {
                        cc.vv.level = 1;
                        that.star.runAction(
                            cc.sequence(
                                cc.spawn(
                                    cc.moveTo(0.5,cc.p(that.clover.width/4,that.clover.height/4*3)),
                                    cc.rotateBy(0.5,45)
                                ),
                                callback
                            )
                        )
                    }
                    //第一象限
                    if(pos.x>0&&pos.y>0)
                    {
                        cc.vv.level = 2;
                        that.star.runAction(
                            cc.sequence(
                                cc.spawn(
                                    cc.moveTo(0.5,cc.p(that.clover.width/4*3,that.clover.height/4*3)),
                                    cc.rotateBy(0.5,45)
                                ),
                                callback
                            )
                        )
                    }

                    if(pos.x<0&&pos.y<0)
                    {
                        cc.vv.level = 3;
                        that.star.runAction(
                            cc.sequence(
                                cc.spawn(
                                    cc.moveTo(0.5,cc.p(that.clover.width/4,that.clover.height/4)),
                                    cc.rotateBy(0.5,45)
                                ),
                                callback
                            )
                        )
                    }

                    if(pos.x>0&&pos.y<0)
                    {
                        cc.vv.level = 4;
                        that.star.runAction(
                            cc.sequence(
                                cc.spawn(
                                    cc.moveTo(0.5,cc.p(that.clover.width/4*3,that.clover.height/4)),
                                    cc.rotateBy(0.5,45)
                                ),
                                callback
                            )
                        )
                    }

                    // var a=function () {
                    //     that.star.runAction(
                    //         cc.sequence(
                    //             cc.rotateBy(0.5,72)
                    //         )
                    //     )
                    // };
                    // setTimeout(a(),500);



                }
                // setTimeout(function () {
                //     that.isrun=false;
                // },501)



            }
        });
        //将创建的监听者添加到监听管理中
        cc.eventManager.addListener(listener,this);
    }

});

var levelScene =cc.Scene.extend({
   onEnter:function () {
       this._super();
       var layer=new levelLayer();
       this.addChild(layer);
   }
});