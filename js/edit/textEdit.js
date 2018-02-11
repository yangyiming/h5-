function textEdit(compoent){
	this.compoent = compoent
	this.tpl = '../tpl/textEdit.html'
	this.editor = $('#textEdit')
	this.type = 'textEdit'
	this.create()
}
textEdit.prototype= {
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
		this.editor = $('#textEdit')
		this.animateEdit = new animateEdit(this.compoent)

		//字体选择
		$('#selectFamily').selectpicker()
		this.setFamily()
		$('#selectFamily').on('changed.bs.select', function (e) {
		 	that.compoent.family = e.target.value
		 	that.compoent.setState(that.compoent)
		})
		//字体大小
		$('#selectSize').selectpicker()
		this.setSize()
		$('#selectSize').on('changed.bs.select', function (e) {
		 	that.compoent.size = parseInt(e.target.value)
		 	that.compoent.setState(that.compoent)
		})
		this.setAlign()
		$('#textTollbar').on('click','.btn',function(e){
			$('#textTollbar .btn').removeClass('active')
			$(this).addClass('active')
			that.compoent.align = $(this).attr('value')
		 	that.compoent.setState(that.compoent)
		})
		this.changeText()
		this.changeColor()
	},
	remove:function(){
		this.editor.remove()
		$('#editor').hide()
	},
	setSize:function(){
		$('#selectSize').selectpicker('val',this.compoent.size)
	},
	setFamily:function(){
		$('#selectFamily').selectpicker('val',this.compoent.family)
	},
	setAlign:function(){
		var that = this
		$('#textTollbar .btn').each(function(index,item){
			if($(this).attr('value') == that.compoent.align){
				$(this).addClass('active')
			}
		})
	},
	changeText:function(){
		var that = this
		$('#changeText').val(this.compoent.str)
		$('#changeText').on('input',function(){
			that.compoent.str = $(this).val()
			that.compoent.setState(that.compoent)
		})
	},
	changeColor:function(){
		var that = this
		$('#cp9').colorpicker({
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
		$('#cp9').colorpicker('setValue',this.compoent.color)
		$('#cp9').on('changeColor',function(event,data){
			that.compoent.color = $(this).val()
			that.compoent.setState(that.compoent)
		})
	}
}