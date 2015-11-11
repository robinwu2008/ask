function AddToFavorite(sURL, sTitle) {
	try {
		window.external.addFavorite(sURL, sTitle);
	} catch (e) {
		try {
			window.sidebar.addPanel(sTitle, sURL, "");
		} catch (e) {
			alert("加入收藏失败，请使用Ctrl+D进行添加");
		}
	}
}
$(function() {
	// 优先显示nickname
	$(document).ready(
			function() {
				$(".addToFavorite").click(
						function() {
							AddToFavorite('QEGOO.cn-快易购电子元器件智能搜索、导购网站',
									'http://www.qegoo.cn/');
						});
				$(".addToFavorite").attr("href", "javascript:void(0)");
			});
});