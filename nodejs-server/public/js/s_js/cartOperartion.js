/**
 * used at batch.jsp
 */
function addBatchToCart() {
	var selectedItems = new Array();
	//检查是否有产品被选中
	var isselect=false;
	$("input[name='productModel']:checked").each(
			function() {
				var selectItemObj = {};
				
				selectItemObj.productNumber = $(this).val();
				selectItemObj.quantity = $("input[name='" + $(this).val() + "']").val();
				if($("input[name='" + $(this).val() + "']").val()<=0){
					return;
				}
				$(this).attr("checked",false);
				selectedItems.push(selectItemObj);
				isselect=true;
			});
	if(isselect){
		$.ajax({
			type : "get",            
			async:false,           
			url : siteBaseUrl+"/purchase/cart/addtocartAjax",            
			dataType : "jsonp",            
			jsonp: "callBack",
			jsonpCallback:"callRefreshShoppingCart2",
			data:"selectedItems="+$.toJSON(selectedItems)
		});
	}else{
		alertMessage("请选折产品型号");
	}
	

}
/**
 * @param productId
 * @param count
 */
function addSingleToCart(productId, count) {

	var selectedItems = new Array();
	var selectedItem = {};
	selectedItem.productNumber = productId;
	selectedItem.quantity = count;
	selectedItems.push(selectedItem);
	$.ajax({
		type : "get",            
		async:false,           
		url : siteBaseUrl+"/purchase/cart/addtocartAjax",            
		dataType : "jsonp",            
		jsonp: "callBack",
		jsonpCallback:"callRefreshShoppingCart2",
		data:"selectedItems="+$.toJSON(selectedItems)
	});

}
function callRefreshShoppingCart2(json){
	if(json[0].content>=0){
		$("#cart").html(json[0].content);
		// 使用name 全部赋值
		$("[name='cartCount']").text(json[0].content);
	}else{
		alertMessage("加入购物车失败");
	}
}
function addToCartProductDetail(){
	
	//addtocart action accept list<Map> parameter,so using a array to hold it
	var selectedItemsArr=new Array();
	var selectedItems={};
	selectedItems.productNumber=$("#productDetailForm input[name='productNumber']").val();
	selectedItems.quantity= $("#productDetailForm input[name='quantity']").val();
	selectedItemsArr.push(selectedItems);
	//修改成jsonp方式
	$.ajax({
		type : "get",            
		async:false,           
		url : siteBaseUrl+"/purchase/cart/addtocartAjax",            
		dataType : "jsonp",            
		jsonp: "callBack",
		jsonpCallback:"callRefreshShoppingCart2",
		data:"selectedItems="+$.toJSON(selectedItemsArr)
		
	});
//	$.post(siteBaseUrl+"/purchase/cart/addtocartAjax",{selectedItems:$.toJSON(selectedItemsArr)},
//			function(responseText, textStatus, XMLHttpRequest){
//			
//			if(textStatus=='success'){
//					if(responseText>=0){
//					alertMessage("成功加入购物车,请查看购物车");
//					$("#numberOfItemInShoppingCart").html(responseText+"件");
//					}else
//					{
//						alertMessage("加入购物车失败,请检查库存");
//						return;
//					}
//					
//				}else{
//					alertMessage("加入购物车失败");
//				}
//			}); 
}


function callRefreshShoppingCart(json){
	$("#cart").html(json[0].content);
}
function refreshShoppingCart(){
	$.ajaxSetup({cache:false});
	$.ajax({           
		type : "get",            
		async:false,           
		url : siteBaseUrl+"/purchase/cart/queryCarNumber",            
		dataType : "jsonp",            
		jsonp: "callBack",
		jsonpCallback:"callRefreshShoppingCart"
		});
}

/*  已用jsonp代替(上面方法)。
function refreshShoppingCart(){
	$.ajaxSetup({cache:false});
	$.get(siteBaseUrl+"/purchase/cart/getNumberOfItemsInCart",{},
			function(responseText, textStatus, XMLHttpRequest){
			if(textStatus=='success'){
				$("#numberOfItemInShoppingCart").html(responseText+"件");
			}else
			{
				alertMessage("system failed,please call admin");	
			}
			
		});
	
}
*/


