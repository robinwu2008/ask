function initautoComplete() { 
	$("input[qegooautoComplete=auto]").autocomplete({
		autoFocus: false,
		position: {
			my: "left top",
			at: "left bottom"
		},
		source: function(request, response) {
			$.get($("input[qegooautoComplete=auto]").attr("dataUrl") + request.term,
				function(data) {
					response($.map(data, function(model) {
						return {
							label: model,
							value: model
						};
					}));
				}
			);
		},
		minLength: 1
	});
};
window.onload = function() {
	initautoComplete();
}