function pageEdit(){
	var that =this
	this.eleBox = $("<div id='pageEdit'></div>")
	this.eleBoxChild = $('<div class="box">')
	this.addBtn = $('<button><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>     添加页面</button>')
	
	this.create()
	
}	
pageEdit.prototype = {
	create:function(){
		var that = this
		this.eleBox.append(this.addBtn)
		this.eleBox.append(this.eleBoxChild)
		this.eleUl = $("<ul>")
		this.eleBoxChild.append(this.eleUl)
		$.map(global.STAGE.data,function(item,index){
			that.renderItem(item)
		})
		this.eleUl.find('li').eq(0).addClass('active')
		this.initHeight()
		this.eventHandle()
	},
	eventHandle:function(){
		this.addBtn.on('click',$.proxy(this.addPage,this))
	},
	renderItem:function(item){
		var that = this
		var ele = $("<li data-index="+item.id+"></li>")
		ele.on(global.mouseDown,function(event){
			that.addActive(item.id)
			global.EDIT.currentPE  = null
			global.STAGE.switchPage(item.id)
		})
		this.eleUl.append(ele)
	},
	addActive:function(id){
		$('li',this.eleUl).removeClass()
		$(this.eleUl).find("li[data-index="+id+"]").addClass('active')
	},
	addPage:function(){
		var id = global.EDIT.filterId()
		global.STAGE.addPage(id)
		this.renderItem({id:id})
		this.addActive(id)
	},
	initHeight:function(){
		var h = $('body').height()-$('#addCompoentEdit').height()-120
		this.eleBoxChild.height(h)

	}
}