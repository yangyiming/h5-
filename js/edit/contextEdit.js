function contextEdit(compoent){
	this.compoent = compoent
	this.tpl = '../tpl/contextEdit.html'
	this.editor = $('#contextEdit')
	this.type = 'contextEdit'
	this.create()
}
contextEdit.prototype = {
	create:function(){
		var that = this
		$.ajax({
			dataType:'html',
			url:this.tpl,
			success:$.proxy(this.success,this)
		})
	},
	success:function(source){
		var render = template.compile(source)
		$('#root').append(render)
	}
}	