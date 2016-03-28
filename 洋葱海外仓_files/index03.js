/** 
@Js-name:index.js
@Zh-name:首页展示JS函数
@Author:chen guojun
@Date:2015-06-30
 */
var tmn = parsURL( window.location.href ).params.tmn;
//var tmn = parsURL( window.location.href ).file.replace('tmn','').replace('.html','');
var store_name = "洋葱海外仓";
$(function(){
	//首页焦点图
	//$("#pid48").attr("href","goods-list.html?tmn="+tmn+"&pid=48");
	//$("#pid49").attr("href","goods-list.html?tmn="+tmn+"&pid=49");
	//$("#pid50").attr("href","goods-list.html?tmn="+tmn+"&pid=50");
	//$("#pid51").attr("href","goods-list.html?tmn="+tmn+"&pid=51");
	//$("#pid_mord").attr("href","categorylist.html?tmn="+tmn);

	//首页产品列表
	var pageNum = 1;
	var totalPage = 1;
	var loadFlg = true;
	$(window).dropload({afterDatafun: listData});
	
	function listData() {
		$('.lazy').lazyload({placeAttr:"dataimg",fewPiece:0});
	}
	//listData(tmn);
	//获取当前分类的导航数据
//	$.ajax({
//		type : "get",
//		url : msonionUrl+"product/menubypid?parentid=0",
//		dataType : "json",
//		//jsonp:"callback",
//		success:function(data){
//			var gettpl = $('#defnavData').html();
//			laytpl(gettpl).render(data, function(html){
//				$('#defnav').prepend(html);
//			});  
//		}
//	});
		
	// 查看购物车数量
	$.ajax({
		type:"get",
		url : msonionUrl+"cart/count",
		dataType : "json",
		//jsonp:"callback",
		success:function(data){
			if(data.num != -1){
				// 显示购物车数量
				if(data.num == 0){
					$("#cartNum").css({display:"none"}).text(data.num);
				}else{
					$("#cartNum").css({display:"block"}).text(data.num);
				}	
				if(data.messageLength > 0){//显示信息条数
					$("#notice").css({display:"block"}).text(data.messageLength);
				}
			}else{
				// 如果未登录，则不显示数量提示
				$("#cartNum").css({display:"none"});
			}
		}
	});

	// 滚动图片
	$.ajax({
		type:"get",
		url : msonionUrl+"adverimg",
		data: {"tmn":tmn,"imgType":2},
		dataType : "json",
		success:function(data){
			var gettpl = $('#scrollImgData').html();
			laytpl(gettpl).render(data, function(html){
				$('#scrollimg').append(html);
			});  
			//totalPage = data.totalPage;
			//pageNum++;
			// 图片滚动
			TouchSlide({ 
				slideCell:"#defslider",
				titCell:".hd ul", 
				mainCell:".bd ul", 
				effect:"leftLoop", 
				autoPage:true,//自动分页
				autoPlay:$('#defslider .bd li').length>1 ? true:false  //自动播放
			});
			//图片延迟加载插件引用
			//$('#indexList').lazyload();
		}
	});

	//返回顶部插件引用
	$(window).goTops({toBtnCell:"#gotop",posBottom: 70});

	getTitle(tmn);

	/***************微信分享************************/
	$.ajax({
		type:"get",
		url : msonionUrl+"getWeChatSign",
		data: {"url": window.location.href},
		dataType : "json",
		success:function(data){
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: data.appid, // 必填，公众号的唯一标识
				timestamp: data.timestamp, // 必填，生成签名的时间戳
				nonceStr: data.noncestr, // 必填，生成签名的随机串
				signature: data.finalsign,// 必填，签名，见附录1
				jsApiList: [
				            'checkJsApi',
				            'onMenuShareTimeline',
				            'onMenuShareAppMessage',
				            'onMenuShareQQ',
				            'onMenuShareWeibo',
				            'onMenuShareQZone'
				            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			wx.ready(function () {	
				wx.onMenuShareTimeline({
					title: store_name, // 分享标题
					link: 'http://m.msyc.cc/wx/index.html?tmn='+tmn, // 分享链接
					imgUrl: msPicPath+"wx/images/share_logo.png", // 分享图标
					success: function () { 
						// 用户确认分享后执行的回调函数
						//alert("3q");
					},
					cancel: function () { 
						// 用户取消分享后执行的回调函数
						//alert(" no 3q");
					}
				});
				wx.onMenuShareAppMessage({
				    title: store_name, // 分享标题
				    desc: '一键环球扫货', // 分享描述
				    link: window.location.href,//'http://m.msyc.cc/wx/index.html?tmn='+tmn, // 分享链接
				    imgUrl: msPicPath+"wx/images/share_logo.png", // 分享图标
				    type: '', // 分享类型,music、video或link，不填默认为link
				    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				    success: function () { 
				        // 用户确认分享后执行的回调函数
				    },
				    cancel: function () { 
				        // 用户取消分享后执行的回调函数
				    }
				});
			});
			wx.onMenuShareQZone({
				title: store_name, // 分享标题
				desc: '一键环球扫货', // 分享描述
				link: window.location.href, // 分享链接
			    imgUrl:msPicPath+"wx/images/share_logo.png", // 分享图标
			    success: function () { 
			       // 用户确认分享后执行的回调函数
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			    }
			});
			wx.onMenuShareQQ({
				title: store_name, // 分享标题
				desc: '一键环球扫货', // 分享描述
				link: window.location.href, // 分享链接
			    imgUrl:msPicPath+"wx/images/share_logo.png", // 分享图标
			    success: function () { 
			       // 用户确认分享后执行的回调函数
			    },
			    cancel: function () { 
			       // 用户取消分享后执行的回调函数
			    }
			});
		}
	});
	/***************微信分享 end************************/
	/*kf*/
	$.ajax({
	    type :"post",
	    url : msonionUrl+"menbercenter/memberInfo",
			dataType : "json",
			success:function(data){
				if(!data.login_flag){				
					$("#yctip").attr("onclick","goUrlByTmn('yxctips.html?uid=n&unm=n')");
				}else{
					var nam = new Array();
					if(data.memberrec.memberName != undefined && data.memberrec.memberName !=""){
						nam.push(data.memberrec.memberName);
					}
					if(data.memberrec.memberPhone != undefined && data.memberrec.memberPhone !=""){
						nam.push(data.memberrec.memberPhone);
					}
					if(data.memberrec.memberYCID != undefined && data.memberrec.memberYCID !=""){
						nam.push(data.memberrec.memberYCID);
					}
					var name;
					if(nam.length > 0){
						name = nam.join("-");
					}else{
						name = data.memberrec.memberId;
					}
					 
					$("#yctip").attr("onclick","goUrlByTmn('yxctips.html?uid="+data.memberrec.memberId+"&unm="+name+"')");
				}
		}
	});
	/*kf*/
});

/*查询首页数据*/
function listData(tmn) {		
	$.ajax({
		type : "get",
		url : msonionUrl+"index?tmn="+tmn,
		cache:true,
		dataType : "json",
		success:function(data){
			if(data.data.length == 0){				
				$("#indexList").html("<li class='mt10 tc red'>暂无数据！</li>");
				$("#loadaimbox").css({display: 'none'});
			}else{
				var gettpl = $('#indexData').html();
				laytpl(gettpl).render(data, function(html){
					$('#indexList').append(html);
				});  
				//图片延迟加载插件引用
				$('#indexList').lazyload();
			}
		}
	});
}

/**
 * 根据终端id查询店名并赋值在页面标题处
 * @param tmn
 */
function getTitle(tmn){
	$.ajax({
		type:'get',
		url:msonionUrl+'/store/name',
		data:tmn?'tmn='+tmn:'',
				dataType:'json',
				success:function(msg){
					store_name =(msg && msg.storeName) ? msg.storeName : "洋葱海外仓";
					$("#titles").text((msg && msg.storeName) ? msg.storeName : "洋葱海外仓");
				}
	});
}

//添加购物车
var timer = null;
function addCart(tmn,goodsId,letId){
	clearTimeout(timer);
	timer = setTimeout(function(){
		if(!limitrule(goodsId, 1,letId)){	// 添加限购规则 2015-11-30
			
			$.ajax({
				type: "get",  
				url: msonionUrl+"cart/add?tmnId="+tmn+"&goodsId="+goodsId+"&t="+new Date().getTime(),
				dataType : "json",
				//jsonp:"callback",
				success: function(data){
					var msg = "";
					if(data.state == 5){
						goUrl("login.html?"+window.location.href);
					}else{
						if(data.state == -1){
							msg = "对不起，洋葱商家无法使用本功能";
						}else if(data.state == 0){
							msg = "此商品加入购物车失败！";
						}else if(data.state == 1){
							msg = "此商品在商城中不存在！";
						}else if(data.state == 2){
							msg = "数量不能为空！";
						}else if(data.state == 3){			    	 
							showCartNum();  // 重新计算购物车数量
							msg = "恭喜加入购物车成功！";
						}else if(data.state == 4){
							msg = "终端不存在！";
						}else if(data.state == 6){
							msg = "此终端不存在！";
						}else if(data.state == 7){
							msg = "洋葱商家不能使用此功能！";
						}
						dialogMsg(msg);
					}
				}
			});
		}
		
	},500);
}

/**
 * 商品限购
 * @param gid
 * @param num
 * @param mid
 * @returns {Boolean}
 */
function limitrule(gid,num,mid){
	var limit = true;
	var params = {"gid":gid,"buynum":num,"menuid":mid,"t":new Date().getTime()};
	var url = msonionUrl+"sodrest/sodlimit1";
	$.ajax({
		type:'get',
		url:url,
		data:params,
		dataType:'json',
		async:false,
		success:function(msg){
			var info = "该商品是限购商品";
			//info += "<br />限购日期："+msg.sdate+"~"+msg.edate;
			info += "<br />每人限购"+msg.limitNum+"件";
			msg.islimit&&m.open({
				   width:"70%",
				   height:150,
				   content:"<p class='listinfo f16' style='width:100%'>"+info+"</p>",
				   closeBtn: [false],
				   btnName:['确定'],
				   btnStyle:["color: #0e90d2;"],
				   maskClose:false,
				   yesfun :  null ,     
				   nofun :  null
			 });
			limit = msg.islimit;
		}
	});
	return limit;
}

//查看购物车数量
function showCartNum(){
	var data = {'t':new Date().getTime()};
	$.ajax({
		type:"get",
		url : msonionUrl+"cart/count",
		dataType : "json",
		data : data,
		//jsonp:"callback",
		success:function(data){
			if(data.num != -1){
				// 显示购物车数量
				if(data.num == 0){
					$("#cartNum").css({display:"none"}).text(data.num);
				}else{
					$("#cartNum").css({display:"block"}).text(data.num);
				}	
			}else{
				// 如果未登录，则不显示数量提示
				$("#cartNum").css({display:"none"});
			}
		}
	});	
}

