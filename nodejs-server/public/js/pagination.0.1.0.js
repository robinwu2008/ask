(function($) {
	$.fn
		.extend({
			// 插件名称
			pagination: function(options) {
				var defaults = {
					pageset: 'page=',
					aPage: 10,
					othershowarea: ""
				};
				var options = $.extend(defaults, options);
				return this
					.each(function() {
						var obj = $(this);
						var head = obj.find('tr:eq(0)');
						var col = 0;
						head.find("th").each(
							function() {
								if (!isNaN(Number($(this).attr(
									"colspan")))) {
									col = col + Number($(this).attr(
										"colspan"));
								} else {
									col = col + 1;
								}
							});
						head.find("td").each(
							function() {
								if (!isNaN(Number($(this).attr(
									"colspan")))) {
									col = col + Number($(this).attr(
										"colspan"));
								} else {
									col = col + 1;
								}
							});

						obj.find("tfoot").remove();
						var pageString = pages();
						obj
							.append(' <tfoot><tr><td colspan="' + col + '"  style="text-align: right;"> <div class="pagination" style="font-size: 12px;">' + pageString + ' </div></td></tr></tfoot>');
						var othershowarea = options.othershowarea;

						var str = new Array();
						str = othershowarea.split(",");
						for (var j = 0; j < str.length; j++) {
							$(str[j]).html(pageString);
						}

						function pages() {
							allp = Number(options.allpage);
							aPage = Number(options.aPage);
							if (isNaN(allp)) {
								allp = 1;
							}
							if (isNaN(aPage)) {
								aPage = 12;
							}
							if (aPage < 12) {
								aPage = 12;
							}
							p = "<ul>";
							p = p + '<li class="prev  "><a href="' + alink(1) + '">首页</a></li>'
							p = p + '<li class="prev ' + isDisplay(Number(nowpage()) - 1) + '"><a href="' + alink(Number(nowpage()) - 1) + '">&lt; 前一页</a></li>';
							if (allp <= aPage) {
								// 总页数小于aPage的时候 全部显示
								for (var i = 1; i <= allp; i++) {
									p = p + page(i);
								}
							} else {
								// 显示至少2页

								if (Number(nowpage()) < 6) {
									for (var i = 1; i < 6; i++) {
										p = p + page(i);
										if (Number(nowpage()) == 5 && i == 5) {
											p = p + page(6);
										}
									}
									p = p + '<li class="disabled"><a  >...</a></li>';
									p = p + page(allp - 2) + page(allp - 1) + page(allp);
								} else if (Number(nowpage()) >= 6 && Number(nowpage()) + 5 <= allp) {
									p = p + page(1) + page(2);
									p = p + '<li class="disabled"><a  >...</a></li>';

									p = p + page(Number(nowpage()) - 2);
									p = p + page(Number(nowpage()) - 1);
									p = p + page(Number(nowpage()));
									p = p + page(Number(nowpage()) + 1);
									p = p + page(Number(nowpage()) + 2);
									p = p + '<li class="disabled"><a  >...</a></li>';
									p = p + page(allp - 2) + page(allp - 1) + page(allp);
								} else {
									p = p + page(1) + page(2);
									p = p + '<li class="disabled"><a  >...</a></li>';

									for (var i = allp - 5; i <= allp; i++) {
										p = p + page(i);
										if (Number(nowpage()) == 5 && i == 5) {
											p = p + page(6);
										}
									}

								}
							}
							p = p + '<li class="next ' + isDisplay(Number(nowpage()) + 1) + '"><a href="' + alink(Number(nowpage()) + 1) + '">下一页 &gt;</a></li>'
							p = p + '<li class="prev "><a href="' + alink(allp) + '">尾页</a></li>';
							p = p + "</ul>";
							return p;
						}

						function page(number) {
							return '<li class="' + isactive(number) + '"><a href="' + alink(number) + '">' + number + '</a>'
						}

						function page1() {
								return '<li class="' + isactive(number) + '"><a href="' + alink(1) + '">首页 </a>'
							}
							// 检查连接是否可用

						function isactive(number) {
								// 如果成功（是不可用的）则返回一个disabled
								if (nowpage() == number) {
									return "  active"
								} else {
									return ""
								}
							}
							// 检查连接是否可用

						function isDisplay(number) {
								// 如果成功（是不可用的）则返回一个disabled
								if (nowpage() == number || Number(number) > Number(options.allpage) || Number(number) <= 0) {
									return "  disabled"
								} else {
									return ""
								}
							}
							// //返回a连接的地址

						function alink(pagenumber) {

							if (Number(pagenumber) < 1 || Number(pagenumber) > allp) {
								return "#";
							}
							var myhref = "";
							var rehref = "";
							// 获取当前连接
							myhref = window.location.pathname + window.location.search;

							rehref = "";
							pages = options.pageset;
							start = myhref.indexOf(pages);
							end = myhref.substring(start).indexOf("&");
							//有没有分页的参数
							if (start > 0) {
								//有
								if (end > 0) {
									rehref = myhref.substring(0, start) + myhref.substring(start + end) + "&" + pages + pagenumber;

								} else {
									rehref = myhref.substring(0, start) + pages + pagenumber;
								}
							} else {
								//alert(rehref);
								//没有分页，默认第一页
								if (myhref.indexOf("?") > 0) {
									//已经存在参数

									rehref = myhref + "&" + pages + pagenumber;

								} else {
									//没有参数
									rehref = myhref + "?" + pages + pagenumber;
								}
							}

							return rehref;
						}

						function nowpage() {
							now = 1;
							// 获取当前连接
							href = window.location.pathname + window.location.search;
							rehref = "";
							pages = options.pageset;
							start = href.indexOf(pages);
							end = href.substring(start).indexOf("&");
							if (start > 0) {
								if (end > 0) {
									now = href.substring(start,
										start + end).replace(pages,
										"");
								} else {
									now = href.substring(start)
										.replace(pages, "");
								}
							} else {
								now = 1;
							}
							return now;
						}
					});
			}
		});
})(jQuery);