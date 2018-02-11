function image(data){
	this.data = data || ''
	this.url = data.url ||''
	this.data.type = data.type || 'image'
	this.ele = $('<img src='+this.url+' width="100%" height="100%"/>')
	this.create(this)
	runSuper(this)
}

image.prototype = {
	create:function(obj){
		var url = this.data.url = obj.url || this.url
		this.ele.attr('src',url)
	},
	setState:function(option){
		this.setStateCom(option)
		this.create(option)
	}
}