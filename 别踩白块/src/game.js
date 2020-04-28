var gameLayer=cc.Layer.extend({
    ctor:function () {
        this._super();
        var size=cc.winSize;

        //设置背景图片
        var background=new cc.Sprite(res.BackGround_png);

        background.attr({
            x:size.width/2,
            y:size.height/2
        });

        this.addChild(background,0);


        var star=new cc.MenuItemImage(
            res.Starbutton1,
            res.Starbutton2,
            function () {
                cc.log("跳转场景");
                cc.director.runScene(new levelScene);
            },this
        );

        star.attr({
            x:size.width/2,
            y:size.height/8
        });


        var menu =new cc.Menu(star);
        menu.x=0;
        menu.y=0;
        this.addChild(menu,1);
    }







});





var gameScene =cc.Scene.extend({

    onEnter:function()
    {
        this._super();
        var layer=new gameLayer();
        this.addChild(layer);
    }
});