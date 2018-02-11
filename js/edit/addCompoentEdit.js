function addCompoentEdit(compoent){
	this.compoent = compoent
	this.tpl = '../tpl/addCompoentEdit.html'
	this.editor = $('#addCompoentEdit')
	this.create()
}
addCompoentEdit.prototype= {
	create:function(){
		var that = this
		$.ajax({
			dataType:'html',
			url:this.tpl,
			success:$.proxy(this.success,this)
		})
	},
	success:function(source){
		var that = this
		var render = template.compile(source)
		$('#root').append(render)
		this.editor = $('#addCompoentEdit')
		$('#addText').on('click',$.proxy(global.EDIT.addText,global.EDIT))
		$('#addImage').on('click',$.proxy(global.EDIT.addImage,global.EDIT))
		$('#preview').on('click',$.proxy(global.EDIT.preview,global.EDIT))
		$('#addBg').on('click',$.proxy(global.EDIT.addBgEdit,global.EDIT))
		$('#deleteCompoent').on('click',$.proxy(global.EDIT.deleteCompoent,global.EDIT))
		$('#addSuCai').on('click',$.proxy(global.EDIT.addSucaiEdit,global.EDIT))
	}
}