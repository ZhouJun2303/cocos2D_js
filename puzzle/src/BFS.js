
function checkIndex(blackIndex,dir){
    var row = parseInt(blackIndex / cc.vv.LINE);
    var line = parseInt(blackIndex % cc.vv.LINE);
    if(Math.abs(dir) === 1){
        return line + dir >= 0 && line + dir < cc.vv.LINE;
    }else{
        return row + dir / cc.vv.LINE >= 0 && row + dir / cc.vv.LINE < cc.vv.LINE;
    }
}

//克隆数组
function cloneArr(arr){
    return JSON.parse(JSON.stringify(arr));
}

var STATE=cc.Class.extend({
    ctor: function (target, uniqueID, register, blackIndex, par, lastStep) {

        //目标状态
        this.target = target;
        //当前状态的唯一识别码
        this.uniqueID = uniqueID;
        //当前状态的父状态
        this.par = par;
        //父状态演变成当前状态的走位方式
        this.lastStep = lastStep;
        //纪录此前所有出现过的状态,表,其实就是个键值对
        this.register = register;
        //当前状态下黑块下标
        this.blackIndex = blackIndex;

        return true;
    },

    //判断自己与目标状态是否相等
    checkIsRecover: function () {
        return this.target.join('') === this.uniqueID.join('');
    },

    //获取当前状态所有的子状态
    getChildren: function () {
        var children = [];
        // 查找子状态的逻辑
        var key=Object.keys(cc.vv.DIRS);
        for (var i = 0; i < key.length; i++) {
            var dir = cc.vv.DIRS[key[i]];
            //判断当前方向是否可移动
            if (checkIndex(this.blackIndex, dir)) {
                var target = this.blackIndex + dir;
                var clone = cloneArr(this.uniqueID);
                [clone[target], clone[this.blackIndex]] = [clone[this.blackIndex], clone[target]];
                if (!this.register.hasOwnProperty(clone)) {
                    //performance['搜索的节点数'] += 1;
                    this.register[clone] = '';
                    var state = new STATE(this.target, clone, this.register, target, this, dir);
                    children.push(state);
                }
            }
        }
        return children;
    }
});
//核心算法搜索
var Controller=function (start){  //[1,2,3,4,5,0,6,7,8]
    //var t_start = (new Date()).getTime();
    var path = [];
    var destination = null;
    search([start]);
    //todo 核心算法逻辑
    function search(nodeList){
        //定义一个容器,用来装每一层的节点
        var curLevel = [];
        for(var i = 0; i < nodeList.length; i++){
            var children=nodeList[i].getChildren();
            // cc.log(children);
            children.forEach(function(e){
                curLevel.push(e)
            })
        }
        //检查当前层所有的节点中有没有我们的目标状态
        for(var i = 0; i < curLevel.length; i++){
            if(curLevel[i].checkIsRecover()){
                destination = curLevel[i];
                break;
            }
        }
        if(destination){
            console.log('寻路成功');
            drawPath();
        }else{
            search(curLevel);
        }
    }
    //绘制路径
    function drawPath(){
        var p = destination;
        while(p.par){
            path.unshift(p.lastStep);
            p = p.par;
        }
    }
    //var t_end = (new Date()).getTime();
    //performance['花费的时间(ms)'] = t_end - t_start;
    //performance['还原需要的步数'] = path.length;
    return path;
};
