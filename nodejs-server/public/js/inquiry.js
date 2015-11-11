//这里是询价的公共方法 开始
In.ready('web-user-info','jquery', function() {
	$(document).ready(function() {
		inquiryF5();
		// 显示询价的填充框
		$('.xunjia').each(
				function() {
					$(this).click(
							function() {
								$(".box_" + $(this).attr("pid")).toggle(100,
										showmessageBox($(this).attr("pid")));
							});
				});

		$('.xunjiacommit').each(function() {
			$(this).click(function() {
				saveInquiry($(this).attr("pid"));
			});
		});
		// 显示询价的填充框
	});
});



// 取产品的信息
function showmessageBox(productId) {
//	$.ajax({
//		type : "get",
//		async : false,
//		url : siteBaseUrl
//				+ "/single_inquiry/ajax/findproductbyidJsonp?productId="
//				+ productId,
//		dataType : "jsonp",
//		jsonp : "callBack",
//		jsonpCallback : "showmessageBoxCallBack"
//	});
	
	//获取到moq和pid
	$('.moq_' + productId).val(data.moq);
//	$('.moq_' + productId).attr("moq", data.moq);
};
// 取产品的信息之后回调函数
function showmessageBoxCallBack(json) {
	var data = $.parseJSON(json[0].content);
	// 起定量
	$('.moq_' + data.id).val(data.moq);
	$('.moq_' + data.id).attr("moq", data.moq);
};
// 保存询价信息
function saveInquiry(pid) {
	// 这里检测数字的有效性
	if ($('.quantity_' + pid).val() == ""
			|| !/^(-|\+)?\d+$/.test($('.quantity_' + pid).val())) {
		alert('采购数量只能输入数字');
		$('.quantity_' + pid).val("");
		return false;
	}
	var quantiry = parseInt($('.quantity_' + pid).val());
	var moq = parseInt($('.moq_' + pid).attr("moq"));
	if (quantiry < moq) {
		alert('采购数量不能小于起订量');
		return false;
	}
	if (quantiry % moq != 0) {
		alert('采购数量得是起订量的倍数');
		return false;
	}
	if ($('.expectedPrice_' + pid).val() != "") {
		if ((!/^(-|\+)?\d+$/.test($('.expectedPrice_' + pid).val()) && !/^(-|\+)?\d+\.\d*$/
				.test($('.expectedPrice_' + pid).val()))) {
			alert('目标单价只能输入数字');
			$('.expectedPrice_' + pid).val("");
			return false;
		}
	}
	if ($.cookie("inquirycar") != null
			&& $.cookie("inquirycar").indexOf(pid) > 0) {
		alert("询价已经存在了");
		$('.box_' + pid).hide();
	} else {
		$.ajax({
			type : "get",
			async : false,
			url : siteBaseUrl + "/single_inquiry/ajax/getDomainJsonp?pid="
					+ pid,
			dataType : "jsonp",
			jsonp : "callBack",
			jsonpCallback : "saveInquiryCallBack"
		});
	}
	;
}

function saveInquiryCallBack(json) {

	var domain = json[0].content;
	var pid = json[0].pid;
	var v = json[0].pid + "," + $('.quantity_' + pid).val() + ","
			+ $('.expectedPrice_' + pid).val();
	$.cookie('inquirycar', $.cookie("inquirycar") + "|" + v, {
		expires : 7,
		path : '/',
		domain : domain
	});
	$.add2cart('box1_' + json[0].pid, 'inquiryCount',
			saveInquirycar(json[0].pid));
}

function saveInquirycar(pid) {
	$('.box_' + pid).hide();
	inquiryF5();
}
function inquiryF6() {
	
	try{
		$.ajax({
			type : "get",
			async : false,
			url : siteBaseUrl + "/single_inquiry/ajax/countOfInquiry",
			dataType : "jsonp",
			jsonp : "callBack",
			jsonpCallback : "saveInquiryCallBack1"
		});
	}
	catch(e){
		
	}

	
}
function saveInquiryCallBack1(json) {
	$("#inquiryCount").html(json[0].content);
}
// 询价的公共方法 结束

// 显示Tab页面的询价的填充框
function inqueryClick(index) {
	// 循环所有的询价
	// $('.tab_xunjia_'+index).each(function() {
	// $(this).click(function() {
	// $(".box_"+index+"_" +
	// $(this).attr("pid")).toggle(100,getProduct($(this).attr("pid"),'showTabBox'));
	//						
	// });
	// });
	// 确认按钮
	// $('.tab_xunjiacommit_'+index).each(function(){
	// $(this).click(function(){
	// saveTabInquiry($(this).attr("pid"),index);
	// });
	// });
}

// 取产品的信息
function getProduct(productId, callback) {
	$.ajax({
		type : "get",
		async : false,
		url : siteBaseUrl
				+ "/single_inquiry/ajax/findproductbyidJsonp?productId="
				+ productId,
		dataType : "jsonp",
		jsonp : "callBack",
		jsonpCallback : callback
	});
};
// 显示Tab页面的询价的填充框

function showTabBox(json) {
	var data = $.parseJSON(json[0].content);
	// 起定量
	$('.tab_moq_' + data.id).val(data.moq);
	$('.tab_moq_' + data.id).attr("moq", data.moq);
}

function saveTabInquiry(pid, index) {
	// 这里检测数字的有效性
	if ($('.tab_quantity_' + pid).val() == ""
			|| !/^(-|\+)?\d+$/.test($('.tab_quantity_' + pid).val())) {
		alert('采购数量只能输入数字');
		$('.tab_quantity_' + pid).val("");
		return false;
	}
	var quantiry = parseInt($('.tab_quantity_' + pid).val());
	var moq = parseInt($('.tab_moq_' + pid).attr("moq"));
	if (quantiry < moq) {
		alert('采购数量不能小于起订量');
		return false;
	}
	if (quantiry % moq != 0) {
		alert('采购数量得是起订量的倍数');
		return false;
	}
	if ($('.tab_expectedPrice_' + pid).val() != "") {
		if ((!/^(-|\+)?\d+$/.test($('.tab_expectedPrice_' + pid).val()) && !/^(-|\+)?\d+\.\d*$/
				.test($('.tab_expectedPrice_' + pid).val()))) {
			alert('目标单价只能输入数字');
			$('.tab_expectedPrice_' + pid).val("");
			return false;
		}
	}
	if ($.cookie("inquirycar") != null
			&& $.cookie("inquirycar").indexOf(pid) > 0) {
		alert("询价已经存在了");
		$(".box_" + index + "_" + pid).hide();
	} else {
		$.ajax({
			type : "get",
			async : false,
			url : siteBaseUrl + "/single_inquiry/ajax/getDomainJsonp?pid="
					+ pid,
			dataType : "jsonp",
			jsonp : "callBack",
			jsonpCallback : "saveTabInquiryCallBack"
		});
		$.add2cart('tab_box_' + index + "_" + pid, 'inquiryCount');
		$(".box_" + index + "_" + pid).hide();
	}
	;
}
function saveTabInquiryCallBack(json) {
	var domain = json[0].content;
	var pid = json[0].pid;
	var v = json[0].pid + "," + $('.tab_quantity_' + pid).val() + ","
			+ $('.tab_expectedPrice_' + pid).val();
	$.cookie('inquirycar', $.cookie("inquirycar") + "|" + v, {
		expires : 7,
		path : '/',
		domain : domain
	});
	inquiryF5();
}
function resetZindex() {
	$(".inquiry_box_a").each(function(index) {
		$(this).css("z-index", 9999 - index);
	});
}