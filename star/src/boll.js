var bollLayer= cc.Layer.extend({
    ctor:function () {
        this._super();

        var size=cc.winSize;

        this.speed=0.1;
        this.g=0.03;

        this.boll=new cc.Sprite(res.boll_png);
        this.boll.scale=0.5;
        this.boll.x=size.width/2;
        this.boll.y=size.height/2+100;

        this.addChild(this.boll);

        var temp=setInterval(this.drop.bind(this),0.08);

    },
    drop:function () {
        this.boll.y-=this.speed;
        this.speed+=this.g;
        if(this.boll.y<=this.boll.width/4){
            this.speed*=-4/5;
        }

    }
});

var bollScene=cc.Scene.extend({
   onEnter:function () {
       this._super();
       var layer=new bollLayer();
       this.addChild(layer);
   }
});