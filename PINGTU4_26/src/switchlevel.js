var slevelLayer=cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();

        //星星运动的锁
        this.isrun=false;

        var size = cc.winSize;
        var sprite = new cc.Sprite(res.gameground);
        sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        })
        this.addChild(sprite);

        this.clover = new cc.Sprite(res.clover);
        this.clover.attr({
            x: size.width / 2,
            y: size.height - 5 - this.clover.height / 2
        })
        this.addChild(this.clover);

        this.runScene=cc.callFunc(function () {     //回调函数
            cc.director.runScene(new level1Scene);
        })

        var enter = new cc.MenuItemImage(
            res.enter1,
            res.enter2,
            function () {
                //cc.log('跳转到第三个场景');
                this.isrun=true;
                this.star.runAction(
                    cc.sequence(
                        cc.moveTo(0.2,cc.p(this.clover.width/2,this.clover.height/2)),
                        cc.spawn(
                            cc.rotateTo(0.5,720),
                            cc.scaleTo(0.5, 3, 3),
                            cc.fadeOut(0.5)
                        ),
                        this.runScene
                    )
                )
                // var scene =new  cc.TransitionJumpZoom(1,new level1Scene);
                // if (scene)

                // setTimeout(function () {
                //     cc.director.runScene(new level1Scene);
                // },700)
            }, this);
        //设置属性
        enter.attr({
            x: size.width / 2,
            y: size.height / 6
        });
        var menu = new cc.Menu(enter);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 2);
        var returnButton = new cc.MenuItemImage(
            res.return1,
            res.return2,
            function () {
                cc.director.runScene(new pingtuScene());

            }, this);
        returnButton.attr({
            x: size.width - 3 - returnButton.width,
            y: returnButton.height/2+3
        });
        var menu1 = new cc.Menu(returnButton);
        menu1.x = 0;
        menu1.y = 0;
        this.addChild(menu1);

        //添加星星
        this.star = new cc.Sprite(res.star);
        this.star.x = this.clover.width / 2;
        this.star.y = this.clover.height / 2;
        this.star.scale = 2;
        this.clover.addChild(this.star);
        this.star.runAction(
            cc.spawn(
                cc.scaleTo(1, 1, 1),
                cc.rotateBy(1, 720)
            )
        )
        this.setInputControl();
        return true;
    },
        setInputControl:function () {
        var that=this;
            //创建一个监听者
        var listener=cc.EventListener.create({
            //指定监听类型
            //触摸类型
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            //设置事件吞没
            swallowtouches:true,
            onTouchBegan:function(touch,event) {
                if(that.click == 2){
                    that.star.runAction(
                        cc.sequence(
                            cc.moveTo(0.2,that.clover.width / 2,that.clover.height / 2),
                            cc.spawn(
                                cc.rotateBy(0.5,720),
                                cc.scaleTo(0.5,3),
                                cc.fadeOut(0.5)
                            ),
                            that.runScene
                        )
                    )
                }
                if(that.isrun){
                    return;           //锁住
                }
                that.isrun=true;
                //cc.log(touch,event);

                var callback=cc.callFunc(function () {//回调函数
                        that.isrun=false;
                        that.star.scale=1.5;
                })

                var pos = touch.getLocation();
                var rect = cc.rect(0, that.clover.y - that.clover.height / 2, that.clover.width, that.clover.height);
                if (cc.rectContainsPoint(rect, pos)) {
                    pos = that.clover.convertToNodeSpaceAR(pos);
                    cc.log(pos)
                    //点击第二象限
                    if (pos.x < 0 && pos.y > 0) {
                        cc.vv.level = 1;
                        var spawn1=cc.spawn(
                            cc.moveTo(0.1, cc.p(that.clover.width / 4, (that.clover.height / 4) * 3)),
                            cc.rotateBy(0.1, 72)
                        );
                        that.star.runAction(
                            cc.sequence(
                                spawn1
                                //callback
                        )
                        )
                    }
                        //点击第一象限
                        if (pos.x > 0 && pos.y > 0) {
                            cc.vv.level = 2;
                            that.star.runAction(
                                cc.spawn(
                                    cc.moveTo(0.1, cc.p((that.clover.width / 4) * 3, (that.clover.height / 4) * 3)),
                                    cc.rotateBy(0.1, 72)
                                )
                            )
                        }
                        //点击第三象限
                        if (pos.x < 0 && pos.y <0) {
                            cc.vv.level = 3;
                            that.star.runAction(
                                cc.spawn(
                                    cc.moveTo(0.1, cc.p(that.clover.width / 4, that.clover.height / 4)),
                                    cc.rotateBy(0.1, 72)
                                )
                            )
                        }
                    //点击第四象限
                    if (pos.x > 0 && pos.y < 0) {
                        cc.vv.level = 4;
                        that.star.runAction(
                            cc.spawn(
                                cc.moveTo(0.1, cc.p((that.clover.width / 4) * 3, that.clover.height / 4)),
                                cc.rotateBy(0.1, 72)
                            )
                        )
                    }
                }
                // setTimeout(function () {
                //     that.isrun=false;        开锁
                // },101)
                //将世界坐标系转换为以图片左下角为坐标系
               // pos=that.clover.convertTouchToNodeSpaceAR(pos);
                //cc.log(pos);
            }
        })
        //将我们创建的监听者添加到监听者管理中
            cc.eventManager.addListener(listener,this)

    }
})

var slevelScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new slevelLayer();
        this.addChild(layer);
    }
});