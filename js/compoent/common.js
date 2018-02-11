/**
 * 基础组件对象
 * 定义基本属性和方法
 * 所有组件都继承此类
 * @param  {[object]}
 * @return {[void]}
 */
function common(compoent){
	//组件数据
	this.data = compoent.data
	//组件id
	this.id=this.data.id
	//组件节点
	this.ele = compoent.ele
	this.type = compoent.data.type || ''
	this.width =  parseFloat(compoent.data.width) || ''
	this.height =parseFloat(compoent.data.height) || ''
	this.rotate = parseFloat(compoent.data.rotate) || 0
	this.scale = parseFloat(compoent.data.scale) || 1
	this.opacity = parseFloat(compoent.data.opacity) || 1	
	this.align = compoent.data.align || 'left'
	this.x = parseFloat(compoent.data.x) || 0
	this.y = parseFloat(compoent.data.y) || 0
	this.zIndex = parseFloat(compoent.data.zIndex) ||1;
	this.eleBox = $("<div>")
	//定义基础锚点 默认左上角为基点
	//0,50,100 为左中右 锚点信息
	this.anchor = ['0','0']
	//入场动画
	this.animateIn = 'animateIn'
	//出场动画
	this.animateOut = 'animateOut'

	//渲染组件
	this.renderCom()
}
common.prototype = {
	renderCom:function(){
		//根据anchor初始化组件的位置 
		this.setAnchor(this)
		//根据数据设置节点的css属性
		this.setStateCom(this)
		//dom 节点操作 
		this.eleBox.append(this.ele)
	},
	//数据映射到dom节点
	setStateCom:function(obj){
		var width = this.data.width = obj.width || this.width
		var height =  this.data.height = obj.height || this.height
		this.data.x = obj.x =(obj.x==0)?'0':obj.x
		this.data.y =  obj.y =(obj.y==0)?'0':obj.y
		var x = this.data.x = obj.x || this.x
		var y = this.data.y =  obj.y || this.y
		var scale = this.data.scale = obj.scale || this.scale
		var rotate = this.data.rotate = (obj.rotate==0)?'0':obj.rotate || this.rotate
		var opacity = this.data.opacity =  obj.opacity || this.opacity
		var zIndex = this.data.zIndex = obj.zIndex || this.zIndex
		var align = this.data.align = obj.align || this.align

		//屏幕比例
		this.tempX = global.width/(global.originWidth/this.x)
		this.tempY = global.height/(global.originHeight/this.y)
		this.tempWidth = global.width/(global.originWidth/this.width)
		this.tempHeight = global.height/(global.originHeight/this.height)
		this.eleBox.css({
			position:'absolute',
			width:this.tempWidth,
			height:this.tempHeight,
			left:this.tempX,
			top:this.tempY,
			transform:'scale('+scale+') rotate('+parseInt(rotate)+'deg)',
			opacity:opacity,
			textAlign:align,
			zIndex:zIndex
		})
	},
	//根据锚点信息进行偏移
	setAnchor:function(obj){
		obj.x = obj.x - obj.width * parseInt(this.anchor[0])/100
		obj.y = obj.y - obj.height * parseInt(this.anchor[1])/100
	},

}