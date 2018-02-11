function sucaiEdit(compoent){
	this.compoent = compoent
	this.tpl = '../tpl/sucaiEdit.html'
	this.editor = $('#sucaiEdit')
	this.type = 'sucaiEdit'
	this.create()
}
sucaiEdit.prototype= {
	create:function(){
		$(document).on('editorRemove',$.proxy(this.remove,this))
		var that = this
		$.ajax({
			dataType:'html',
			url:this.tpl,
			success:$.proxy(this.success,this)
		})
	},
	remove:function(){
		$('#editor').hide()
		this.editor.remove()
	},
	success:function(source){
		var that = this
		var render = template.compile(source)
		$('#editor').append(render)
		this.editor = $('#sucaiEdit')
		this.eventHandle()
		this.initHeight()
	},
	eventHandle:function(){
		$('li',this.editor).on('click',function(){
			var url = $(this).find('img').attr('src')
			var obj = JSON.parse($(this).attr('data'))
			global.EDIT.addSucai({
				url:url,
				width:obj.width,
				height:obj.height
			})
		})
	},
	initHeight:function(){
		var h = $('body').height()-$('#addCompoentEdit').height()-60
		$('ul',this.editor).height(h)

	}
}