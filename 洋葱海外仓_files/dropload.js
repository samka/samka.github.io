// JavaScript Document
;(function ($) {
	$.fn.dropload = function(options) {
		var config = {
			wrapCell: '',
			loadDatafun: null,
			afterDatafun: null
        };
        var opts = $.extend(config, options);
		return this.each(function() {
			var that=$(this);
			var page = opts.page;
            var pagesize = opts.pagesize;
			if($.isFunction(opts.loadDatafun) || opts.loadDatafun !=('' || null)){
				opts.loadDatafun && opts.loadDatafun();		
			}else{
				opts.afterDatafun && opts.afterDatafun();
			}
            that.on("scroll", function() {update(); })

			function inviewport(obj) {			
				var objscrTop = $(obj).scrollTop(), 
				objHeight = $(obj).height(),
				wrapCls= (opts.wrapCell=="" || opts.wrapCell==null) ? $(document): $(opts.wrapCell),
				doscH = wrapCls.height(),
				myLoadCon=(objscrTop + objHeight) >= doscH;
				return myLoadCon;
			};
			
			function update() {
				var isStop=true;
                if(isStop && inviewport(that)){  
                	isStop=false;
		            clearTimeout(ST);
                    var ST = setTimeout(function() {
					    if($.isFunction(opts.afterDatafun) || opts.afterDatafun !=('' || null)){
						    opts.afterDatafun && opts.afterDatafun();
					    }					    
					}, 1000);
				}
			};
			
		});	
	};
})(window.jQuery || window.Zepto || window.$);