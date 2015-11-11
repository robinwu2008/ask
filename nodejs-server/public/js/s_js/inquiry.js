
// 初始化参数
function initVal(model, productId, shopId,delivery,packNuber,
		manufacturers) {
	
	$("#" + "productId").val(productId);
	$("#" + "shopId").val(shopId);
	$("#" + "model").text(model);
	$("#" + "packNuber").text(packNuber);
	$("#" + "manufacturers").text(manufacturers);
	$("#invoicePopWindow").modal("show");
}


function generateOrder() {
	var ps = "";
	var i = 0;
	$(".pid").each(function() {
		if (this.checked) {
			if (i == 0) {
				ps = $(this).val();
			} else {
				ps = ps + "," + $(this).val();
			}
			i++;
		}
	});

	$("input[name='itemList']").attr("value", ps);
	if (ps == "") {
		alertMessage("无选项!");
		return;
	}
	$("#inquiryForm").submit();
}

function deleteItem() {
	var ps = "";
	var i = 0;
	$(".pid").each(function() {
		if (this.checked) {
			if (i == 0) {
				ps = $(this).val();
			} else {
				ps = ps + "," + $(this).val();
			}
			i++;
		}
	});
	$("input[name='itemList']").attr("value", ps);
	var url = siteBaseUrl + "/inquiry/del";
	$("#inquiryForm").attr("action", url);
	if (ps == "") {
		return;
	}
	$("#inquiryForm").submit();
}

function callBackSaveInquiry(json){
	
	if (json[0].content == 0) {
	//	alertMessage("询价记录已存在.");
		$("#invoicePopWindow").modal("hide");
	} 
	else if (json[0].content == -1) {
		alertMessage("目标单价格式错误，请更改。");
	}
	else if (json[0].content == 1) {
		$("#invoicePopWindow").modal("hide");
	}
}


function saveInquiry(){
	if (!$('.control-group').validation()) {
		return;
	}
	var packNuber = $.trim($("#packNuber").text());
	var endIndex = packNuber.indexOf('个');
	packNuber = packNuber.substr(0,endIndex);
	var productId = $.trim($("#productId").val());
	var quantity = $.trim($("#quantity").val());
	var model = $.trim($("#model").text());
	var expectedPrice = $.trim($("#expectedPrice").val());
	
	$.ajaxSetup({cache:false});
	$.ajax({           
		type : "get",            
		async:false,           
		url : siteBaseUrl+"/inquiry/saveInquiry?productId="+productId+"&quantity="+quantity+"&model="+model+"&expectedPrice="+expectedPrice+"&packNuber="+packNuber,            
		dataType : "jsonp",            
		jsonp: "callBack",
		jsonpCallback:"callBackSaveInquiry"
		});
}
