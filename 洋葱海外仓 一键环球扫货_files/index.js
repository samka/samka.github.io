/** 
@Js-name:index.js
@Zh-name:首页展示JS函数
@Author:chen guojun
@Date:2015-06-30
*/
var tmn = parsURL( window.location.href ).params.tmn;
$(function(){
	//首页焦点图
	//$("#pid48").attr("href","goods-list.html?tmn="+tmn+"&pid=48");
	//$("#pid49").attr("href","goods-list.html?tmn="+tmn+"&pid=49");
	//$("#pid50").attr("href","goods-list.html?tmn="+tmn+"&pid=50");
	//$("#pid51").attr("href","goods-list.html?tmn="+tmn+"&pid=51");

	$.ajax({
		type : "get",
		url : msonionUrl+"terminal/getWXTmn?tmn="+tmn,
		dataType : "text",
		success:function(data){
			var qrCodeid = $('#ycerwmbox');
			$("#ycerwm").on(isTap(),function(){
				qrCodeid.css({display: '-webkit-box'});
			})
			qrCodeid.on(isTap(),function(){
				$(this).hide();
			})
			var QRCodeUrl = msonionUrl+'wx/index.html?tmn='+data;		
			var qrcode = new QRCode(qrCodeid.find(".ycerwmcon")[0], {
				text : QRCodeUrl,
				width : 300,
				height : 300
			});
		}
	})

	//首页产品列表
    var pageNum = 1;
    var totalPage = 1;
    var loadFlg = true;
	$(window).dropload({afterDatafun: listData});
	function listData() {
		if(pageNum>totalPage){ return; }
		loadFlg=false;
		$.ajax({
			type : "get",
			url : msonionUrl+"index?tmn="+tmn+"&pageNo="+pageNum,
			dataType : "json",
			//jsonp:"callback",
			success:function(data){
				if(data.total == 0){				
					$("#indexList").html("<li class='mt10 tc red'>暂无数据！</li>");
				}else{
					var gettpl = $('#indexData').html();
					laytpl(gettpl).render(data, function(html){
						$('#indexList').append(html);
					});  
					totalPage = data.totalPage;
					pageNum++;			
					//图片延迟加载插件引用
					$('#indexList').lazyload();
				}
				loadFlg = true;			
			}
		});
	}
	// 滚动图片
	$.ajax({
		type:"get",
		url : msonionUrl+"adverimg",
		data: {"tmn":tmn,"imgType":3},
		dataType : "json",
		success:function(data){
			var gettpl = $('#scrollImgData').html();
			laytpl(gettpl).render(data, function(html){
				$('#scrollimg').append(html);
			});  
			totalPage = data.totalPage;
			pageNum++;
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
	//获取当前分类的导航数据
	$.ajax({
		type : "get",
		url : msonionUrl+"product/menubypid?parentid=0",
		dataType : "json",
		//jsonp:"callback",
		success:function(data){
			var gettpl = $('#defnavData').html();
			laytpl(gettpl).render(data, function(html){
				$('#defnav').prepend(html);
			});  
		}
	});
	showCartNum();
	//返回顶部插件引用
	$(window).goTops({toBtnCell:"#gotop"});
    getTitle(tmn);
});

//添加购物车
var timer = null;
function addCart(tmn,goodsId,letId){
	clearTimeout(timer);
	timer = setTimeout(function(){
		
		if(!limitrule(goodsId, 1,letId)){	// 添加限购规则 2015-11-30
			$.ajax({
				type: "get",  
				url: msonionUrl+"cart/add?tmnId="+tmn+"&goodsId="+goodsId,
				dataType : "json",
				//jsonp:"callback",
				success: function(data){
				     var msg = "";
				     if(data.state == 5){
				         goUrl("login.html?"+window.location.href);
				     }else{
					     if(data.state == 0){
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
// 查看购物车数量
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
			if(msg && msg.storeName){
				$("title").text(msg.storeName + " 一键环球扫货");
				$("#tmntitle").text(msg.storeName);
			}else{
				$("title").text("洋葱海外仓" + " 一键环球扫货");
				$("#tmntitle").text("洋葱海外仓");
			}
		}
	});
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