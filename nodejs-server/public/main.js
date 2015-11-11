In.ready('bootstrapjs3', 'bootstrapcss3', 'angular',
	'jquery',  'jquery-ui', 'bootstrap-jquery-ui-css-1.9.2',
	'jquery-highlighter', function() {
		var app = angular.module('myapp', []);
		app.controller('pnController', pnController);
		app.controller('mainController', mainController);
		var tr = "";
		var length = $("#tb").length;
		var templates = 0;
		var trs = 1;

		function mainController($scope, $http) {
			$scope.addtrs = function() {
				$scope.tr.push(trs++);
				changebtn(); 
				rows();
				$scope.trlength = $(".rows").length;
			};
			//默认是价格优势
			$scope.priceOption = "1";
			$scope.priceOptionChange = function(msg) {
				$scope.priceOption = msg
			}
			$scope.$on("changepnnumber", function(event, msg) {
				$scope.allnum = countnum(".pnnumber");
			})
			$scope.$on("addtrs", function(event) {
				setTimeout("addtrsfun()", 200);
			})
			$scope.trlength = $(".rows").length;

			$scope.hidtr = function(a) {
				var id = $(a).attr("id");
				$("#allimfor .maintr:eq(" + id + ")").remove();
				rows();
				changebtn()
			}



		}

		function pnController($scope, $http) {
			$scope.search = function(key) {
				search_s(key)
			}
			$scope.change = function(num) {
				$scope.$emit("changepnnumber", num);
			};
			$scope.getunitPrice = function(num) {
				var re = 0;
				if (isNaN(parseInt($scope.unitPrice))) {
					$scope.unitPrice = 0
				}
				if ($scope.mfs != null && $scope.mfs.length > 0) {

				} else {
					return re;
				}
				if ($scope.priceOption == "1") {
					re = 0.4
				} else if ($scope.priceOption == "digikey") {
					re = 0.91
				} else {
					re = 0.911
				}
				if (num > 100) {
					re = re - 0.1
				} else if (num > 200) {
					re = re - 0.2
				} else if (num > 200) {
					re = re - 0.2
				} else if (num > 400) {
					re = re - 0.3
				} else if (num > 600) {
					re = re - 0.4
				}
				$scope.unitPrice = re;
				return re;
			};
			$scope.load = function() {
				templates++;
				if (templates >= length) {
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
						select: function(event, ui) {
							$(this).val(ui.item.value);
							//通过ng的change时间刷新skey的值
							$(this).trigger("change");
							$(this).next().trigger("click");
						},
						minLength: 1
					});
				}
				rows();
			}

			function getsupplierprice(supplier, supplierId, pn) {
				$http.get('/getsupplierprice?supplierid=' + supplierId + '&pn=' + pn).success(function(data) {

					$scope["price"][supplier] = data;
					$scope[supplier] = data;
				});
			}

			function search_s(keys) {
				$scope.digikeylength = 0;
				$scope.mouserlength = 0;
				$scope.elementlength = 0;
				try {
					$http.get('/getmfsandpn?pn=' + keys).success(function(data) {
						$scope.mfs = data;
						$scope.mfslength = data.length;
						for (var i = 0; i < $scope.mfslength; i++) {
							var pn = $scope.mfs[i].pn;
							getsupplierprice("digikey", 93, pn);
							getsupplierprice("mouser", 94, pn);
							getsupplierprice("element", 96, pn);
							getsupplierprice("chip1stop", 91, pn);
						}

						$scope.$emit("addtrs");
						//读取玩信息之后 初始化价格 
						$scope.$emit("changepnnumber", 1);
					});
				} catch (e) {

				}
			}
		};
	});

function addtrsfun() {
	if ($(".maintr:last td:eq(5)").text().trim().length > 0) {
		$(".addtr").trigger("click");
	}
}

function hidtr(a) {
	var id = $(a).attr("id");
	if ($(".rows").length > id) {
		$("#allimfor .maintr:eq(" + id + ")").remove();
		rows();
	}
}

function rows() {
	$(".rows").each(function(index, item) {
		$(item).html(index + 1);
	})
}

function changebtn() {
	$(".parse").each(function(index, item) {
		if (!$(item.classList[0]).is(".visible")) {
			$(item).hide();
			$("#parse_" + index).show();
		}
	})
}

function countnum(obj) {
	var re = 0
	for (var i = 0; i < $(obj).length; i++) {
		if (!isNaN(parseInt(jQuery($(obj).get(i)).val()))) {
			re = re + parseInt(jQuery($(obj).get(i)).val())
		} else {

		}
	}
	return re;
}