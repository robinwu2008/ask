function addShoppingcar(productId) {
	var buyCount = $("#buyCount").val();
	$.ajax({
		type : "get",
		async : false,
		url : siteBaseUrl + "/shoppingcat/ajax/addByJsonp?productId="
				+ productId + "&buyCount=" + buyCount,
		dataType : "jsonp",
		jsonp : "callBack",
		jsonpCallback : "addShoppingcarCallBack"
	});
}

function addShoppingcarCallBack(json) {
	$.add2cart('add_car_button', 'shoppingcarCount', "alert(1)");
	flushShoppingcarNumber();
}

function flushShoppingcarNumber() {
	$.ajax({
		type : "get",
		async : false,
		url : siteBaseUrl + "/shoppingcat/ajax/queryNumberByJsonp",
		dataType : "jsonp",
		jsonp : "callBack",
		jsonpCallback : "showShoppingcarNumber"
	});
}

function showShoppingcarNumber(json) {
	$("#shoppingcarCount").html(json[0].content);
}

function deleteShoppingcar(id) {
	$("#ids").val(id);
	$("#shoppingForm").attr("action", siteBaseUrl + "/shoppingcat/delete");
	$("#shoppingForm").submit();
}

function batchDeleteShoppingcar() {
	var ids = "";
	$(".selectItem").each(function() {
		if (this.checked) {
			if ($(this).val() != "") {
				ids = ids + $(this).val();
				ids = ids + ",";
			}
		}
	});
	$("#ids").val(ids);
	$("#shoppingForm").attr("action", siteBaseUrl + "/shoppingcat/delete");
	$("#shoppingForm").submit();
}

function selectFill(obj) {
	var node = $(obj).attr("data");
	if (node == 1) { // 全选
		if (obj.checked) {
			selectByValue(".selectItem");
		} else {
			cancelSelectByValue(".selectItem");
		}
	}
	if (node == 2) { // 店铺
		if (obj.checked) {
			selectByValue("[name=" + $(obj).attr("id") + "]");
			if (isSelectAllByValue(".selectItem")) {
				selectByValue("#selectAll");
			}
		} else {
			cancelSelectByValue("[name=" + $(obj).attr("id") + "]");
			cancelSelectByValue("#selectAll");
		}
	}
	if (node == 3) {// 产品
		if (obj.checked) {
			if (isSelectAllByValue("[name=" + $(obj).attr("name") + "]")) {
				selectByValue("#" + $(obj).attr("name"));
			}
			if (isSelectAllByValue(".selectItem")) {
				selectByValue("#selectAll");
			}
		} else {
			cancelSelectByValue("#" + $(obj).attr("name"));
			cancelSelectByValue("#selectAll");
		}
	}
}

function isSelectAllByValue(value) {
	var mark = 1;
	$(value).each(function() {
		if (this.checked == false) {
			mark = 0;
		}
	});
	if (mark == 1) {
		return true;
	}
	return false;
}

function selectByValue(value) {
	$(value).each(function() {
		this.checked = true;
	});
}
function cancelSelectByValue(value) {
	$(value).each(function() {
		this.checked = false;
	});
}

function resetQuantity(id, productId, message, moq) {
	$.ajaxSetup({
		async : false
	});
	var buyCount = parseInt($("#" + id).val());
	if (buyCount <= moq && message == "minus") {
		return;
	}
	$.post("/shoppingcat/ajax/getShoppingItemById", {
		productId : productId,
		buyCount : buyCount,
		message : message
	}, function(responseText, textStatus, XMLHttpRequest) {
		if (textStatus == 'success') {
			if (responseText.buyCount == -1) {
				alert("购买数量不能定于起订量");
				$("#" + id).val(responseText.moq);
			} else {
				$("#" + id).val(responseText.buyCount);
			}
			$("#price_" + id).text(responseText.priceTotal);
			updateBuyCount(id, $("#" + id).val());
			flushTotalPrice();
		}
	});
}

function updateBuyCount(id, buyCount) {
	$.post("/shoppingcat/ajax/updateBuyCount", {
		id : id,
		buyCount : buyCount
	}, function(responseText, textStatus, XMLHttpRequest) {
		if (textStatus == 'success') {
		}
	});
}

function flushTotalPrice() {
	var totalPrice = "";
	$(".price").each(function() {
		totalPrice = totalPrice + $(this).text() + ",";
	});
	$.post("/shoppingcat/ajax/plus", {
		totalPrice : totalPrice
	}, function(responseText, textStatus, XMLHttpRequest) {
		if (textStatus == 'success') {
			$("#totalPrice").text(responseText);
		}
	});
}

function resetShoppingItem(id, productId, buyCount) {
	$.post("/shoppingcat/ajax/enterBuyCount", {
		productId : productId,
		buyCount : buyCount
	}, function(responseText, textStatus, XMLHttpRequest) {
		if (textStatus == 'success') {
			if (responseText.buyCount == -1) { // 购买数量不是起订量的倍数
				alert("购买数量不是起订量的倍数");
				$("#" + id).val(responseText.moq);
			} else {
				$("#" + id).val(responseText.buyCount);
			}
			$("#price_" + id).text(responseText.priceTotal);
			updateBuyCount(id, $("#" + id).val());
			flushTotalPrice();
		}
	});
}

function enterQuantity(id, productId) {
	var buyCount = $("#" + id).val();
	if (buyCount == 0) {
		resetShoppingItem(id, productId, 0);
	} else if (buyCount.match(/^(-|\+)?\d+$/) == null) {
		resetShoppingItem(id, productId, 0);
	} else {
		resetShoppingItem(id, productId, buyCount);
	}
}

function submitShoppingcar() {
	// var buyCount = "";
	// $("[name=buyCount]").each(function(trindex,tritem){
	// buyCount = $(this).attr("id");
	// buyCount += ":";
	// buyCount += $(this).val();
	// buyCount += ",";
	// });
	// $("input[name='shoppingcar']").attr("value",buyCount);
	$("#shoppingForm").submit();
}
