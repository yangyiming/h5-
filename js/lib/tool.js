var Tool = {
	getJson:function(url,callback){
		if(window.location.pathname.indexOf('save') > 0 || window.location.pathname.indexOf('preview') > 0){
			$.ajax({
				type:'get',
				url:'/getData',
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
		}else{
			$.getJSON(url, function(json){
			  callback(json);
			}).error(function(error){
				console.log(error)
			});
		}
	}
}