/**
 * 插件是针对input输入框中的数字，进行微调，或者按照执行的阶梯数字进行调整值。
 * 
 * 
 * 参数说明： input 中必须设定 min="数字" max ="数字" step阶梯价格
 * 可选择，格式如下，依英文字符逗号“,”分开：“数字,数字,数字,数字” <button class="btn btn-mini btn- "
 * target="btn-1" type="button">-</button>
 * 
 * <input class="input-mini input-price btn-1" type="text" max="10000000"
 * min="10" step="1,10,20,50,100,1000,10000,100000,1000000"> 调用
 * $(".btn1").plusminus({add : true|false（true是加法，阶梯数字正序，false是减法，阶梯价格倒叙） });
 * 例子： input是10 阶梯价格是 1，5，6，10，20，100 那么加一之后是20 减一之后是6 如果没有设置阶梯价格默认是加减一
 * ，但是最终的数字不会超过 设定的最大值最小值
 * 
 * 会在 包含样式 “ btn1” 的元素上绑定点击事件。按照
 * 
 * initFn 是用来做其他动作，当点击事件完成之后执行次回调函数
 * 
 */
(function($) {
	$.fn.extend({
		// 插件名称
		plusminus : function(options) {
			// 参数和默认值
			var defaults = {
				add : true,
				initFn : null
			// 用来标记是不是加法
			};
			var options = $.extend(defaults, options);

			return this.each(function() {
				var o = options;
				// 将元素集合赋给变量 本例中是 ul对象
				var obj = $(this);
				obj.click(function() {
					// 需要用目标中的属性来标志，数量的最大值与最小值，如果数量增加是阶梯，也需要有对应属性
					// 获取当前的值
					var l1 = Number($("." + obj.attr("target")).val());
					var min = Number($("." + obj.attr("target")).attr("min"));
					var max = Number($("." + obj.attr("target")).attr("max"));
					var step = $("." + obj.attr("target")).attr("step");
					if (isNaN(l1)) {
						// alert("数字非法");
						if (isNaN(min)) {
							l1 = 1;
						} else {
							l1 = min;
						}
					} else {
						// l1=l1+step;.
						// 确认加紧的数量
						// 对了进行加减

						if (step == "" || step == null) {
							if (o.add) {
								l1 = l1 + 1;
							} else {
								l1 = l1 - 1;
							}
						} else {
							var s = step.split(",");
							temp = 0;
							if (o.add) {
								for ( var i = 0; i < s.length; i++) {
									if (!isNaN(Number(s[i]))) {
										if (l1 < Number(s[i])) {
											if (temp == 0) {
												l1 = Number(s[i]);
												temp = 1;
											}
										}
									}
								}
							} else {
								for ( var i = s.length; i >= 0; i--) {
									if (!isNaN(Number(s[i]))) {
										if (l1 > Number(s[i])) {
											if (temp == 0) {
												l1 = Number(s[i]);
												temp = 1;
											}
										}
									}
								}
							}
						}
						if (l1 < min) {
							l1 = min;
						} else {
							if (l1 > max) {
								l1 = max;
							}
						}
					}
					// 修改数量
					$("." + obj.attr("target")).val(l1);
					//获取焦点
					$("." + obj.attr("target")).focus();
					$("." + obj.attr("target")).blur();
					  // 引用回调函数
					  if (typeof o.initFn == 'function') { // 确保类型为函数类型
					        o.initFn.call(this); // 执行回调函数
					  }
				});
				// 对目标做一个失去焦点的验证，如果失去焦点之后，检测是否是整数，不是则强制转为最小值
				$("." + obj.attr("target")).blur(function() {
					// alert("这里要检查是不是数字");
					val = $("." + obj.attr("target")).val() ;
					min = Number($("." + obj.attr("target")).attr("min"));
					
					var re = /^[1-9]+[0-9]*]*$/;   //判断正整数 /^[1-9]+[0-9]*]*$/   
				     if (!re.test(val))
				    {  
				    		$("." + obj.attr("target")).val(min);
				     } 
				     // 引用回调函数
					  if (typeof o.initFn == 'function') { // 确保类型为函数类型
					        o.initFn.call(this); // 执行回调函数
					  }
				});
			});
		}
	});
})(jQuery);