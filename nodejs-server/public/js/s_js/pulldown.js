
/////////////////////////
//
///文件已经移走，这里的内容不做维护。
//2013-12-11  徐平
////
////////////////////////


window.onlond=function(){
	$().getClass('shop_logo_box').hover(function(){
		$().getClass('shou_logo').show();
	},function(){
		$().getClass('shou_logo').hide();
	});
};

function showShopLogoBox(){
	$(".shop_logo_box").show();
}

function hideShopLogoBox(){
	$(".shop_logo_box").hide();
}

//设置鼠标移入移出方法
function hover(over,out){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].onmouseover = over;
		this.elements[i].onmouseout = out;
	}
	return this;
};

//设置显示
function show(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display='block';
	}
	return this;
};

//设置隐藏
function hide(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display='none';
	}
	return this;
};