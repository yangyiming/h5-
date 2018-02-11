window.global = {
	STAGE :{},
	DATA :{},
	EDIT :{},
	isEdit :true,
	width:320,
	height:600,
	originWidth:320,
	originHeight:600,
	id:1,
	mouseDown :"mousedown",
	mouseMove :"mousemove",
	mouseUp :"mouseup",
	comEditAnimateOver:'comEditAnimateOver',//
	//应用执行入口
	start:function(callback){
		//数据保存接口和数据预览接口判断
		//界面预览需要提供id
		if(window.location.pathname.indexOf('save') > 0 ){
			this.getData({type:'save'},callback)
		}else if(window.location.pathname.indexOf('preview') > 0){
			var id = global.getParam('id')
			var param ={id:id,type:'preview'}
			this.getData(param,callback)
		}else{
			$.getJSON('js/data/data.json',function(result){
				callback(result)
			})
			
		}
	},
	getData:function(param,callback){
		$.ajax({
			type:'get',
			url:'/getData',
			data:param,
			async:false,
			success:function(data){
				global.isEdit = false
				global.width = $(window).width()
				global.height= $(window).height()
				callback(JSON.parse(data));
			},
			error:function(error){
				console.log(error)
			}
		})
	},
	saveData:function(param,callback){
		var formData = new FormData();
		formData.append('data', param);
		$.ajax({
			type:'post',
			url:'/saveData',
			cache: false,
			contentType: false,
			processData: false,
			data:formData,
			success:function(data){
				callback(data)
			}
		})
	},
	getParam:function(paramName) {  
		paramValue = "", isFound = !1;  
		if (window.location.search.indexOf("?") == 0 && window.location.search.indexOf("=") > 1) {  
		    arrSource = unescape(window.location.search).substring(1, window.location.search.length).split("&"), i = 0;  
		    while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++  
		}  
		return paramValue == "" && (paramValue = null), paramValue  
	} ,
	base64ToBlob:function(base64, mime) 
	{
	    mime = mime || '';
	    var sliceSize = 1024;
	    var byteChars = window.atob(base64);
	    var byteArrays = [];

	    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
	        var slice = byteChars.slice(offset, offset + sliceSize);

	        var byteNumbers = new Array(slice.length);
	        for (var i = 0; i < slice.length; i++) {
	            byteNumbers[i] = slice.charCodeAt(i);
	        }

	        var byteArray = new Uint8Array(byteNumbers);

	        byteArrays.push(byteArray);
	    }

	    return new Blob(byteArrays, {type: mime});
	}
}

window.runSuper = function(obj){
	//继承基础组件对象
	$.extend(obj,new common(obj))
	//实例化动画组件对象
	obj.commonAnimate = new commonAnimate(obj) 
}

window.animateConfig = {
	in:[
		{text:'弹性',name:'bounceIn'},
		{text:'弹性(垂直下)',name:'bounceInDown'},
		{text:'弹性(垂直上)',name:'bounceInUp'},
		{text:'弹性(水平左)',name:'bounceInLeft'},
		{text:'弹性(水平右)',name:'bounceInRight'},
		{text:'淡入',name:'fadeIn'},
		{text:'淡入(垂直)',name:'fadeInDown'},
		{text:'淡入(垂直慢)',name:'fadeInDownBig'},
		{text:'淡入(水平左)',name:'fadeInLeft'},
		{text:'淡入(水平左慢)',name:'fadeInLeftBig'},
		{text:'淡入(水平右)',name:'fadeInRight'},
		{text:'淡入(水平右慢)',name:'fadeInRightBig'},
		{text:'淡入(垂直上)',name:'fadeInUp'},
		{text:'淡入(垂直上慢)',name:'fadeInUpBig'},
		{text:'蹦跳',name:'flip'},
		{text:'蹦跳(水平)',name:'flipX'},
		{text:'蹦跳(垂直)',name:'flipY'},
		{text:'旋转1',name:'rotateIn'},
		{text:'旋转2',name:'rotateInDownLeft'},
		{text:'旋转3',name:'rotateInDownRight'},
		{text:'旋转4',name:'rotateInUpLeft'},
		{text:'旋转5',name:'rotateInUpRight'},
	],
	out:[
		{text:'弹性',name:'bounceOut'},
		{text:'弹性(垂直下)',name:'bounceOutDown'},
		{text:'弹性(垂直上)',name:'bounceOutUp'},
		{text:'弹性(水平左)',name:'bounceOutLeft'},
		{text:'弹性(水平右)',name:'bounceOutRight'},
		{text:'淡入',name:'fadeOut'},
		{text:'淡入(垂直)',name:'fadeOutDown'},
		{text:'淡入(垂直慢)',name:'fadeOutDownBig'},
		{text:'淡入(水平左)',name:'fadeOutLeft'},
		{text:'淡入(水平左慢)',name:'fadeOutLeftBig'},
		{text:'淡入(水平右)',name:'fadeOutRight'},
		{text:'淡入(水平右慢)',name:'fadeOutRightBig'},
		{text:'淡入(垂直上)',name:'fadeOutUp'},
		{text:'淡入(垂直上慢)',name:'fadeOutUpBig'},
		{text:'蹦跳(水平)',name:'flipOutX'},
		{text:'蹦跳(垂直)',name:'flipOutY'},
		{text:'旋转1',name:'rotateOut'},
		{text:'旋转2',name:'rotateOutDownLeft'},
		{text:'旋转3',name:'rotateOutDownRight'},
		{text:'旋转4',name:'rotateOutUpLeft'},
		{text:'旋转5',name:'rotateOutUpRight'},
		
	]

}
