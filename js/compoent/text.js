function text(data){
	this.data = data || '';
	this.str = data.str||'添加文字'
	this.family = data.family||'宋体'
	this.size = data.size||20
	this.style = data.style||'bold'
	this.align = data.align||'left'
	this.color = data.color || '#000'
	this.ele = $('<span>'+this.str+'</span>')
	this.data.type = data.type || 'text'
	this.data.width = data.width || 100
	this.data.height = data.height || 40
	this.create(this)
	runSuper(this)
}
text.prototype = {
	create:function(obj){
		var family = this.data.family = obj.family || this.family
		var size = this.data.size = obj.size || this.size
		var style = this.data.style = obj.style || this.style
		var str = this.data.str = obj.str || this.str
		var color = this.data.color = obj.color || this.color
		this.ele.text(str)
		this.ele.css({
			fontFamily:family,
			fontSize:size,
			fontStyle:style,
			color:color,
		    	wordBreak: 'break-all'
		})
	},
	setState:function(option){
		this.setStateCom(option)
		this.create(option)
	}
}