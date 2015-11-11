/**
 * 在指定的对象属性后增加一个url的参数 
 * 使用方法    model='addUrlTohref'  
 * 对需要增加的标签增加这个属性
 */
(function($) {
	$.fn.extend({
		// 插件名称
		addUrlToHref : function(options) {
			var defaults = {

			};
			var options = $.extend(defaults, options);
			return this.each(function() {
				var o = options;
				var obj = $(this);
				// 获取当前页面的url
				var href = window.location.href; 
				if (href.indexOf("url=") > 0) {
					// do nothing
				} else {
					 
					if (obj.attr("href").indexOf("?") > 0) {
						obj.attr("href",obj.attr("href") + "&url=" + href)  ;
					} else {
						obj.attr("href",obj.attr("href") + "?url=" + href);
					}
				}
			});
		}
	});
})(jQuery);

$(document).ready(function() {
	$("[model='addUrlTohref']").addUrlToHref();
});
