function compoentEdit(compoent){
	this.compoent = compoent
	this.width = compoent.width * compoent.scale
	this.height = compoent.height * compoent.scale
	this.x = compoent.x - (this.width-compoent.width)/2
	this.y = compoent.y - (this.height-compoent.height)/2
	this.rotate = compoent.rotate
	this.zIndex = compoent.zIndex
	this.eleBox = $("<div class='compoentEdit' data-toggle='context' data-target='#contextEdit'></div>")
	this.mouseDown = global.mouseDown
	this.mouseMove = global.mouseMove
	this.mouseUp = global.mouseUp
	this.factor = 0.8//缩放系数
	this.offsetX = $('#stage').offset().left+1
	this.offsetY = $('#stage').offset().top+1
	this.pointW = 16
	this.pointH = 16
	this.disable = true
	this.elePointCommon = {
		width:this.pointW,
		height:this.pointH,
		backgroundColor:"#00BCD4",
		position:'absolute',
		borderRadius:4
	}
	this.minWidth = this.pointW * 3
	this.minHeight = this.pointH * 3
	this.ww = $('#stage').offset().left
	this.wh = $('#stage').offset().top
	this.setPosition()
	this.create()
}
compoentEdit.prototype = {
	setState:function(obj){
		this.initCE(obj)
		this.compoent.setState(this.compoent)
	},
	initCE:function(obj){
		var width = obj.width || this.width
		var height = obj.height || this.height
		var x = obj.x || this.x
		var y =obj.y || this.y
		var zIndex = obj.zIndex || this.zIndex
		var rotate = obj.rotate || this.rotate
		this.eleBox.css({
			left:x,
			top:y,
			width:width,
			height:height,
			zIndex:zIndex,
			transform:'rotate('+rotate+'deg)',
			position:'absolute',
			cursor:'pointer'
		})
		this.resetPosition()
		this.compoent.width  = this.width
		this.compoent.height  = this.height
		//重置
		this.compoent.width /= this.compoent.scale 
		this.compoent.height /= this.compoent.scale
		this.compoent.x = this.compoent.x + (this.width-this.compoent.width)/2
		this.compoent.y = this.compoent.y + (this.height-this.compoent.height)/2
		this.compoent.rotate = this.rotate
		this.compoent.zIndex = this.zIndex
	},
	create:function(){
		this.initCE(this)
		this.eleBox.type = 'editBoxEvent'
		this.createBorder()
		this.eventHandle(this.eleBox)
		this.ltp = this.createPoint("lt")
		this.ctp = this.createPoint("ct")
		this.rtp = this.createPoint("rt")
		this.lcp = this.createPoint("lc")
		this.rcp = this.createPoint("rc")
		this.lbp = this.createPoint("lb")
		this.bcp = this.createPoint("bc")
		this.brp = this.createPoint("br")
		this.rotatePoint = this.createRotatePoint("rp")
		$(document).on(this.mouseDown,this.hideaAllBorder)
		$(window).on('resize',$.proxy(this.resizeWindow,this))
		
	},
	refresh:function(){
		this.width = this.compoent.width * this.compoent.scale
		this.height = this.compoent.height * this.compoent.scale
		this.x = this.compoent.x - (this.width-this.compoent.width)/2
		this.y = this.compoent.y - (this.height-this.compoent.height)/2
		this.rotate = this.compoent.rotate
		this.setPosition()
		this.setState(this)
	},
	resizeWindow:function(){
		// this.initCE(this)
		// this.compoent.setState(this)
		this.offsetX = $('#stage').offset().left+1
		this.offsetY = $('#stage').offset().top+1
		this.x = this.compoent.x + this.offsetX
		this.y = this.compoent.y + this.offsetY
		this.eleBox.css({
			left:this.x,
			top:this.y
		})

	},
	remove:function(){
		this.eleBox.remove()
	},
	hideaAllBorder:function(){
		$(global.EDIT.compoentEditObj).each(function(index,item){
			item.hideBorder()
		})
	},
	createRotatePoint:function(type){
		var rotatePointBox = $('<div></div>')
		var rotatePoint = $("<div></div>")
		var lineDiv = $('<div></div')
		
		
		this.lineCss = {
			width:1,
			height:this.elePointCommon.height*2,
			backgroundColor:'#00BCD4',
			marginLeft:this.elePointCommon.width/2
		}
		var rotateCss = {
			left:'50%',
			top:-this.lineCss.height,
			position:'absolute',
			marginLeft:-this.elePointCommon.width/2
		}
		var elePointCss = {top:-this.lineCss.height/2}
		var elePointCss = $.extend(elePointCss,this.elePointCommon)
		lineDiv.css(this.lineCss)
		rotatePoint.css(elePointCss)
		rotatePointBox.css(rotateCss)
		rotatePointBox.append(lineDiv)
		rotatePointBox.append(rotatePoint)
		this.eleBorderParent.append(rotatePointBox)
		rotatePoint.type = type
		this.eventHandle(rotatePoint)
		return rotatePoint
	},
	createBorder:function(){
		this.eleBorderParent = $("<div>")
		this.eleBorder  = $("<div>")
		this.eleBorderParent.css({
			width:'100%',
			height:'100%'
		})
		this.eleBorder.css({
			border:'1px solid #03A9F4',
			width:'100%',
			height:'100%'
		})	
		this.eleBorderParent.append(this.eleBorder)
		this.eleBorderParent.hide()
		this.eleBox.append(this.eleBorderParent)
	},
	hideBorder:function(){
		this.eleBorderParent.hide()
	},
	showBorder:function(){
		this.eleBorderParent.show()
	},
	createPoint:function(type){
		var elePointCommon = this.elePointCommon
		// w-resize | s-resize | n-resize | e-resize | ne-resize | sw-resize | se-resize | nw-resize
		switch(type) {
			case 'lt':
				var elePointCss = {
					left:-elePointCommon.width/2,
					top:-elePointCommon.height/2,
					cursor:'se-resize'
				}
			break;
			case 'ct':
				var elePointCss = {
					left:'50%',
					top:0,
					marginLeft:-elePointCommon.width/2,
					marginTop:-elePointCommon.height/2,
					cursor:'s-resize'
				}
			break;
			case 'rt':
				var elePointCss = {
					right:-elePointCommon.width/2,
					top:-elePointCommon.height/2,
					cursor:'ne-resize'
				}
			break;
			case 'lc':
				var elePointCss = {
					left:-elePointCommon.width/2,
					top:'50%',
					marginTop:-elePointCommon.height/2,
					cursor:'w-resize'
				}
			break;
			case 'rc':
				var elePointCss = {
					right:0,
					top:'50%',
					marginRight:-elePointCommon.width/2,
					marginTop:-elePointCommon.height/2,
					cursor:'w-resize'
				}
			break;
			case 'lb':
				var elePointCss = {
					left:0,
					bottom:0,
					marginLeft:-elePointCommon.width/2,
					marginBottom:-elePointCommon.height/2,
					cursor:'sw-resize'
				}
			break;
			case 'bc':
				var elePointCss = {
					left:'50%',
					bottom:0,
					marginLeft:-elePointCommon.width/2,
					marginBottom:-elePointCommon.height/2,
					cursor:'n-resize'
				}
			break
			case 'br':
				var elePointCss = {
					right:0,
					bottom:0,
					marginRight:-elePointCommon.width/2,
					marginBottom:-elePointCommon.height/2,
					cursor:'nw-resize'
				}
			break;
			default:
				alert('没有类型的缩放点')
		}
		
		var elePointCss = $.extend(elePointCss,elePointCommon);
		var elePoint = $("<span></span>")
		elePoint.css(elePointCss)
		this.eleBorderParent.append(elePoint)
		elePoint.type =type
		elePoint.attr('type',type)
		this.eventHandle(elePoint)
		return elePoint
	},
	eventHandle:function(obj){
		obj.on(this.mouseDown,this.catchObj(event,obj,this.mouseEvent))
		//禁止选择事件
		obj.bind('dragstart', function(event) { event.preventDefault()})
		obj.bind('dragmove', function(event) { event.preventDefault()})
		
	},
	catchObj:function(event,target,callback){
		var context = this;
		return function(event){
			callback(event,target,context);
		}
	},
	setPosition:function(){
		this.offsetX = $('#stage').offset().left+1
		this.offsetY = $('#stage').offset().top+1
		this.x+=this.offsetX
		this.y+=this.offsetY
	},
	resetPosition:function(){
		this.compoent.x = this.x - this.offsetX
		this.compoent.y = this.y - this.offsetY
	},
	mouseEvent:function(event,target,context){
		context[target.type](event,target)
	},
	editBoxEvent:function(event,obj){
		switch(event.type){
			case this.mouseDown:
				event.stopPropagation()
				$(document).trigger(this.mouseDown)
				this.showBorder()
				this.startX = this.x
				this.startY = this.y
				this.pageX = event.pageX
				this.pageY = event.pageY
				$(document).off(this.mouseUp+'.editBoxEvent').on(this.mouseUp+'.editBoxEvent',this.catchObj(event,obj,this.mouseEvent))
				$(document).off(this.mouseMove+'.editBoxEvent').on(this.mouseMove+'.editBoxEvent',this.catchObj(event,obj,this.mouseEvent))
				global.EDIT.loadEditor(this)
			break
			case this.mouseMove:
				event.stopPropagation()
				this.x  = this.startX + event.pageX - this.pageX
				this.y = this.startY + event.pageY - this.pageY
				this.setState({x:this.x,y:this.y})
			break
			case this.mouseUp:
				event.stopPropagation()
				$(document).off(this.mouseMove)
				// $(document).trigger('compoentChange'+this.compoent.id)
			break
			default:
				alert('事件类型不存在')
			break
		}
	},
	pointMouseDown:function(event,obj){
		
		event.stopPropagation()
		this.pageX = event.pageX
		this.pageY = event.pageY
		this.startX = this.x
		this.startY = this.y
		this.startW = this.width
		this.startH = this.height
		this.startScale = this.startW/this.startH
		$(document).on(this.mouseMove,this.catchObj(event,obj,this.mouseEvent))
	},
	lt:function(event,obj){
		switch(event.type){
			case this.mouseDown:
				this.pointMouseDown(event,obj)
			break
			case this.mouseMove:
				event.stopPropagation()
				var offsetX =   event.pageX - this.pageX
				var offsetY = offsetX/this.startScale
				this.width  = Math.abs(this.startW-offsetX)
				this.height  = Math.abs(this.startH-offsetY)
				if(this.startW-offsetX >0||this.startH-offsetY>0){
					this.x = this.startX +offsetX
					this.y = this.startY +offsetY
				}
				this.setState(this)
			break
			case this.mouseUp:
				this.reverse = false
				$(document).off(this.mouseMove)
			break
			default:
				alert('事件类型不存在')
			break
		}
	},
	ct:function(event,obj){
		switch(event.type){
			case this.mouseDown:
				this.pointMouseDown(event,obj)
			break
			case this.mouseMove:
				event.stopPropagation()
				var offsetY = event.pageY - this.pageY
				this.height  = Math.abs(this.startH-offsetY)
				if(this.startH-offsetY>0){
					this.y = this.startY +offsetY
				}
				this.setState(this)
			break
			case this.mouseUp:
				$(document).off(this.mouseMove)
			break
			default:
				alert('事件类型不存在')
			break
		}
	},
	rt:function(event,obj){
		switch(event.type){
			case this.mouseDown:
				this.pointMouseDown(event,obj)
			break
			case this.mouseMove:
				event.stopPropagation()
				var offsetX = event.pageX - this.pageX
				var offsetY = offsetX/this.startScale
				this.width  = Math.abs(this.startW+offsetX)
				this.height  = Math.abs(this.startH+offsetY)
				if(this.startW+offsetX>0){
					this.y = this.startY - offsetY
				}else {
					offsetX +=this.startW
					this.x = this.startX + offsetX
				}
				
				this.setState(this)
			break
			case this.mouseUp:
				$(document).off(this.mouseMove)
			break
			default: 
				alert('事件类型不存在')
			break
		}
	},
	lc:function(event,obj){
		switch(event.type){
			case this.mouseDown:
				this.pointMouseDown(event,obj)
			break
			case this.mouseMove:
				event.stopPropagation()
				var offsetX = event.pageX - this.pageX
				this.width  = Math.abs(this.startW-offsetX)
				if(this.startW-offsetX>0){
					this.x = this.startX + offsetX
				}
				this.setState(this)
			break
			case this.mouseUp:
				$(document).off(this.mouseMove)
			break
			default:
				alert('事件类型不存在')
			break
		}
	},
	rc:function(event,obj){
		switch(event.type){
			case this.mouseDown:
				this.pointMouseDown(event,obj)
			break
			case this.mouseMove:
				event.stopPropagation()
				var offsetX = event.pageX - this.pageX
				this.width  = Math.abs(this.startW+offsetX)
				if(this.startW+offsetX>0){
					this.x = this.startX
				}else{
					offsetX +=this.startW
					this.x = this.startX+offsetX
				}
				this.setState(this)
			break
			case this.mouseUp:
				$(document).off(this.mouseMove)
			break
			default:
				alert('事件类型不存在')
			break
		}
	},
	lb:function(event,obj){
		switch(event.type){
			case this.mouseDown:
				this.pointMouseDown(event,obj)
			break
			case this.mouseMove:
				event.stopPropagation()
				var offsetX = event.pageX - this.pageX
				var offsetY = offsetX/this.startScale
				this.width  = Math.abs(this.startW-offsetX)
				this.height  = Math.abs(this.startH-offsetY)
				if(this.startW-offsetX>0){
					this.x = this.startX +offsetX
				} else {
					offsetY -=this.startH
					this.y = this.startY - offsetY
				}
				this.setState(this)
			break
			case this.mouseUp:
				$(document).off(this.mouseMove)
			break
			default:
				alert('事件类型不存在')
			break
		}
	},
	bc:function(event,obj){
		switch(event.type){
			case this.mouseDown:
				this.pointMouseDown(event,obj)
			break
			case this.mouseMove:
				event.stopPropagation()
				var offsetY = event.pageY - this.pageY
				this.height  = Math.abs(this.startH+offsetY)
				if(this.startH+offsetY > 0){
					this.y = this.startY
				}else {
					offsetY+=this.startH
					this.y = this.startY+offsetY
				}
				
				// this.bcBjJuadge()
				this.setState(this)
			break
			case this.mouseUp:
				$(document).off(this.mouseMove)
			break
			default:
				alert('事件类型不存在')
			break
		}
	},
	br:function(event,obj){
		switch(event.type){
			case this.mouseDown:
				this.pointMouseDown(event,obj)


			break
			case this.mouseMove:

				event.stopPropagation()
				var offsetX = event.pageX - this.pageX
				var offsetY = offsetX/this.startScale
				
				this.width  = Math.abs(this.startW+offsetX)
				this.height  = Math.abs(this.startH+offsetY)
				if(this.startW+offsetX>0||this.startH+offsetY>0){
					this.x = this.startX
					this.y = this.startY
				}else {
					offsetX+=this.startW
					offsetY+=this.startH
					this.x = this.startX+offsetX
					this.y = this.startY+offsetY
				}
				// this.brBjJuadge()
				this.setState(this)
			break
			case this.mouseUp:
				$(document).off(this.mouseMove)
			break
			default:
				alert('事件类型不存在')
			break
		}
	},
	rp:function(event,obj){
		switch(event.type){
			case this.mouseDown:
				this.pointMouseDown(event,obj)
			break
			case this.mouseMove:
				event.stopPropagation()
				var offsetX = event.pageX - this.pageX
				var offsetY = event.pageY - this.pageY

				var r = this.height/2+this.lineCss.height-this.elePointCommon.height/2

				var or = r-Math.abs(offsetX)
				//象限分析
				// this.rotate += Math.tan(Math.abs(offsetX)/(r-Math.abs(offsetY)))*(180/Math.PI)
				if(event.pageY < this.y+this.height/2){
					this.rotate += Math.sin(offsetX/r)*(180/Math.PI)
				}else  {
					this.rotate -= Math.sin(offsetX/r)*(180/Math.PI)
				}
				this.pageX = event.pageX
				this.pageY = event.pageY
				// this.rotate = Math.tan(offsetX/offsetY)*(180/Math.PI)
				this.setState(this)
			break
			case this.mouseUp:
				$(document).off(this.mouseMove)
			break
			default:
				alert('事件类型不存在')
			break
		}
	}
}