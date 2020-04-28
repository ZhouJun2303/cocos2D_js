var starLayer=cc.Layer.extend({
   ctor:function () {
       this._super();
       var size =cc.winSize;




       var  arr=[];
       for(var i=0;i<300;i++) {
           arr[i] = new cc.Sprite(res.star_png);

           arr[i].attr({
               x:size.width*Math.random(),
               y:size.height*Math.random()
           });
           cc.scaleTo(0,Math.random(),Math.random())
       }

       for(var  j=0;j<arr.length;j++){
          this.addChild(arr[j],0);
       }

       var a=setInterval(
           function () {
               for(var z=0;z<arr.length;z++) {

                   var a=Math.random()*2;
                   var b=Math.random();

                   if(a>1) {
                       arr[z].runAction(
                           cc.spawn(
                              // cc.moveTo(a,size.width*Math.random(),size.width*Math.random()),
                               //cc.rotateBy(a, 360),
                               //cc.delayTime(parseInt(Math.random()) * 2),
                               cc.sequence(
                                   // cc.scaleTo(1,0.5,0.5),
                                   // cc.scaleTo(1,1,1),
                                   // cc.scaleTo(1,0.5,0.5),
                                   // cc.scaleTo(1,1,1),
                                   // cc.scaleTo(1,0.5,0.5),
                                   // cc.scaleTo(1,1,1)
                                   cc.scaleTo(a, b, b),
                                   cc.fadeOut(a),
                                   cc.fadeIn(a)
                               )
                           )
                       )
                   }
                   else
                   {
                       arr[z].runAction(
                           cc.spawn(//同时执行
                               cc.rotateBy(a,360),
                               //cc.moveTo(a,size.width*Math.random(),size.width*Math.random()),
                               cc.sequence(//顺序执行
                                   cc.scaleTo(a, b, b),
                                   cc.fadeOut(a),
                                   cc.fadeIn(a)
                               )
                           )
                       )
                   }
               }


           },2000
       );

       var tites=1;

       var sprite=new cc.MenuItemImage(

           res.GLT,
           res.GLT,

           function () {
               if(tites==1) {
                   sprite.runAction(
                       cc.spawn(
                           cc.moveTo(10, cc.p(Math.random()*size.width, Math.random()*size.height / 2)),
                           cc.rotateBy(10, 720),
                           cc.sequence(
                               cc.scaleTo(5,0.1,0.1),
                               cc.scaleTo(5,0.6,0.6)
                           )

                       )
                   )
                   tites=2;
               }
               if(tites==2)
               {
                   sprite.runAction(
                       cc.spawn(
                           //to 直接给坐标
                           cc.moveTo(10, cc.p(size.width/2, size.height / 2)),
                           cc.rotateBy(10, 720),
                           cc.sequence(
                               cc.scaleTo(5,0.1,0.1),
                               cc.scaleTo(5,0.6,0.6)
                           )
                       )
                   )
                   tites=1;
               }
           },this


       );
       sprite.scale=0.5;
       sprite.attr({
           x:0,
           y:size.width/2
       });


       var  menu=new cc.Menu(sprite);
       menu.attr({
           x:0,
           y:0
       });

       this.addChild(menu,0);


        var sprite1=new cc.Sprite(res.boll_png);
       sprite1.scale=0.5;
       sprite1.attr(
           {
               x:size.width/2,
               y:size.height
           }
       );
       this.addChild(sprite1,2);


       //下落速度
       this.speed=10;
       //上升速度
       this.speed2=10;
       //下落时间
       var time_s=5;
       //反弹高度
       var r_heighr=size.height;

        // var repeat1=  cc.repeat(
        //         //local action = cc.FadeOut:create(3)--淡出
        //        cc.sequence(
        //             cc.moveTo(0.1,size.width/2,size.height-this.speed)
        //
        //        ),
        //         1
        // );

       // var repeat1=cc.repeat(
       //     cc.moveTo(0.1,size.width/2,size.height-this.speed),
       //     30
       // );
       //
       // var repeat2=cc.repeat(
       //      cc.moveTo(0.1,size.height/2,sprite1.height/2+this.speed2)
       // );
       //
       // for(var s=0;s<100;s++) {
       //
       //     this.speed = s + 100;
       //     sprite1.moveTo(0.1,size.width/2,size.height-this.speed);
       // }
       //  sprite1.runAction(repeat1);

       sprite1.runAction(
                cc.sequence(
                    cc.moveTo(1,size.width/2,30),
                    cc.spawn(
                        cc.jumpTo(60,cc.p(size.width/2,30),300,50),
                        cc.blink(60,500),
                        cc.skewTo(60,9522,0)
                    )
                )


       )































   }

});

var starScene=cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer=new starLayer();
        this.addChild(layer);
    }
});