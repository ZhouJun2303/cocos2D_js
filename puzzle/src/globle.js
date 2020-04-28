/*
* @ author:J Zhou
* @ describe ：拼图主界面
* @ date：2019年5月20日15:39:54
* */

//单例模式
cc.vv=cc.vv||{};
//拼图的阶数
cc.vv.LINE=3;
cc.vv.ROW=3;
cc.vv.TOT=cc.vv.LINE*cc.vv.ROW;

//拼图间隙
cc.vv.GAP=5;

//当前关卡
cc.vv.level=5;

//上下移动的+-
cc.vv.N=3;

//移动方向及对应下标偏量
cc.vv.DIRS={
    up: -cc.vv.LINE,
    Down: cc.vv.LINE,
    Left:-1,
    Right:1
};

//碎片的宽高
cc.vv.hei=undefined;
cc.vv.wid=undefined;