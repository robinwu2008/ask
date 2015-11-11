 
function qegooalert(e) {
	if (0 == $("#__qegoo_myModal").length) {
		printlnModelHtml();
	} 
	$("#__qegoo_myModal_p").html(e);
	$("#__qegoo_myModal").modal("show");

}
 
function alert(e) {
 	qegooalert(e); 
}
 
function printlnModelHtml() {
	var e = '<div class="modal fade" id="__qegoo_myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
	e += '<div class="modal-dialog">';
	e += '<div class="modal-content">';
	e += '<div class="modal-header">';
	e += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
	e += '<h4 class="modal-title" id="myModalLabel">温馨提示</h4>';
	e += "</div>";
	e += '<div class="modal-body">';
	e += '<p id="__qegoo_myModal_p">操作成功！</p>';
	e += "</div>";
	e += '<div class="modal-footer">';
	e += '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button> ';
	e += "</div>";
	e += "</div>";
	e += "</div>";
	e += "</div>";
	$("body").after(e); 
}
 