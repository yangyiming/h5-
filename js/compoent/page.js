/**
 * 数据结构
 *  {
      "id":1,
      "type":"page",
      "x": 0,
      "y": 0,
      "rotate": 0,
      "bgColor":"red",
      "compoent":
        []
    }
 * @param  {[jsonj}
 * @return {[void]}
 */
function page(data){
	//组件数据
	this.data = data || ''
	//页面动画执行结束时间
	this.outTime = 0
	//dom节点
	this.ele = $("<div id='page'></div>")
	//保存组件对象
	this.compoent = []
	if(!data.compoent){
		this.data.compoent =[]
	}
	//组件类型
	this.type= this.data.type = 'page'
	this.bgColor = data.bgColor || '#fff'
	this.data.width = this.width = global.width
	this.data.height = this.height = global.height
	this.create(this)
	//组件执行通用函数
	//继承基础组件对象
	runSuper(this)

}
page.prototype = {
	create:function(obj){
		//页面背景颜色设置
		var bgColor = this.data.bgColor = obj.bgColor || this.bgColor
		this.ele.css({backgroundColor:bgColor})
		this.ele.css({
			width:this.width,
			height:this.height,
			position:'absolute'
		})
	},
	//数据映射到dom节点
	setState:function(option){
		this.setStateCom(option)
		this.create(option)
	},
	//根据数据类型实例化组件
	renderType:function(data){
		var compoent = {}
		switch(data.type){
			case "text":
				compoent = new text(data)
				break
			case "image":
				compoent = new image(data)
				break
			default:
				alert('没有当前类型的组件')
		}
		// 保存实例化组件对象
		this.compoent.push(compoent)
		//触发入场动画
		compoent.eleBox.trigger(compoent.animateIn+data.id)
		//计算出场动画总时间
		if(typeof data.animate !== 'undefined'){
			if(typeof data.animate.out !== 'undefined'){
				this.outTime+=data.animate.out.time
			}
		}
		
	},
	renderCompoent:function(){
		var that = this
		$(this.data.compoent).each(function(index,item){
			that.renderType(item)
		})
		//计算 页面出场动画总时间
		if(typeof this.data.animate !== 'undefined'){
			if(typeof this.data.animate.out !== 'undefined'){
				this.outTime+=this.data.animate.out.time
			}
		}
	},
	clear:function(){
		that.eleBox.remove()
	}
}