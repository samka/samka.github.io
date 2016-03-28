// JavaScript Document
;(function ($) {	
	$.fn.goTops = function(options) {
		var defaults = {
			endY: navigator.userAgent.match(/(Android)/i) ? 1 : 0,
			toBtnCell:"#ontoBtn",	
			direction:"right",		
			showHeight : $(window).height()/2,
			posLeft:10,
			posRight:10,
			posBottom:55,
			duration: 200,
			zIndex:200,
			callback:null
		};
		var opts = $.extend(defaults,options);
		var interpolate = function (source, target, shift) {  return (source + (target - source) * shift); };	  
		var easing = function (pos) { return (-Math.cos(pos * Math.PI) / 2) + .5; };	  
		var gotoanim = function() {
			if (opts.duration === 0) {
				window.scrollTo(0, opts.endY);
				if (typeof opts.callback === 'function'){ opts.callback()};
				return;
			}	  
			var startY = window.pageYOffset, startT = Date.now(), finishT = startT + opts.duration;	  
			var goanimate = function() {
				var now = Date.now(), shift = (now > finishT) ? 1 : (now - startT) / opts.duration; 
				window.scrollTo(0, interpolate(startY, opts.endY, easing(shift)));	  
				if (now < finishT) {
				    setTimeout(goanimate, 15);
				}else {
				    if (typeof opts.callback === 'function'){ opts.callback()};
				}
			};	
			goanimate();
		};
		return this.each(function () {
			var that = $(this), tobtn = $(opts.toBtnCell);
			var navappVer=navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i);
			var isVarfun=function(vfName){try{return"undefined"==typeof vfName? false : "function"==typeof eval(vfName)? true : true}catch(e){}return false};
			var isDirec = (opts.direction=="right") ? {right:opts.posRight}:{left:opts.posLeft};
			tobtn.css({'z-index':opts.zIndex,position:"fixed",display:"none",bottom:opts.posBottom}).css(isDirec);
			that.on("scroll", function(){
				var scrolltop = $(this).scrollTop();		
				if(scrolltop >= opts.showHeight){				
					tobtn.css({display:"block"});
				}else{
					tobtn.css({display:"none"});
				}
			});	
			var isZeJq = isVarfun('Zepto') ? (navappVer ? "tap" : "click") : "click";
			tobtn.on(isZeJq, function(){
				gotoanim();	
			});
		})
	}
})(window.jQuery||window.Zepto||window.$);