
$(function(){
	//初始化场景
	global.start(function(data){
		global.DATA = data
		//初始化舞台对象
		global.STAGE = new stage(data,$('#root'))
		//编辑状态则初始化编辑器对象
		if(global.isEdit){
			global.EDIT = new edit()
		}
	});
})