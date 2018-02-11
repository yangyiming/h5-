function bgEdit(compoent){
	this.compoent = compoent
	this.tpl = '../tpl/bgEdit.html'
	this.editor = $('#bgEdit')
	this.type = 'bgEdit'
	this.create()
}
bgEdit.prototype= {
	create:function(){
		$(document).on('editorRemove',$.proxy(this.remove,this))
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
		$('#editor').append(render)
		this.editor = $('#bgEdit')
		this.animateEdit = new animateEdit(this.compoent)
		this.changeColor()
	},
	remove:function(){
		$('#editor').hide()
		this.editor.remove()
	},
	changeColor:function(){
		var that = this
		$('#bgColor').colorpicker({
		            customClass: 'colorpicker-2x',
		            sliders: {
		                saturation: {
		                    maxLeft: 200,
		                    maxTop: 200
		                },
		                hue: {
		                    maxTop: 200
		                },
		                alpha: {
		                    maxTop: 200
		                }
		            }
		})
		$('#bgColor').colorpicker('setValue',this.compoent.color)
		$('#bgColor').on('changeColor',function(event,data){
			that.compoent.bgColor = $(this).val()
			that.compoent.setState(that.compoent)
		})
	}
}