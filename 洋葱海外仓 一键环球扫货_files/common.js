/** 
@Js-name:common.js
@Zh-name:通用JS函数
@Author:chen guojun
@Date:2015-05-28
 */
var msonionUrl, msPicPath;
var moblieReg =/^((\(\d{3}\))|(\d{3}\-))?1(3|4|5|7|8)\d{9}$/;
$(function(){
	//获取设定的网址路径与图片路径
	$.ajax({	 
		url : "js/common/base.json",
		type : "get",dataType:"json",async: false,		
        success:function(data){ 
			for(var i=0; i <data.pathUrl.length; i++){
			    msonionUrl = data.pathUrl[i].nionUrl;
			    msPicPath = data.pathUrl[i].PicPath;
			}
		}
    });

	var url = window.location.href;
	if(url.indexOf("login.html") < 0 && url.indexOf("alipay.html") < 0 && url.indexOf("addres-order.html") < 0&& url.indexOf("addres-add.html") < 0){
		var tmn = parsURL(url).params.tmn;
		if (tmn == null || tmn == "" || typeof(tmn) == undefined){
			url = parsURL(window.location.href).queryURL;
			tmn = parsURL(url).params.tmn;
			if(tmn == null || tmn == "" || typeof(tmn) == undefined){
				UsTips("缺少终端机号码");
				return ;
			}			
		}	
	}
});
function returnTmnNo(){
	var tmn = parsURL(window.location.href).params.tmn;
	if (tmn == null || tmn == "" || typeof(tmn) == undefined){
		url = parsURL(window.location.href).queryURL;
		tmn = parsURL(url).params.tmn;
	}
	return tmn;
}

//通用超链接跳转
function goUrl(url){
	if (url.indexOf("tmn=tmn") > 0) {
		url = url.replace("tmn=tmn","tmn="+returnTmnNo());
	}
	window.location.href = url;
}
/*地址加tmn参数 cjw*/
function goUrlByTmn(url){
	var ParHref = parsURL( window.location.href );
	var tmn = ParHref.params.tmn;
	if(tmn){
		if(url.indexOf("?")!=-1){
			url = url+"&tmn="+tmn;
		}else{
			url = url+"?tmn="+tmn;
		}
	} else {//如果不存在
		var url = parsURL(window.location.href).queryURL;
		tmn = parsURL(url).params.tmn;
		if(tmn){
			if(url.indexOf("?")!=-1){
				url = url+"&tmn="+tmn;
			}else{
				url = url+"?tmn="+tmn;
			}
		}
	}
	goUrl(url);
}

/**
 * 保留符点数后几位，默认保留两位
 * @param num 要格式化的数字
 * @param pos 要保留的位数,不传默认保留两位
 * @returns
 */
function formatNum(num,keep){
	// 默认保留两位
	keep = keep ? keep : 2;
	// 四舍五入
	var pnum = Math.round(num*Math.pow(10,keep))/Math.pow(10,keep);
	// 将四舍五入后的数字转为字符串
	var rounded = pnum.toString();
	// 检测小数点位置
	var len = rounded.indexOf('.');
	// 如果是整数，小数点位置为-1
	if(len<0){ len = rounded.length; rounded += '.'; }
	// 不足位数以零填充
	while(rounded.length<=len+keep){ rounded += '0'; }
	return rounded;
}
//判断是否为Zepto，并赋予不同点击事件
function isTap(){
	var isnavipub=navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i);
	var isVarfunpub=function(vfName){try{return"undefined"==typeof vfName? false : "function"==typeof eval(vfName)? true : true}catch(e){}return false};
	return isVarfunpub('Zepto') ? (isnavipub ? "tap" : "click") : "click";
}
//返回上一页面并涮新
function goBack(){
	if (window.history.length > 1) {
		window.history.go(-1);
		return true;
	}
	return false;
}
//tip提示弹窗
function UsTips(ShowTxt,zIndex){
	if(ShowTxt==''){var stxt="请输入内容！";}else{var stxt=ShowTxt;}
	if(zIndex=='' || zIndex==undefined){var zcen=10000;}else{var zcen=zIndex;}
	if($(".ustip").length<=0){
		var Showbox=$('<div class="ustip" style="z-index:'+zcen+';"><p>'+stxt+'</p><span class="tipclose" style="z-index:'+(zcen+5)+';">&times;</span></div>').appendTo(document.body);
	}else{return false;}
	$(".tipclose").on("click", function() { 
		$(Showbox).remove();
	});
	var setUers=setTimeout(function() { 
		$(Showbox).remove();
	}, 2500);
}
/**       
	对Date的扩展，将 Date 转化为指定格式的String       
	月(M)、日(D)、小时(D)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
          年(y或Y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)          
	formatDate(2006-07-02,"YYYY-MM-DD hh:mm:ss.S") ==> 2006-07-02 08:09:04.423       
	formatDate(2006-07-02,"YYYY-MM-DD hh:mm:ss") ==> 2009-03-10  20:09:04                
*/
function formatDate(dates,pattern){if(dates==undefined){dates=new Date()};if(Object.prototype.toString.call(dates)==="[object String]"){if(dates=="")dates=new Date();else dates=new Date(dates.replace(/-/g,"/"));}
var result=[],pattern=(pattern!=undefined||pattern!="")?pattern:"YYYY-MM-DD";while(pattern.length>0){RegExpObject.lastIndex=0;var matched=RegExpObject.exec(pattern);if(matched){result.push(patternValue[matched[0]](dates));pattern=pattern.slice(matched[0].length);}else{result.push(pattern.charAt(0));pattern=pattern.slice(1);}}
function toFixedWidth(value,length){var result="00"+value.toString();return result.substr(result.length-length);};var patternValue={YYYY:function(dates){return dates.getFullYear().toString();},MM:function(dates){return toFixedWidth(dates.getMonth()+1,2);},DD:function(dates){return toFixedWidth(dates.getDate(),2);},hh:function(dates){return toFixedWidth(dates.getHours(),2);},mm:function(dates){return toFixedWidth(dates.getMinutes(),2);},ss:function(dates){return toFixedWidth(dates.getSeconds(),2);},S:function(dates){return toFixedWidth(dates.getMilliseconds(),3);}};return result.join('');}
/*
	解析URL地址
	parsURL( url ).file;     // = 'index.html'  	
	parsURL( url ).hash;     // = 'top'  	
	parsURL( url ).host;     // = 'www.abc.com'  	
	parsURL( url ).query;    // = '?id=255&m=hello'  
	parsURL( url ).queryURL  // = 'id=255&m=hello' 	
	parsURL( url ).params;   // = Object = { id: 255, m: hello }  	
	parsURL( url ).prefix;   // = 'www'
	parsURL( url ).path;     // = '/dir/index.html'  	
	parsURL( url ).segments; // = Array = ['dir', 'index.html']  	
	parsURL( url ).port;     // = '8080'  	
	parsURL( url ).protocol; // = 'http'  	
	parsURL( url ).source;   // = 'http://www.abc.com:8080/dir/index.html?id=255&m=hello#top' 
 */	
function parsURL( url ) {  	
	var a =  document.createElement('a');  	
	a.href = url;  	
	return {  	
		source: url,	
		protocol: a.protocol.replace(':',''),	
		host: a.hostname,	
		port: a.port,  	
		query: a.search,
		queryURL:a.search.replace(/^\?/,''),
		params: (function(){  	
			var ret = {},seg = a.search.replace(/^\?/,'').split('&'),len = seg.length, i = 0, s;  	
			for (;i<len;i++) {  	
				if (!seg[i]) { continue; }  	
				s = seg[i].split('=');   ret[s[0]] = s[1];  	
			}  	
			return ret;  
		})(),  
		prefix: a.hostname.split('.')[0],
		file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1], 	
		hash: a.hash.replace('#',''),  	
		path: a.pathname.replace(/^([^\/])/,'/$1'),  	
		relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],  	
		segments: a.pathname.replace(/^\//,'').split('/')
	};  	
}
function dialogMsg(msg) {
    m.open({
        width: "60%",
        height: 200,
        content: "<p class='tc mt10 mb10 listinfo f20' style='width:100%'>" + msg + "</p>",
        closeBtn: [false, 1],
        btnName: ['确定'],
        btnStyle: ["color: #0e90d2;"],
        maskClose: false
    })
}
function myAccount(){	
	$.ajax({
        type : "post",
        url : msonionUrl+"menbercenter/memberInfo",
		dataType : "json",
		success:function(data){
			if(data.login_flag){
				if(data.memberrec.memberType == 2){//
					return
				} else if (data.memberrec.memberType == 3) {
					//dialogMsg("您是店主，请用微信端管理！谢谢！");
					return
				} else {
				    goUrl("home.html?tmn="+returnTmnNo());
				}
			}else{
				var fromurl = window.location.href;
				if (fromurl.indexOf("index.html") > 0){
					goUrl("login.html?"+fromurl.substring(0,fromurl.indexOf("index.html"))+"home.html?tmn="+returnTmnNo());
				} else{
				    goUrl("login.html?"+window.location.href);
				}
			}
		}
	});
}
function myShopCart(){
	$.ajax({
        type : "post",
        url : msonionUrl+"menbercenter/memberInfo",
		dataType : "json",
		success:function(data){
			if(data.login_flag){
				if(data.memberrec.memberType == 2){//
					//dialogMsg("对不起，洋葱商家无法使用本功能");
					return
				} else {
					goUrl("cart.html?tmn="+returnTmnNo());
				}
			}else{
				goUrl("login.html?"+window.location.href);
			}
		}
	});
}
$(function(){
	(function posMarpad(){
		var bod=$("body"), isMarg=bod.data("marpad"), fixtop=bod.data("fixtop"), fixbot=bod.data("fixbot");	
		var ftop="padding-top", fbot="padding-bottom";
		if(bod.data("marpad") || bod.data("padding")){ 
			if(fixtop){bod.css(ftop,fixtop);}
			if(fixbot){bod.css(fbot,fixbot);}
		}else{
			return false;
		}
	})();
	//判断ID是否存在，如果存在点击就返回上一页面并涮新
	if($("#goback").length > 0 ){
		$("#goback").on(isTap(),goBack );
	}
	//商品搜索内容
	if($("#headsosbox").length > 0 ){		
		var sosHtml='<div class="formalmask" id="formalmask" style="display:none;">'+
		'<div class="formaltab f16">'+
		'<span class="formalclose" id="formalclose"></span>'+
		'<ul>'+
		' <li class="on" data-tab="product">商品搜索</li>'+
		'</ul>'+
		'</div>'+
		'<div class="formalsosbox sosbg por">'+
		'<input name="productSearch" type="text" class="intext f18" id="formalSearchTxt" placeholder="请输入搜索关键字">'+
		'<span class="formalbtn f16 poa" id="formalbtn">搜索</span><i class="corss" id="corss"></i>'+
		'</div>'+
		'</div>', formBody = $("body");
		formBody.prepend( sosHtml );
		var formSos = $("#formalSearchTxt"), formMask = $("#formalmask");
		formSos.on('input cut focus keydown keyup paste blur',function(){
			var that=$(this), corss=$("#corss");
			if(that.val()!=""){
				corss.show();
				corss.on(isTap(),function(){ that.val(""); corss.hide(); })
			}else{
				corss.hide();
			}
		})

		$('#formalbtn').on(isTap(),function(){
        	var serString = formSos.val();  
        	var tmn = returnTmnNo();

        	if(serString == ''){
        		UsTips("请输入搜索关键字",15500);
        		return false;
        	}
        	if(!tmn || tmn == ''){
        		UsTips("缺少终端机号码");
        		return false;
        	}
        	var	sosurl=msonionUrl+'tmn/search-goods-list.html?tmn='+tmn+'&keywords='+encodeURI(encodeURI(serString));        	
        	goUrl(sosurl);
        });
		$('#headsosbox').on(isTap(),function(){
			formBody.css({overflow:"hidden"});
			formMask.show();
			formSos.focus();
		});
		$('#formalclose').on(isTap(),function(){
			formBody.css({overflow:""});
			formMask.hide();
			formSos.blur();
		});
	};
	if($("#navmore").length >0 && $("#navmorelist").length>0){
		var navlist = $("#navmorelist");
		navlist.after($('<div class="navmoremask dn" id="navmoremask"></div>'));
		var navmask = $("#navmoremask");
		$("#navmore").on(isTap(),function(){
			var postop = navlist.position().top;
			navmask.show();
			navlist.css({top:postop+$(this).height()+12,right:10})
			navlist.toggle();
		})
		navmask.on(isTap(),function(){
			if(navmask.is(":visible")){ navmask.hide(); }
			if(navlist.is(":visible")){ navlist.hide(); }
		})
		$(window).on("scroll",function(){
			if(navmask.is(":visible")){ navmask.hide(); }
			if(navlist.is(":visible")){ navlist.hide(); }
		})
	}
});
/**
 * 时间转换
 * @param date--单位毫秒
 * @returns {String}
 */
function formatDate(date){
	var date  = new Date(date);
return 	date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate() +" "+date.getHours()+":"+date.getSeconds()+":"+date.getMinutes();
}
