function edit(){
	this.eleBox = $("<div id='edit'></div>")
	this.compoentEditObj = []
	this.currentEdit = null
	this.currentPE =null
	this.render() 
}
edit.prototype = {
	render:function(){
		//绑定编辑器事件
		this.editPageEvent()
		this.create()
		this.renderPage(global.STAGE.currentPage)
		this.showContext()
		this.pageEditor = new pageEdit()
		$('#root').append(this.pageEditor.eleBox)
		$('#root').prepend(this.eleBox)
	},
	renderPage:function(item){
		var that = this
		//每个组件在动画渲染完成以后添加编辑器
		//有入场动画才绑定事件
		$.map(item.compoent,function(obj){
			if(obj.commonAnimate.animate.in.type!==''){
				$(document).one('comEditAnimateOver'+obj.id,function(){
					that.addEdit(obj,that)
				})
			}else {
				that.addEdit(obj,that)
			}
		})
		
	},
	addEdit:function(obj,context){
		//根据组件对象初始化编辑器对象
		var ce = new compoentEdit(obj)
		context.compoentEditObj.push(ce)
		context.eleBox.append(ce.eleBox)
		return ce
	},
	create:function(){
		this.eleBox.css({
			position:'absolute',
			width:'100%',
			height:'100%',
			zIndex:2
		})
		this.addCompoentEdit()
	},
	addCompoentEdit:function(){
		//头部加入编辑器对象 可添加 删除 预览组件
		this.addCompoentEdit = new addCompoentEdit()
	},
	addText:function(){
		//构建文字数据对象
		var data = {}
		// 设置层级
		var zIndex = this.filterIndex()
		//设置id
		var id = this.filterId()
		data.id = id
		data.zIndex = zIndex
		//初始化组件对象
		var compoent = new text(data)
		// 组件加入到编辑器中 并且添加编辑状态
		this.addCompoent(compoent)
	},
	addImage:function(){
		var that = this
		var $file = $('<input type="file" id="File" />)')
		$file.on('change',function(file){
			var reader = new FileReader()
			reader.onload = function(evt){
				$file.remove()
				var url = evt.target.result
				var imageobj = new Image()
				imageobj.src = url
				imageobj.onload = function() {
				　　	var base64ImageContent = url.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
					var blob = global.base64ToBlob(base64ImageContent, 'image/png');                
					var formData = new FormData();
					formData.append('imgData', blob);
		       	 		$.ajax({
		 				type:'post',
		 				url:'/upload',
		 				cache: false,
						contentType: false,
						processData: false,
		 				data:formData,
		 				success:function(newUrl){
		 					var zIndex = that.filterIndex()
							var id = that.filterId()
							var data = {url:newUrl,id:id,zIndex:zIndex,width:imageobj.width,height:imageobj.height}
							var compoent = new image(data)
							that.addCompoent(compoent)

		 				}
		       	 		})
				}
				
			}
			reader.readAsDataURL($(this)[0].files[0]);
		})
		$('body').append($file)
		$file.trigger('click')

	},
	addSucai:function(imageobj){
		var zIndex = this.filterIndex()
		var id = this.filterId()
		var data = {url:imageobj.url,id:id,zIndex:zIndex,width:imageobj.width,height:imageobj.height}
		var compoent = new image(data)
		this.addCompoent(compoent)
	},
	addCompoent:function(compoent){
		//舞台添加组件
		global.STAGE.currentPage.compoent.push(compoent)
		//舞台添加组件数据
		global.STAGE.currentPage.data.compoent.push(compoent.data)
		//节点操作
		global.STAGE.eleBox.append(compoent.eleBox)
		//组件加入编辑器
		var ce = this.addEdit(compoent,this)
		var that = this
		//组件右键事件
		//可对组件置顶 置底 上一层  下一层 操作
		ce.eleBox.contextmenu({
			target:'#contextEdit', 
			before: function(e,context) {
				
			},
			onItem: function(context,e) {
				var type = $(e.target).attr('type')
				switch(type){
					case 'top':
					that.setZindexTop()
					break;
					case 'bottom':
					that.setZindexBottom()
					break;
					case 'up':
					that.setZindexUp()
					break;
					case 'down':
					that.setZindexDown()
					break;
					default:
					alert('没有功能键')
				}
			}
		})
	},
	clear:function(){
		//清除所有组件编辑器对象
		$.map(this.compoentEditObj,function(item,index){
			item.eleBox.remove()
		})
		this.compoentEditObj = []
	},
	filterIndex:function(){
		// 层级为递增关系
		if(global.STAGE.currentPage.compoent.length <= 0){
			return 1
		}
		var zindex  = []
		$.map(global.STAGE.currentPage.compoent,function(obj){
			zindex.push(obj.zIndex)
		})
		return zindex.sort()[zindex.length-1]+1
	},
	filterId:function(){
		//id 页为递增关系
		var id = []
		$.map(global.STAGE.data,function(obj){
			id.push(obj.id)
			$.map(obj.compoent,function(item){
				id.push(item.id)
			})
		})
		return id.sort()[id.length-1]+1
	},
	loadEditor:function(obj){
		//组件编辑状态显示当前组件的编辑器
		//显示出垃圾箱
		$('#deleteCompoent').show()
		//重复点击同一个组件对象则不重新初始化编辑器对象
		if(this.currentPE){
			if(this.currentPE.compoent.id==obj.compoent.id){
				return
			}
		}
		//移除页面的所有编辑器
		$(document).trigger('editorRemove')

		this.currentPE = obj

		//根据组件的类型 初始化不同的编辑器
		$('#editor').show()
		switch(obj.compoent.type){
			case 'text':
				this.currentEdit = new textEdit(obj.compoent)
				break
			case 'image':
				this.currentEdit = new imageEdit(obj.compoent)
				break
			default:
				alert('没有此类型组件的编辑器')
				break
		}
	},
	addBgEdit:function(){
		//显示背景编辑器
		this.currentPE = null
		$(document).trigger('editorRemove')
		$('#editor').show()
		this.currentEdit = new bgEdit(global.STAGE.currentPage)
	},
	removeEditor:function(){
		this.currentEdit.remove()
		this.currentPE = null
	},
	filterPage:function(id){
		//根据id 过滤出页面对象
		var pageDataObj = $(global.STAGE.pages).map(function(index,item){
			if(item.id == id){
				return item
			}
		})
		return pageDataObj
	},
	filtePageData:function(id){
		//根据id过滤出页面数据
		var obj = $.map(global.STAGE.data,function(item,index){
			if(item.id == id){
				return item
			}
		})
		return obj[0]
	},
	editPageEvent:function(){
		var that = this
		//页面切换需要清除组件编辑器
		$.map(global.STAGE.data,function(item,index){
			$(document).on('pageSwitchEdit'+item.id,function(){
				that.currentPE = null
				that.clear()
				$(document).trigger('editorRemove')
				// var pageData = that.filterPage(item.id)
				// that.renderPage(pageData[0])
			})
		})
	},
	preview:function(){
		//通过iframe 对象的postMessage传输数据舞台数据
		var editdata = JSON.stringify(global.STAGE.data)
		global.saveData(editdata,function(data){
			layer.open({
				type: 2,
				title: '手机预览',
				maxmin: true,
				shadeClose: true, //点击遮罩关闭层
				area : [(global.width+200)+'px', (global.height+80)+'px'],
				content: 'preview.html',
				success:function(layero, index){
					$('iframe',layero)[0].contentWindow.postMessage(editdata,'*')
				}
		  	});
		})
		
		// 注意return false取消链接的默认动作  
		// return false;
	},
	deleteCompoent:function(){
		var that = this
		$(global.STAGE.currentPage.compoent).map(function(obj,index){
			if(obj.id == that.currentPE.compoent.id){
				global.STAGE.currentPage.compoent.splice(index,1)
			}
		})
		$(global.STAGE.currentPage.data.compoent).map(function(obj,index){
			if(obj.id == that.currentPE.compoent.id){
				global.STAGE.currentPage.data.compoent.splice(index,1)
			}
		})
		this.currentPE.eleBox.remove()
		this.currentPE.compoent.eleBox.remove()
		$('#deleteCompoent').hide()
		this.currentPE = null
		$(document).trigger('editorRemove')
	},
	showContext:function(){
		new contextEdit()
	},
	getZindexArr:function(){
		return this.compoentEditObj.sort(function(a,b){
			return a.zIndex-b.zIndex
		})
	},
	//获取当前编辑对象在数组中的索引
	getIndex:function(arr){
		var that  = this;
		var currentIndex;
		$(arr).map(function(index,item){
			if(that.currentPE.zIndex == item.zIndex){
				currentIndex  = index
			}
		})
		return currentIndex
	},
	setZindexTop:function(){
		var that  = this
		//获取当前编辑对象数组 依照层级进行排序 从小到大
		var editComArr = this.getZindexArr()
		//保存最大的zindex值
		var zIndex = editComArr[editComArr.length-1].zIndex
		//对大于当前层级的对象依次递减
		$.map(editComArr,function(item,index){
			if(item.zIndex >that.currentPE.zIndex){
				item.zIndex-=1
				item.setState({zIndex:item.zIndex})
			}
		})
		//给当前对象赋最大层级
		this.currentPE.zIndex = zIndex
		this.currentPE.setState({zIndex:zIndex})
	},
	setZindexBottom:function(){
		var that  = this
		//获取当前编辑对象数组 依照层级进行排序 从小到大
		var editComArr = this.getZindexArr()
		//保存最小的zindex值
		var zIndex = editComArr[0].zIndex
		//对小于当前层级的对象依次递增
		$.map(editComArr,function(item,index){
			if(item.zIndex <that.currentPE.zIndex){
				item.zIndex+=1
				item.setState({zIndex:item.zIndex})
			}
		})
		//给当前对象赋最小层级
		this.currentPE.zIndex = zIndex
		this.currentPE.setState({zIndex:zIndex})
	},
	setZindexUp:function(){
		//获取当前编辑对象数组 依照层级进行排序 从小到大
		var editComArr = this.getZindexArr()
		//获取当前对象在数组中的索引
		var currentIndex = this.getIndex(editComArr)
		//获取当前编辑对象上一个层级对象
		if(currentIndex == editComArr.length-1){
			currentIndex = editComArr.length-1
			var upObj = editComArr[currentIndex]
		}else{
			var upObj = editComArr[(currentIndex+1)]
		}
		
		//互换层级位置
		var zIndex = this.currentPE.zIndex
		this.currentPE.zIndex = upObj.zIndex
		
		upObj.zIndex = zIndex
		upObj.setState(upObj)
		this.currentPE.setState(this.currentPE)
	},
	setZindexDown:function(){
		//获取当前编辑对象数组 依照层级进行排序 从小到大
		var editComArr = this.getZindexArr()
		//获取当前对象在数组中的索引
		var currentIndex = this.getIndex(editComArr)
		//获取当前编辑对象下一个层级对象
		if(currentIndex == 0){
			currentIndex = 0 
			var downObj = editComArr[currentIndex]
		}else{
			var downObj = editComArr[(currentIndex-1)]
		}
		
		//互换层级位置
		var zIndex = this.currentPE.zIndex
		this.currentPE.zIndex = downObj.zIndex
		
		downObj.zIndex = zIndex
		downObj.setState(downObj)
		this.currentPE.setState(this.currentPE)
	},
	addSucaiEdit:function(){
		//显示背景编辑器
		this.currentPE = null
		$(document).trigger('editorRemove')
		$('#editor').show()
		this.currentEdit = new sucaiEdit(global.STAGE.currentPage)
	}






}