/***
 * 
 * 新版分页(兼容TABLE&&非TABLE)
 * 使用方法见引用该JS的功能
 * 2013年9月29日16:32:40
 * duqing
 * 
 */

(function($) {
	$.fn.extend({
				// 插件名称
				pagination : function(options) {
					var defaults = {
						// 总页数
						pageCount : 0,
						// 总记录数
						rowCount  : 0,
						// 当前页
						pageNo : 'pageNo',
						// 最大显示
						maxPage : 10,
						// 默认显示及中间条数
						num_display_entries : 5 ,
						// 边缘个数
						num_edge_entries : 2 ,
						
						// ----POST 请求----START  
						// 请求类型 (get||post) 
						reqType : "get" , 
						post_form_id : "#manageForm" , 
						// ----POST 请求----	END   
						
						// 附加到除了当前对象的某个元素  appendTarget : "id , id"
						appendTarget : ""
					}; 
					var options = $.extend(defaults, options);
					return this.each(function() {
						// 无数据则不做分页
						if(options.pageCount == 1 ){
							return ;  
						}
						obj = $(this); 
						// 生成分页代码
						var pageObj = pages();
						// 分页代码样式
						pageDiv =' <div class="pagination"> ' + pageObj + '</div>';
						// 追加分页到目标元素
						appendTargets();
						
						// 追加分页到目标元素
						function appendTargets(){
							tagName = obj[0].tagName;
							// 追加当前对象
							appendTargetThis();
							// 追加其他对象
							appendTargetOther();
						}
						
						// 分页追加到其他对象
						function appendTargetOther(){
							var appendObj = new Array();
							appendObj = options.appendTarget.split(",");
							if (options.appendTarget == null
									|| options.appendTarget == ""
									|| appendObj == null
									|| appendObj == "") {
								return;
							}
							for ( var i = 0; i < appendObj.length; i++) {
								$('#' + appendObj[i]).html(pageDiv);
							}
						}
						
						// 分页追加到当前对象
						function appendTargetThis(){
							if("TABLE" == tagName){
								var col = 0;
								var head = obj.find('tr:eq(0)');
								head.find("th").each(
										function() {
											if (!isNaN(Number($(this).attr("colspan")))) {
												col = col+ Number($(this).attr("colspan"));
											} else {
												col = col + 1;
											}
										});
								head.find("td").each(
										function() {
											if (!isNaN(Number($(this).attr("colspan")))) {
												col = col+ Number($(this).attr("colspan"));
											} else {
												col = col + 1;
											}
										});

								obj.find("tfoot").remove();
								var tfoot = '<tfoot><tr><td colspan="' + col + '" style="text-align: right;">'  ;
								tfoot += pageDiv; 
								tfoot += '</td></tr></tfoot>'; 
								obj.append(tfoot);
							}else {
								obj.append(pageDiv);
							}	
						}
						

						// 生成分页显示规则代码
						function pages() {
							// 初始化相关
							pageInit();
							// 前部分
							pagePrev();
							// 总页数小于maxPage的时候 全部显示
							if (pageCount <= maxPage) {
								for ( var i = 1; i <= pageCount; i++) {
									p += page(i);
								}
							}
							// 总页数大于maxPage的时候 部分显示
							else {
								// 当前页小于默认显示个数 
								if (currentPageNo <= options.num_display_entries -1) {
									// 前段边缘
									for ( var i = 1; i <= options.num_display_entries ; i++) {
										p += page(i);
									}
									p += '<li class="disabled"><a  >...</a></li>';
									// 后段边缘
									for ( var z = options.num_edge_entries  ; z > 0 ; z--) {
										p += page( pageCount - z + 1 );
									}
								}
								// 当前页大于默认显示个数 并小于最右显示个数
								else if ((currentPageNo >= options.num_display_entries )
										&&currentPageNo <= pageCount - options.num_display_entries +1) {
									// 前段边缘
									for ( var i = 1; i <= options.num_edge_entries ; i++) {
										p += page(i); 
									}
									p += '<li class="disabled"><a  >...</a></li>';
									
									// 显示中间个数
									for ( var j = 0; j < options.num_display_entries ; j++) {
										var mPageNo = currentPageNo + j - parseInt(options.num_display_entries/2) ;
										p += page(mPageNo);
									}
									p += '<li class="disabled"><a  >...</a></li>';
									
									// 后段边缘
									for ( var z = options.num_edge_entries ; z > 0 ; z--) {
										p += page(pageCount - z + 1);
									}
								} 
								// 最后默认显示个数
								else {
									// 前段边缘
									for ( var i = 1; i <= options.num_edge_entries ; i++) {
										p += page(i);
									}
									p += '<li class="disabled"><a  >...</a></li>';
									// 后段边缘
									for ( var i = pageCount - options.num_display_entries +1 ; i <= pageCount; i++) {
										p +=  page(i);
									}
								}
							}
							
							// 后部分
							pageNext();
							return p;
						}

						// 初始化相关
						function pageInit(){
							pageCount = Number(options.pageCount);
							maxPage = Number(options.maxPage);
							rowCount = Number(options.rowCount);
							if (isNaN(pageCount)) {
								pageCount = 1;
							}
							if (isNaN(maxPage) || maxPage < 10 ) {
								maxPage = 10;
							}
							
							currentPageNo = 0 ;
							if (options.reqType == 'get') {
								currentPageNo = nowpage();
							}else {
								// 检查相关参数 
								var formAction = $(options.post_form_id).attr("action");
								if(formAction == null || formAction == "" || formAction == undefined){
									$(options.post_form_id).attr("action" , window.location.pathname);
								}
								$(options.post_form_id).attr("method" , "post");
								// 当前页
								var pageNoObj = $("input[name='"+options.pageNo+"']")[0]; 
								if(pageNoObj == undefined || pageNoObj == null){
									$(options.post_form_id).append('<input type="text" id="pageNo" name="' 
											+ options.pageNo + '" value="0" />');
								}
								currentPageNo = $("input[name='"+options.pageNo+"']").val();
							}
							if(isNaN(currentPageNo)){
								currentPageNo = 0 ;
							}
							currentPageNo = Number(currentPageNo);
							return currentPageNo ;
						}
						
						function page(number) {
							number = Number(number) ;
							return '<li class="' + isactive(number) + '"><a href="' + alink(number,this) + '">' + number + '</a>';
						}
						
						// 首页 前一页
						function pagePrev(){
							p  = "<ul>";
							p += '<li class="prev ' + showDisabled(currentPageNo - 1) + '"><a href="' + alink(1) + '">首页</a></li>' ;
							p += '<li class="prev ' + showDisabled(currentPageNo - 1) + '"><a href="' + alink(currentPageNo - 1,this)+ '">&lt; 前一页</a></li>';
						}
						
						// 尾页 后一页
						function pageNext() {
							p += '<li class="next ' + showDisabled(currentPageNo + 1) + '"><a href="' + alink(currentPageNo + 1,this) + '">下一页 &gt;</a></li>';
							p += '<li class="prev ' + showDisabled(currentPageNo + 1) + '"><a href="' + alink(pageCount) + '">尾页</a></li>';
							p += "</ul>";
						}
						
						// 检查连接是否可用
						function isactive(number) {
							// 如果成功（是不可用的）则返回一个disabled
							if (currentPageNo == number) {
								return "  active";
							} else {
								return "";
							}
						}
						
						// 设置是否可用样式（当前页或者前一页或者后一页）
						function showDisabled(number) {
							// 如果成功（是不可用的）则返回一个disabled
							number = Number(number) ;
							if (currentPageNo == number
									|| Number(number) > (Number(options.pageCount)-1)
									|| Number(number) < 1) {
								return "  disabled";
							} else {
								return "";
							}
						}
						
						// //返回a连接的地址
						function alink(pagenumber , obj) {
							pagenumber = Number(pagenumber) ;
							if(pagenumber <=1 && currentPageNo == 1){
								return "javascript:void(0)";
							}
							if(pagenumber >= pageCount && currentPageNo == pageCount){
								return "javascript:void(0)";
							}
							
							if (options.reqType == 'get') {
								var myhref = "";
								var rehref = "";
								// 获取当前连接
								myhref = window.location.pathname
										+ window.location.search;

								rehref = "";
								pages = options.pageNo +"=";
								start = myhref.indexOf(pages);
								end = myhref.substring(start).indexOf("&");
								// 有没有分页的参数
								if (start > 0) {
									// 有
									if (end > 0) {
										rehref = myhref.substring(0, start)
												+ myhref.substring(start
														+ end) + "&"
												+ pages + pagenumber;

									} else {
										rehref = myhref.substring(0, start)
												+ pages + pagenumber;
									}
								} else {
									// alert(rehref);
									// 没有分页，默认第一页
									if (myhref.indexOf("?") > 0) {
										// 已经存在参数

										rehref = myhref + "&" + pages
												+ pagenumber;

									} else {
										// 没有参数
										rehref = myhref + "?" + pages
												+ pagenumber;
									}
								}
								return rehref;
							}else{
								return "javascript:doPage('" + pagenumber + "','" + options.pageNo +"','" + options.post_form_id + "');";
							} 
						}
						
						function nowpage() {
							now = 1;
							// 获取当前连接
							href = window.location.pathname
									+ window.location.search;
							rehref = "";
							pages = options.pageNo + "=";
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


function doPage(pageNo, pageNoObj , formId){
	$("input[name='" + pageNoObj + "']").val(pageNo);
	$(formId).submit();
}