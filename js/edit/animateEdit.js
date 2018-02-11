function animateEdit(compoent){
	this.compoent = compoent
	this.tpl = '../tpl/animateEdit.html'
	this.editor = $('#animateEdit')
	this.imageUrl = this.compoent.url
	this.orignW = compoent.width
	this.orignH = compoent.height
	this.create()
}
animateEdit.prototype= {
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
		var html = render({animate:window.animateConfig})

		$('#editor').append(html)
		this.editor = $('#animateEdit')
		$('#inStage').selectpicker()
		$('#outStage').selectpicker()
		this.changeTime()
		this.setInStage('inStage','in')
		this.setInStage('outStage','out')
		this.stateEvent('inStage','in')
		this.stateEvent('outStage','out')
		
	},
	setInStage:function(id,status){
		var that = this
		$('#'+id+' option').each(function(){
			var  type = $(this).attr('type')
			var text = $(this).text()
			if(type == that.compoent.commonAnimate.animate[status].type){
				$('#'+id).selectpicker('val',text)
			}
		})
		this.setTime(status)
	},
	stateEvent:function(id,state){
		var that = this
		$('#'+id).on('changed.bs.select', function (e) {
			$('#'+id+' option').each(function(){
				var  type = $(this).attr('type')
				var text = $(this).text()
				if(e.target.value == text){
					if(state == 'in'){
						that.compoent.commonAnimate.in(type)
					}
					if(state == 'out'){
						that.compoent.commonAnimate.out(type)
					}
				}
			})
		})
	},
	setTime:function(status){
		$('#animateTime').val(this.compoent.commonAnimate.animate[status].time)
	},
	changeTime:function(){
		var that = this
		$('#animateTime').on('change',function(){
			var time = parseInt($(this).val())
			that.compoent.commonAnimate.changeTime(time)
		})
	},
	remove:function(){
		$('#editor').hide()
		this.editor.remove()
	}
}