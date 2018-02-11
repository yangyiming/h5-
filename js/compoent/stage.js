/**
 * 根据数据初始化成实体组件
 * 描述数据结构
 * 顶层是page类型
 * 数据结构中的id都是唯一
 * 这为我们对组件的事件单独操作提供了独立数据源
 * page包含compoent
 *[
     {
      "id":1,
      "type":"page",
      "x": 0,
      "y": 0,
      "rotate": 0,
      "bgColor":"red",
      "compoent":
        [
          {
              "id": 2,
              "type": "text",
              "str": "hello world",
              "width": 100,
              "height": 100,
              "rotate": 0,
              "scale": 1,
              "opacity": 1,
              "x": 100,
              "y": 100,
              "family": "黑体",
              "size": 10,
              "style": "bold",
              "align": "left",
              "zIndex": 1,
              "animate":{
                 "in":{
                   "type":"fly",
                   "time":2000
                 },
                 "out":{
                   "type":"fly",
                   "time":2000
                 }
              }
          },
          {
            "id": 3,
             "type": "image",
              "url": "../image/2.jpg",
              "width": 690,
              "height": 690,
              "rotate": 100,
              "scale": 1,
              "opacity": 1,
              "x": 300,
              "y": 300,
              "zIndex": 2
            
          }
        ]
    },
    {
      "id":4,
      "type":"page",
      "bgColor":"blue",
       "x": 0,
      "y": 0,
      "compoent":
        [
          {
              "id": 5,
              "type": "text",
              "str": "hello world",
              "width": 100,
              "height": 100,
              "rotate": 0,
              "scale": 1,
              
              "opacity": 1,
              "x": 300,
              "y": 300,
              "family": "宋体",
              "size": 10,
              "style": "bold",
              "align": "left",
              "zIndex": 1
            
          }
        ]
    }
]
 * @param  {[数组]}
 * @param  {[对象]}
 * @return {[void]}
 */
function stage(data,context){
	this.eleBox = $("<div id='stage'></div>")
	this.data = data
	//舞台的宽高
	this.width = global.width
	this.height = global.height
	this.pages = []
	if(this.data.length <=0){
		this.data.push({id:1})
	}
	//当前页面id
	this.currentId = this.data[0].id
	//下一个页面id
	this.nextId = null
	//当前页面数据
	this.currentPageData = {}
	//当前页面对象
	this.currentPage = {}
	this.context =context
	this.create() 
}
stage.prototype = {
	create:function(){
		var that = this
		//构建舞台
		this.createStage()
		//初始化页面事件
		this.pageEvent()
		//根据当前id过滤出数据
		this.currentPageData = this.filtePageData(this.currentId)
		//数据实体化
		this.renderPage(this.currentPageData)
		//不是在编辑界面，对窗口进行隐藏
		if(!global.isEdit){
			this.eleBox.css({overflow:'hidden'})
		}
		$(this.context).append(this.eleBox)
		//禁止手势滑动产生浏览器默认行为 
		 $(document).on('touchmove',function(e){
		 	e.preventDefault()
					 	
		 })
		 //绑定手势事件
		 //左滑是下一页
		 //右滑是上一页
		var myElement = $(this.context)[0]
		var mc = new Hammer(myElement)
		mc.on('swipeleft swiperight',function(event){
			switch(event.type){
				case 'swipeleft':
					that.next()
				break;
				case 'swiperight':
					that.prev()
				break;
				default:
				break
			}
		})
		//预览界面绑定上一页和下一页按钮
		if($('#next').length > 0){
			$('#next').on('click',$.proxy(this.next,this))
		}
		if($('#prev').length > 0){
			$('#prev').on('click',$.proxy(this.prev,this))
		}
	},
	renderPage:function(data){
		var that = this
		//实例化页面对象
		var pageObj = new page(data)
		//保存页面对象实例
		this.pages.push(pageObj)
		this.currentPage = pageObj
		//执行dom操作
		this.eleBox.append(this.currentPage.eleBox)
		//绑定渲染组建事件
		//在入场动画结束时初始化构建内部组件
		$(document).one('startRenderCompoent'+pageObj.id,function(){
			that.renderCompoents()
		})
		//页面对象可添加动画效果
		//事件绑定在dom节点
		//所有组件都是以这种方式触发动画
		//按照顺序是先执行page类型的动画 执行完成以后再按顺序渲染响应的组件对象
		//如果page没有动画 则跳过动画直接执行组件渲染操作
		//触发入场动画
		this.currentPage.eleBox.trigger(this.currentPage.animateIn+data.id)
	},
	renderCompoents:function(){
		var that  = this
		that.currentPage.renderCompoent()
		$(that.currentPage.compoent).each(function(){
			that.eleBox.append($(this.eleBox))
		})
		//要是页面时编辑状态，则需要先清除 编辑页面的元素
		if(global.isEdit && !this.isEmptyObject(global.EDIT)){
			global.EDIT.clear()
			$(document).trigger('editorRemove')
			global.EDIT.renderPage(this.currentPage)
		}
	},
	isEmptyObject:function(e) {  
	    var t;  
	    for (t in e)  
	        return !1;  
	    return !0  
	} ,
	filtePageData:function(id){
		var obj = $.map(this.data,function(item,index){
			if(item.id == id){
				return item
			}
		})
		return obj[0]
	},
	createStage:function(){
		this.eleBox.css({
				width:this.width,
				height:this.height,
				border:'1px solid #ddd',
				position:'absolute',
				left:'50%',
				top:'50%',
				marginLeft:-this.width/2,
				marginTop:-this.height/2,
				zIndex:1
			})
		if(global.isEdit){
			this.eleBox.css({
				width:this.width+2,
				height:this.height+2,
				border:'1px solid #ddd'
			})
		}
	},
	isInPages:function(data){
		var isPages = false
		$.map(this.pages,function(index,item){
			if(item.id == data.id){
				isPages = true
			}
		})
		return isPages
	},
	switchPage:function(id){
		var that = this
		this.nextId = id
		$('#editor').hide()
		// this.getNextPage()
		//组件的出场动画总时间不等于0 则执行出场动画
		if(global.STAGE.currentPage.outTime <= 0){
			$(document).trigger('pageSwitchStage'+global.STAGE.nextId)
		} else {
			//所有组件执行出场动画
			$.map(this.currentPage.compoent,function(obj){
				obj.commonAnimate.runOutAnimate()
			})
			//当前也页面出场动画时间 和 当前页面出场动画时间相减  则执行当前页面出场动画
			if(global.STAGE.currentPage.outTime - global.STAGE.currentPage.commonAnimate.animate.out.time <= 0){
				that.currentPage.commonAnimate.runOutAnimate()
			}
			//绑定所有组件出场动画执行完 以后，再执行当前页面出场动画
			$(document).off('endPageAnimate').on('endPageAnimate',function(){
				that.currentPage.commonAnimate.runOutAnimate()
			})
		}
	},
	//绑定页面切换事件
	pageEvent:function(){
		var that = this
		//页面绑定切换事件
		$.map(this.data,function(item,index){
			$(document).on('pageSwitchStage'+item.id,that.switch(item.id))
		})
	},
	switch:function(id){
		var that = this
		return function(){
			//根据给定的id 得到页面数据
			that.currentPageData = that.filtePageData(id)
			//清空pages 中重复的数据
			that.clear(that.currentPageData)
			//重新渲染数据
			that.renderPage(that.currentPageData)
			that.currentId = id

		}
	},
	//清空pages中重复的数据
	clear:function(data){
		var isRepeat = false
		var that = this
		var temp = 0
		this.eleBox.empty()
		$.map(this.pages,function(item,index){
			if(item.id == data.id){
				temp = index
				isRepeat = true
			}
		})
		if(isRepeat){
			that.pages.splice(temp,1)
		}
	},
	next:function(){
		//页面按照顺序排列渲染 点击显示下一张页面
		var that = this
		var index = $.map(this.data,function(item,index){
			if(item.id == that.currentId){
				return index
			}
		})
		
		if(index < this.data.length -1){
			var nextindex = parseInt(index)+1
		}else {
			var nextindex = index
		}
		var id = this.data[nextindex].id
		if(id == this.currentId){
			return
		}
		this.switchPage(id)
	},
	prev:function(){
		//页面按照顺序排列渲染 点击显示上一张页面
		var that = this
		var index = $.map(this.data,function(item,index){
			if(item.id == that.currentId){
				return index
			}
		})
		if(index > 0){
			var previndex = parseInt(index)-1
		}else {
			var previndex = 0
		}
		var id = this.data[previndex].id
		if(id == this.currentId){
			return
		}
		this.switchPage(id)
	},
	addPage:function(id){
		//初始化页面实例
		var obj = new page({id:id})
		//加入pages
		this.pages.push(obj)
		//数据添加
		this.data.push(obj.data)
		this.currentPage = obj
		this.eleBox.append(this.currentPage.eleBox)
		//绑定页面切换事件
		$(document).on('pageSwitchStage'+id,this.switch(id))
		//根据当前id切换页面
		$(document).trigger('pageSwitchStage'+id)
	}
}