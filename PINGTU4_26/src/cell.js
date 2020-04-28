var Cell=cc.Sprite.extend({

    ctor:function (url,rect,id,Index) {
        this._super(url,rect,id,Index);
        this. setInputControl();
        this.isBlack=false;
        this.id=id;
        this.Index=Index
    },
    //在方块上添加点击
    setInputControl:function () {
        var that=this;
        var listener=cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowtouches:true,
            onTouchBegan:function(touch,event) {
                var pos = touch.getLocation();
                var rect = cc.rect(0,0,that.width,that.height);
                pos=that.convertToNodeSpace(pos);
                if(cc.rectContainsPoint(rect,pos)){
                    //cc.log(that.id);
                    that.parent.parent.onClick(that);

                }
            }
        })
        cc.eventManager.addListener(listener,this);
    }
})