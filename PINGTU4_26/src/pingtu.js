var pingtuLayer=cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;
//设置背景图片
        var background=new cc.Sprite(res.background_png);
        background.attr({
            x:size.width/2,
            y:size.height/2
        })
        //将图片添加到图层上
        this.addChild(background,1);
        var start= new cc.MenuItemImage(
           res.enter1,
            res.enter2,
                function () {
                    cc.director.runScene(new slevelScene);
                },this);
        //设置属性
        start.attr({
            x:size.width/2,
            y:size.height/6
        });
        var menu = new cc.Menu(start);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 2);

        return true;
    }
});

var pingtuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new pingtuLayer();
        this.addChild(layer);
    }
});