/**
 * 用于隐藏和显示更多内容
 */

In('jquery', function() {
	//这里依赖jquery。
	$(document).ready(function() { 
		//用于标记需要隐藏和显示的标签
		//showmorehideAll();
	}); 
});
 


function showmoreshowAll(){
	$("[showmore]").each(function(){
		show(this);
	});
}
function show (argument) {
	//根据选择器初始化一组 
	//showmore_more 标签标记显示那些内容 如果多了就隐藏 
	argument.find(argument.attr("showmore_more")).show();

  
}

function showmorehideAll(){
//	$("[showmore]").each(function(index,element){     
//		 one_showmore=$(element);
//		 mubiao=one_showmore.attr("showmore_more"); 
//		 one_showmore.find(mubiao).each(function(i,t){
//		 	 if(i>0){
//		 	 	$(t).hide();
//		 	 }
//		 });
//		  one_showmore.find("[showme]").each(function(i,t){ 
//		 	 	$(t).show(); 
//		 });
//		  one_showmore.find("[showmec]").each(function(i,t){ 
//		 	 	$(t).click(function(){
//		 	 		$(this).parent().parent('tr [showme!= "1"]').show();
//		 	 	}); 
//		 });
//	});
}
 



