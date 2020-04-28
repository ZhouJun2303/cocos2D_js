// document.getElementById 通过id获取标签
//main是移动的区域，main.childNodes就是以东区域中的每一行所组成的数组，
//mian.childNodes[任意值].childNodes就是每一行中的小方块所组成的数组
var go = document.getElementById('go');
var main = document.getElementById('main');
var scoreLabel = document.getElementById('score')
var speed = 2, timer , ctop = -150, score = 0;
function GameStart(){
	// 添加监听者
	go.addEventListener('click',function(){
		//设置这个go也就是我们的Gamestart所在的标签为不可见
		go.style.display = 'none';
		//控制我们的红色方框进行移动
		move();
		bindEvent();
	})
	
}
GameStart();

//让红色方框向下移动
function move(){
	createCell();
	clearInterval(timer);
	//定义了一个定时器
	timer = setInterval(fun,10)
}

function fun(){
		
		//ctop是红色方框初始的top值
		ctop = ctop + speed; // -150 + 2 = -148
		main.style.top = ctop + 'px'; //'-148px'
		if(ctop >= 0){
			main.style.top = '-150px';
			ctop = -150;
			//创建一行小方块
			createCell();
			if((score % 5) == 0 && score!= 0){
				speed += 0.5
			}
			if(main.childNodes.length >= 6){
				for(var i = 0; i < 4; i++){
					//判断这行中有没有黑色方块未被点击
					if(main.childNodes[main.childNodes.length - 1].childNodes[i].classList.contains('i')){
						alert('Game Over 本次得分：' + score);
						clearInterval(timer);
						setTimeout(function(){
							setInterval(fun,10)
						},2000);
					}
				}
				//删除指定的标签下的某一子标签
				main.removeChild(main.childNodes[main.childNodes.length - 1]);
			}
			
		}
	}
//创建每一行的小方块
function createCell(){
	//蛇者一个0到3的随机数
	var index = parseInt(Math.random() * 4)
	//创建一行的容器
	var rdiv = document.createElement('div');
	//设置一个class属性，让选择器能够选择到
	rdiv.setAttribute('class','row');
	//判断main有没有儿子
	//标签.childNodes是一个数组，这个数组中存储了以这个标签为父节点的所有子节点
	if(main.childNodes.length == 0){//没有儿子的时候
		//将rdiv添加到main这个节点上
		main.appendChild(rdiv);
	}else{//有儿子的时候
		//将儿子仍在第一行也就是放在所有儿子的最前面
		main.insertBefore(rdiv,main.childNodes[0])
	}
	//创建一个一个的小方块放到每一行里面去
	for(var i = 0; i < 4; i++){
		//创建了一个div容器
		var ldiv = document.createElement('div');
		//给小方块设置class属性
		ldiv.setAttribute('class','line death');
		//将小方块添加到了每一行当中
		rdiv.appendChild(ldiv);
	}
	var clickCell = main.childNodes[0].childNodes[index];
	//console.log(clickCell);
	clickCell.classList.remove('death')
	clickCell.setAttribute('class','line i life');
	clickCell.style.backgroundColor = 'black';
}

//给main区域添加点击
function bindEvent(){
	main.addEventListener('click',function(e){
		console.log(scoreLabel);
		//被点的是谁
		var temp = e.target;
		//console.log(temp);
		//被点的是不是黑色方块
		if(!temp.classList.contains('life')){//不是黑色方块游戏结束，并清除移动计时器
			alert('Game Over 本次得分：' + score);
			clearInterval(timer);
			setTimeout(function(){
							setInterval(fun,10);
						},2000);
		}else{//得分的变量加1，并且改变网页中得分文本的显示，让黑色方块颜色变为黄色移除判断为
		//黑色方块的class ‘i’;
			if(temp.classList.contains('i')){
				score+= 1;
			}
			
			//改变标签中文本的显示
			scoreLabel.innerHTML = '当前得分：'+score;
			//将方块的颜色变为黄色
			temp.style.backgroundColor = 'yellow';
			//将class ‘i’移除，避免出现点击后任然判断为黑色方块
			temp.classList.remove('i');
		}
	})
}









