var tabStrip;
// 标记是否要slider
var haveSlider = false;
In.ready('web-user-info', 'addUrlToHref', 'addToFavorite', 'qegoo.pulldown',
		'kendo.common-qegoo.min', 'kendo.web.min', 'kendo.qegoo.min',
		'tablesorter', "index_single_search", "autoAjax", 'cookie',
		'jqueryadd2cart', function() {

			var ids = "";
			var update = 200;
			// 初始化tab
			$(document).ready(function() {
				tabStrip = $("#tabstrip").kendoTabStrip({
					animation : {
						open : {
							effects : "fadeIn"
						}
					}
				}).data("kendoTabStrip");

				// 开始刷新更新状态

				// setInterval(function() {
				// 	if (update > 0) {
				// 		$('[price_pid]').each(function() {
				// 			if (ids == "") {
				// 				ids = ids + $(this).attr("price_pid");
				// 			} else {
				// 				ids = ids + "," + $(this).attr("price_pid");
				// 			}
				// 		});
				// 		updatePrice(ids);
				// 		update = update - 1;
				// 	}
				// }, 5000);

				// 针对显示所有价格增加点击事件
				$("[price_pid]").each(function() {
					$(this).click(function() {
						$("#" + $(this).attr("price_pid")).find("tr").show();
						$(this).hide();
					});
				});
			});

		});

function updatePrice(ids) {
	if (ids != "") {
		$.post("/ajax/product/get_product_need_update", {
			ids : ids
		}, function(data) {
			$.each(data, function(index, b) {
				// 重置update的数值
				$($.parseHTML('.' + b)).attr("update", "0");
			});
			// 刷新开始刷新需要刷新库存和价格的
			$("[update='0']").autoAjax();
		}, "json");
	}

}

function appendTab(name, url, index) {
	var isopen = 0;
	var c = 0;
	$(".k-link").each(function(index) {
		c = c + 1;
	});
	if (c > 5) {
		for (var i = 1; i < c - 5; i++) {
			tabStrip.remove(i);
		}
	}
	$(".k-link").each(function(index) {
		if ($(this).text() == name) {
			isopen = 1;
			// 选中已经存在的tab
			tabStrip.select(index);
		}
	});
	if (isopen == 0) {
		// url 含有+需要特殊处理, 使用encodeURI 没办法转换+.所以需要此方法.
		url = url.replace(/\+/g, '%2B');
		$.get(url, function(data) {
			var maxamount = 10000;
			var maxString = data.split('<!--max')[1].replace('-->', "");
			maxamount = parseInt(maxString);
			if (maxamount == 0) {
				maxamount = 100;// 如果库存为100，为了防止价格组件出问题，限制最大值为100
			}

			tabStrip.append({
				text : name,
				content : data
			});
			selectNext();
			// 对页面上的内容绑定点击事件
			inqueryClick(index);
			// 这里开始对表单进行排序
			$(".table_product").tablesorter({
				headers : {
					0 : {
						sorter : false
					},
					1 : {
						sorter : false
					},
					4 : {
						sorter : false
					},
					5 : {
						sorter : false
					}
				}
			}).trigger("sorton", [ [ [ 3, 0 ], [ 2, 1 ] ] ]);
			resetZindex();
			initSlider(index, maxamount);
		});
	}

}
// 当值修改的时候，出发的事件
function sliderOnChange(e) {
	var trs;
	var nowamount;
	if (typeof (e) == "string") {
		nowamount = $("#input_" + e).val();
		// 检验nowamount是否是整数
		nowamount = parseInt(nowamount);
		if (isNaN(nowamount)) {
			nowamount = 1;
		}
		$("#input_" + e).val(nowamount);
		trs = $(".table_product_" + e).find("tr[price_list]");
	} else {
		trs = $("#" + $(tabStrip.select()).attr("aria-controls")).find(
				"tr[price_list]");
		nowamount = e.value;
	}
	// 清空错误的型号
	$(".errorP" + e).html("");
	$(".table_product2_" + e).hide();
	$(".table_product1_" + e).hide();
	// 记录trs长度，如果全部被隐藏需要将表头隐藏
	// var trslength=trs.size();
	var trsshow = 0;
	$.each(trs, function(index, value) {
		if ($(value).attr("price_list") != undefined) {
			var prices = eval($(value).attr("price_list"));
			var tempi = false;
			var tempc = 0;
			if (prices.length > 0) {
				for (var i = 0; i < prices.length; i++) {
					// 查找价格
					if (prices[i].amount != undefined) {
						if (prices[i].amount > nowamount) {
							// 当前数量小于起订量，上一个值就是当前价格 即：当前的tempc就是要找的内容
							tempi = true;// 标记一下，要找到的内容已经找到。
							if (tempi && tempc == 0) {
								// 上一个值不存在，就是无价格，隐藏
								$(value).hide();
							} else {
								$(value).show();
								trsshow = trsshow + 1;
								$(value).find("td:eq(3)").html(
										'<div class=" "  style="width: 100px;">'
												+ tempc + '</div>');
							}
						} else {
							// 当前数量小于起订量，价格是后面价格区间的
							if (!tempi) {// 如果价格还没有找到
								tempc = prices[i].price;
							}
						}
					} else {
						// 如果价格属性不存在，将本行隐藏，数据异常
						$(value).hide();
					}
				}
				if (!tempi && tempc == 0) {
					// 最终还是没有找到价格
					$(value).hide();
					// $(".errorP"+e).append("<tr>"+$(value).html()+"</tr>");
				}
				if (!tempi && tempc != 0) {
					// 最终找到价格
					$(value).show();
					trsshow = trsshow + 1;
					$(value).find("td:eq(3)").html(
							'<div class="  " style="width: 100px;">' + tempc
									+ '</div>');
				}
			}
		}
		if ($(value).find("td:eq(3)").text().trim() == "-") {
			$(value).hide();
		}

		// 这里确认是否找到价格,如果价格 不存在就是隐藏的。
		if ($(value).css('display') == "none") {
			var tempvalue = $(value).clone();
			tempvalue.find("td:eq(3)").html("-");
			// tempvalue.find("td:last").html("");
			tempvalue.find(".buy_lj_but").hide();
			tempvalue.find(".on").hide();

			$(".errorP" + e).append("<tr>" + tempvalue.html() + "</tr>");
			// 绑定点击事件

		} else {
			$(".table_product1_" + e).show();
		}

		// 检查是否存在错误的，不存在隐藏表头
		if ($(".errorP" + e).html().trim() == "") {
			$(".table_product2_" + e).hide();
		} else {
			$(".table_product2_" + e).show();
		}
	});

	$(".table_product").trigger("sorton", [ [ [ 3, 0 ], [ 2, 1 ] ] ]);
	resetZindex();
}
// 初始化一個slider
function initSlider(name, maxamount) {

	if (haveSlider) {
		name = ".rangeslider" + name;
		if (maxamount < 100) {
			maxamount = 100;
		}
		if (maxamount > 1000000) {
			maxamount = 1000000;
		}
		$(name).kendoSlider({
			change : sliderOnChange,
			min : 1,
			max : maxamount,
			smallStep : 1,
			largeStep : 10,
			value : 1
		});
	} else {
		$("#input_" + name).val(maxamount);
		sliderOnChange(name);
	}

}
// 选择最后一个tab
function selectNext() {
	// 删除button
	$('.close_list_box').remove();
	$(".k-link")
			.each(
					function(index) {
						// 再加button
						if (index > 0) {
							$(this)
									.html(
											$(this).html()
													+ '<button class="float_r m_l15 close_list_box"  onclick="removeTab('
													+ index + ')"></button>');
						}
					});
	tabStrip.select($(".k-link").size() - 1);
}
// 刪除当前的tab
function removeTab(i) {
	tabStrip.remove(i);
	selectNext();
}
// 隐藏多余的li
function hideDiv(obj) {
	var i = 0;
	$(obj + " li").each(function() {
		i = i + 1;
		if (i > 10) {
			$(this).hide();
		}
	});
	$(obj + "2").hide();
	$(obj + "1").show();
}
function showDiv(obj) {
	$(obj + " li").each(function() {
		$(this).show();
	});
	$(obj + "1").hide();
	$(obj + "2").show();
}
function clickModel(modelName) {
	modelName = modelName.replace('/', '_');
	modelName = modelName.replace(',', '_');
	var temp = $("." + modelName).attr("onclick");
	eval(temp);
}

function buyNow(modelUrl, domain, modelName) {
	var url = modelUrl;
	var domain = domain;
	var modelName = modelName;
	$.post(siteBaseUrl + "/logger/ajax/send", {
		url : url,
		domain : domain,
		modelName : modelName
	}, function(responseText, textStatus, XMLHttpRequest) {
		if (textStatus == 'success') {
			window.open(modelUrl);
		}
	});
}

function enterWeb(modelUrl, domain, modelName) {
	var url = modelUrl;
	var domain = domain;
	var modelName = modelName;
	$.post(siteBaseUrl + "/logger/ajax/send", {
		url : url,
		domain : domain,
		modelName : modelName
	}, function(responseText, textStatus, XMLHttpRequest) {
		if (textStatus == 'success') {
			window.open(modelUrl);
		}
	}); 
}

function deliveryTimeFunction(times) {
	if (times == "0") {
		return "立即发货";
	} else {
		return times + "天后发货";
	}
} 
function inventoryFunction(inventory){
	if(inventory ==-1){ 
		return "询问";
	}else{
		return inventory;
	}
}


function getChineseRegion(region) {
	var regionChineseMap = new Object();
	regionChineseMap.FUTC = '北美';
	regionChineseMap.FUTE = '欧洲';
	regionChineseMap.FUTA = '亚洲';
	regionChineseMap.JAPAN = '日本';
	regionChineseMap.CHINA = '国内';
	regionChineseMap.USA = '美国';
	regionChineseMap.HK = '香港';
	regionChineseMap.EU = '欧洲';
	regionChineseMap.AUS = '澳大利亚';
	regionChineseMap.UK = '英国';
	regionChineseMap.SINGAPORE = '新加坡';
	if(!regionChineseMap[region]){
		return region;
	}else{
		return regionChineseMap[region];
	}
}
 
