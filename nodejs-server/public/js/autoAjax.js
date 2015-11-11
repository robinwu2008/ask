/**
 * 这里自动ajax的插件
 * 主要功能是：通过autoAjax标志，检查所有需要进行异步获取数据的操作
 * 通过autoAjaxHref的url以及autoAjaxParam的参数发送异步请求。
 * 通过autoAjaxType确认返回的数据格式 json和html 默认为json
 * 并将结果（json数据），更新到autoAjaxData 对应的数据中。
 */
(function($) {
	$.fn.extend({
		autoAjax : function(options) {
			var defaults = {
				myname : "autoAjax",
                callback:""
			};
			var options = $.extend(defaults, options);
			return this.each(function() {
				//找到本标签中的ajaxHref 以及ajaxParam
				var autoAjaxHref = $(this).attr("autoAjaxHref");
				var thisAutoajax = $(this);

				$.post(autoAjaxHref, function(data) {
					if (data && data.id) {  
						thisAutoajax.find("[ajaxData]").each(function() {
							var funcvalue="";
							eval("funcvalue= data." + $(this).attr('ajaxData')  );
							var funcname="";
							eval("funcname=$(this).attr('ajaxDataFunction')");
							
							if(funcname!=""&&funcname!=undefined){ 
								eval("$(this).html("+funcname+"( funcvalue))"); 
							}else{
								eval("$(this).html(data." + $(this).attr('ajaxData') + ")");
							}
						});
					} else {
						//重新抓取。 
					}
				});

			});
		}
	});
})(jQuery);
 


