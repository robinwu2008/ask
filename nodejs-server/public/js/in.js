/*
 ********** In **********
 Project Home: http://injs.org

 Author: Guokai
 Gtalk: badkaikai@gmail.com
 Blog: http://benben.cc
 Licence: MIT License
 Version: 0.2.0-stable

 Philosophy: Just in time.
 Build: 110428120728


 2013年11月 开始修改。
 Author zuaa
 Email： zuaa@163.com



 */

~ function() {
	var __head = document.head || document.getElementsByTagName('head')[0];
	var __waterfall = {};
	var __loaded = {};
	var __loading = {};
	var __globals = [];
	var __configure = {
		autoload: false,
		core: '',
		serial: false
	};
	var __in;

	// mapping for `In.load`
	// This method used for loading javascript or
	// style files asynchronous and non-blocking.

	var __load = function(url, type, charset, callback) {
		if (__loading[url]) {
			if (callback) {
				setTimeout(function() {
					__load(url, type, charset, callback);
				}, 1);
				return;
			}
			return;
		}

		if (__loaded[url]) {
			if (callback) {
				callback();
				return;
			}
			return;
		}

		__loading[url] = true;

		var pureurl = url.split('?')[0];
		var n, t = type || pureurl.toLowerCase()
			.substring(pureurl.lastIndexOf('.') + 1);

		if (t === 'js') {
			n = document.createElement('script');
			n.type = 'text/javascript';
			n.src = url;
			// console.log(url, "被加载了");
			n.async = 'true';
			if (charset) {
				n.charset = charset;
			}
		} else if (t === 'css') {
			n = document.createElement('link');
			n.type = 'text/css';
			n.rel = 'stylesheet';
			n.href = url;
			__loaded[url] = true;
			__loading[url] = false;
			__head.appendChild(n);
			if (callback)
				callback();
			return;
		}

		n.onload = n.onreadystatechange = function() {
			if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
				__loading[url] = false;
				__loaded[url] = true;

				if (callback) {
					callback();
				}

				n.onload = n.onreadystatechange = null;
			}
		};

		n.onerror = function() {
			__loading[url] = false;

			if (callback) {
				callback();
			}

			n.onerror = null;
		}

		__head.appendChild(n);
	};

	// private method, analyze the dependency.
	// This is the core function for dependency management.

	var __analyze = function(array) {
		var riverflow = [];

		for (var i = array.length - 1; i >= 0; i--) {
			var current = array[i];

			if (typeof(current) === 'string') {
				if (!__waterfall[current]) {
					// console
					// && console.warn
					// && console.warn('In Error :: Module not found: '
					// + current);
					continue;
				}

				riverflow.push(current);
				var relylist = __waterfall[current].rely;
				if (relylist) {
					riverflow = riverflow.concat(__analyze(relylist));
				}
			} else if (typeof(current) === 'function') {
				riverflow.push(current);
			}
		}

		return riverflow;
	};

	// private method, serial process.
	// This method used for loading modules in serial.

	var __stackline = function(blahlist) {
		var o = this;

		this.stackline = blahlist;
		this.current = this.stackline[0];
		this.bag = {
			returns: [],
			complete: false
		};

		this.start = function() {
			if (typeof(o.current) != 'function' && __waterfall[o.current]) {
				__load(__waterfall[o.current].path,
					__waterfall[o.current].type,
					__waterfall[o.current].charset, o.next);
			} else {
				o.bag.returns.push(o.current());
				o.next();
			}
		};

		this.next = function() {
			if (o.stackline.length == 1 || o.stackline.length < 1) {
				o.bag.complete = true;
				if (o.bag.oncomplete) {
					o.bag.oncomplete(o.bag.returns);
				}
				return;
			}

			o.stackline.shift();
			o.current = o.stackline[0];
			o.start();
		};
	};

	// private method, parallel process.
	// This method used for loading modules in parallel.

	var __parallel = function(blahlist, callback) {
		var length = blahlist.length;
		var hook = function() {
			if (!--length && callback)
				callback();
		};

		if (length == 0) {
			callback && callback();
			return;
		};

		for (var i = 0; i < blahlist.length; i++) {
			var current = __waterfall[blahlist[i]];

			if (typeof(blahlist[i]) == 'function') {
				blahlist[i]();
				hook();
				continue;
			}

			if (typeof(current) === 'undefined') {
				console
					&& console.warn && console.warn('In Error :: Module not found: ' + blahlist[i]);
				hook();
				continue;
			}

			if (current.rely && current.rely.length != 0) {
				__parallel(current.rely, (function(current) {
					return function() {
						__load(current.path, current.type, current.charset,
							hook);
					};
				})(current));
			} else {
				__load(current.path, current.type, current.charset, hook);
			}
		}
	};

	// mapping for `In.add`
	// This method used for adding module.

	var __add = function(name, config) {
		if (!name || !config || !config.path)
			return;
		__waterfall[name] = config;
	};

	// mapping for `In.adds`
	// This method used for adding modules.

	var __adds = function(config) {
		if (!config.modules)
			return;

		for (var module in config.modules) {
			if (config.modules.hasOwnProperty(module)) {
				var module_config = config.modules[module];

				if (!config.modules.hasOwnProperty(module))
					continue;
				if (config.type && !module_config.type)
					module_config.type = config.type;
				if (config.charset && !module_config.charset)
					module_config.charset = config.charset;
				__add.call(this, module, module_config);
			}
		}
	};

	// mapping for `In.config`
	// This method used for change the default config.

	var __config = function(name, conf) {
		__configure[name] = conf;
	};

	// mapping for `In.css`
	// This method used for insert inline css to your page dynamically.

	var __css = function(csstext) {
		var css = document.getElementById('in-inline-css');

		if (!css) {
			css = document.createElement('style');
			css.type = 'text/css';
			css.id = 'in-inline-css';
			__head.appendChild(css);
		}

		if (css.styleSheet) {
			css.styleSheet.cssText = css.styleSheet.cssText + csstext;
		} else {
			css.appendChild(document.createTextNode(csstext));
		}
	};

	// mapping for `In.later`
	// This method used for loading modules delay time specified.

	var __later = function() {
		var args = [].slice.call(arguments);
		var timeout = args.shift();

		window.setTimeout(function() {
			__in.apply(this, args);
		}, timeout);
	};

	// mapping for `In.ready`
	// This method used for loading modules while domready.

	var __ready = function() {
		var args = arguments;

		__contentLoaded(window, function() {
			__in.apply(this, args);
		});
	};

	var __global = function() {
		var args = arguments[0].constructor === Array ? arguments[0] : [].slice
			.call(arguments);

		__globals = __globals.concat(args);
	};

	// mapping for `In`
	// This is the main function, also mapping for method `use`.

	var __in = function() {
		var args = [].slice.call(arguments);

		if (__globals.length) {
			args = __globals.concat(args);
		}

		if (__configure.serial) {
			if (__configure.core && !__loaded[__configure.core]) {
				args = ['__core'].concat(args);
			}

			var blahlist = __analyze(args).reverse();
			var stack = new __stackline(blahlist);

			stack.start();
			return stack.bag;
		}

		if (typeof(args[args.length - 1]) === 'function') {
			var callback = args.pop();
		}

		if (__configure.core && !__loaded[__configure.core]) {
			__parallel(['__core'], function() {
				__parallel(args, callback);
			});
		} else {
			__parallel(args, callback);
		}
	};

	// private method, contentLoaded.
	// This method used for domready.

	var __contentLoaded = function(win, fn) {
		var done = false,
			top = true,
			doc = win.document,
			root = doc.documentElement,
			add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
			rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
			pre = doc.addEventListener ? '' : 'on',
			init = function(
				e) {
				if (e.type == 'readystatechange' && doc.readyState != 'complete')
					return;
				(e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
				if (!done && (done = true))
					fn.call(win, e.type || e);
			},
			poll = function() {
				try {
					root.doScroll('left');
				} catch (e) {
					setTimeout(poll, 50);
					return;
				}
				init('poll');
			};

		if (doc.readyState == 'complete') {
			fn.call(win, 'lazy');
		} else {
			if (doc.createEventObject && root.doScroll) {
				try {
					top = !win.frameElement;
				} catch (e) {}
				if (top)
					poll();
			}

			doc[add](pre + 'DOMContentLoaded', init, false);
			doc[add](pre + 'readystatechange', init, false);
			win[add](pre + 'load', init, false);
		}
	}

	// private method, initialize.
	// This is a self-executing function while in.js loaded.

	void

	function() {
		var myself = (function() {
			var scripts = document.getElementsByTagName('script');
			return scripts[scripts.length - 1];
		})();

		var autoload = myself.getAttribute('autoload');
		var core = myself.getAttribute('core');
		var path = myself.getAttribute('path');
		if (core) {
			__configure['autoload'] = eval(autoload);
			__configure['core'] = core;
			__add('__core', {
				path: __configure.core
			});
		}
		if (path) {
			__configure['path'] = path;
		}
		// autoload the core files
		if (__configure.autoload && __configure.core) {
			__in();
		}
	}();

	// Bind the private method to in.
	__in.add = __add;
	__in.adds = __adds;
	__in.config = __config;
	__in.css = __css;
	__in.later = __later;
	__in.load = __load;
	__in.ready = __ready;
	__in.global = __global;
	__in.use = __in;

	this.In = __in;
	// /////////////////////////////////////////////////////////////////////
	var __mykey = "qegoo.cn";
	var __isdev = true;
	var __href = window.location.href;
	// 检测当前环境是什么 开发或者测试
	if (__href.indexOf(__mykey) > 0) {
		__isdev = false;
	}
	In.add('jquery', {
		path: '/js/jquery.min.1.10.2.js',
		type: 'js'
	});

	In.add('validation1.11.1', {
		path: '/js/jquery.validate.min.1.11.1.js',
		type: 'js',
		rely: ['jquery']
	});
	In.add('validationcss', {
		path: '/css/validation.min.css',
		type: 'css'
	});
	In.add('validation', {
		path: '/js/validation.min.1.0.0.js',
		type: 'js',
		rely: ['jquery', 'validationcss']
	});

	In.add('selectActive', {
		path: '/js/selectActive.min.js',
		type: 'js',
		rely: ['jquery']
	});
	In.add('add2cart', {
		path: '/js/add2cart.min.js',
		type: 'js',
		rely: ['jquery']
	});
	In.add('jqueryadd2cart', {
		path: '/js/jqueryadd2cart.js',
		type: 'js',
		rely: ['jquery']
	});
	In.add('jquery-ui', {
		path: '/js/jquery-ui.min.js',
		type: 'js',
		rely: ['jquery']
	});

	In.add('tablesorter', {
		path: '/js/jquery.tablesorter.min.js',
		type: 'js',
		rely: ['jquery']
	});

	// /////////////////css
	In.add('jquery-ui-css', {
		path: '/css/jquery-ui.min.css',
		type: 'css'
	});
	In.add('bootstrap-jquery-ui-css-1.9.2', {
		path: '/css/jquery-ui-1.9.2.custom.css',
		type: 'css'
	});
	In.add('bootstrapcss', {
		path: '/css/bootstrap.2.3.2.css',
		type: 'css'
	});
	In.add('bootstrapjs', {
		path: '/js/bootstrap.min.2.3.2.js',
		type: 'js'
	});
	In.add('bootstrapcss3', {
		path: '/js/bootstrap.3.0.3/css/bootstrap.min.css',
		type: 'css'
	});
	In.add('bootstrapjs3', {
		path: '/js/bootstrap.3.0.3/js/bootstrap.min.js',
		type: 'js',
		rely: ['jquery']
	});

	In.add('pagination', {
		path: '/js/pagination.js',
		type: 'js',
		rely: ['jquery']
	});
	In.add('pagination.0.1.0', {
		path: '/js/pagination.0.1.0.js',
		type: 'js',
		rely: ['jquery']
	});
	In.add('cookie', {
		path: '/js/jquery.cookie.js',
		type: 'js',
		rely: ['jquery']
	});
	In.add('alert', {
		path: '/js/qegoo.alert.js',
		type: 'js',
		rely: ['bootstrapjs3', 'bootstrapcss3', 'jquery']
	});
	In.add('qegoo.pulldown', {
		path: '/js/qegoo.pulldown.js',
		type: 'js',
		rely: ['jquery']
	});

	In.add('web-user-info', {
		path: '/js/qegoo.web-user-info.dev.js',
		type: 'js',
		rely: ['jquery']
	});

	In.add('index_single_search', {
		path: '/js/qegoo.index_single_search.js',
		type: 'js',
		rely: ['jquery']
	});

	In.add('DD_belatedPNG', {
		path: '/js/DD_belatedPNG_0.0.8a.min.js',
		type: 'js',
		rely: ['jquery']
	});

	In.add('json', {
		path: '/js/jquery.json.min.js',
		type: 'js',
		rely: ['jquery']
	});

	In.add('addUrlToHref', {
		path: '/js/addUrlToHref.js',
		type: 'js',
		rely: ['jquery']
	});

	In.add('autoAjax', {
		path: '/js/autoAjax.js',
		type: 'js',
		rely: ['jquery']
	});
	In.add('migrate', {
		path: '/js/jquery-migrate-1.2.1.min.js',
		type: 'js'
	});
	In.add('addToFavorite', {
		path: '/js/qegoo.addFavorite.js',
		type: 'js',
		rely: ['jquery']
	});

	In.add('qegoo.register', {
		path: '/js/qegoo.register.js',
		type: 'js',
		rely: ['jquery']
	});
	In.add('qegoo.changebrand', {
		path: '/js/qegoo.changebrand.js',
		type: 'js',
		rely: ['jquery']
	});
	In.add('shoppingcart', {
		path: '/js/qegoo.shoppingcart.js',
		type: 'js',
		rely: ['jquery']
	});
	In.add('order', {
		path: '/js/qegoo.order.js',
		type: 'js',
		rely: ['jquery']
	});

	In.add('search', {
		path: '/js/qegoo.search.js',
		type: 'js',
		rely: ['jquery', 'kendo.common-qegoo.min', 'kendo.web.min',
			'kendo.qegoo.min', 'tablesorter'
		]
	});
	In.add('kendo.web.min', {
		path: '/js/kendo.web.min.js',
		type: 'js',
		rely: ['jquery']
	});
	In.add('kendo.culture.zh-CN.min', {
		path: '/js/kendo.culture.zh-CN.min.js',
		type: 'js'
	});

	In.add('kendo.default.min', {
		path: '/css/kendo.default.min.css',
		type: 'css'
	});

	In.add('kendo.rtl.min', {
		path: '/css/kendo.rtl.min.css',
		type: 'css'
	});
	In.add('kendo.common.min', {
		path: '/css/kendo.common.min.css',
		type: 'css'
	});

	In.add('kendo.qegoo.min', {
		path: '/css/kendo.qegoo.css',
		type: 'css'
	});
	In.add('kendo.common-qegoo.min', {
		path: '/css/kendo.common-qegoo.css',
		type: 'css'
	});
	In.add('templatemo_main', {
		path: '/css/templatemo_main.css',
		type: 'css',
		rely:["bootstrapcss3"]
	});
	In.add('kendo.bootstrap.min', {
		path: '/css/kendo.bootstrap.min.css',
		type: 'css'
	});
	In.add('kendo.common-bootstrap.min', {
		path: '/css/kendo.common-bootstrap.min.css',
		type: 'css'
	});

	In.add('qegoo.catalog', {
		path: '/js/qegoo.catalog.js',
		type: 'js',
		rely: ['json']
	});

	In.add('qegoo.inquiry', {
		path: '/js/qegoo.inquiry.js',
		type: 'js',
		rely: ['json', 'cookie']
	});

	In.add('qegoo.productdetail', {
		path: '/js/productdetail.js',
		type: 'js',
		rely: ['jquery']
	});

	In.add('jquery-validation.jquery', {
		path: '/js/jquery-validation/lib/jquery.js',
		type: 'js',
		rely: ['jquery']
	});
	In.add('jquery-validation.jquery.validate', {
		path: '/js/jquery-validation/dist/jquery.validate.js',
		type: 'js',
		rely: ['jquery']
	});

	In.add('jquery-jfeed', {
		path: '/js/jquery.jfeed.js',
		type: 'js',
		rely: ['jquery', 'migrate']
	});

	In.add('jquery-jGFeed', {
		path: '/js/jquery.jGFeed.js',
		type: 'js',
		rely: ['jquery', 'migrate']
	});
	In.add('qegoo-news', {
		path: '/js/qegoo.news.rss.js',
		type: 'js'
	});
	In.add('qegoo-reload', {
		path: '/js/qegoo.reload.js',
		type: 'js'
	});
	In.add('mustache', {
		path: '/js/mustache.js',
		type: 'js'
	});
	In.add('qegoo-autoload', {
		path: '/js/qegoo-autoload.js',
		type: 'js'
	});
	In.add('qegoo-showmore', {
		path: '/js/qegoo/qegoo.showmore.js',
		type: 'js'
	});
	In.add('templatemo_script', {
		path: '/js/templatemo_script.js',
		type: 'js'
	});
	In.add('jquery-highlighter', {
		path: '/js/jquery.highlight.js',
		type: 'js',
		rely: ['jquery']
	});
	In.add('qegoo.updatebrand.js', {
		path: '/js/qegoo.updatebrand.js',
		type: 'js',
		rely: ['jquery', 'jquery-ui', 'bootstrap-jquery-ui-css-1.9.2']
	});
	In.add('angular', {
		path: '/js/angular-1.3.0-rc.2/angular.min.js',
		type: 'js'
	});
	In.add('autoComplete', {
		path: '/js/autoComplete.js',
		type: 'js',
		rely: ['jquery','jquery-ui', 'bootstrap-jquery-ui-css-1.9.2']
	});

	function initin(js_name) {
		var args = js_name;
		var fullName = null;
		var v_path = null;
		var v_type = null;
		var v_rely = null;
		if (typeof(args) == "function") {
			var v_name = args.split(":");
			if (v_name[0] == "css") {
				fullName = "'" + v_name[1] + "'";
				v_type = 'css';
				v_path = '/css/' + v_name[1] + "/" + v_name[2] + "'";
			} else {
				if (v_name[1].contains("jquery")) {
					v_rely = 'jquery';
				}
				fullName = "'" + v_name[1] + "'";
				v_path = '/js/' + v_name[1] + "/" + v_name[2] + "'";
				v_type = 'js';
			}
		}
		if (v_rely == null) {
			In.add(fullName, {
				path: v_path,
				type: v_type,
			});
		} else {
			In.add(fullName, {
				path: v_path,
				type: v_type,
				rely: v_rely,
			});
		}
	}



}();