      
/**动画组件对象
 * 包含于组件中
 * 根据数据结构实例化组件动画对象
 * 绑定组件入场动画和出场动画事件
 * 动画的基础是根据css3定义的动画类 animate.min.css 
 * 组件添加相应的class即可触发动画
 * 全局window.animateConfig 定义了css3动画类型
 * 数据结构
 * in 对象 代表入场动画数据结构
 * 	type  动画类型
 * 	time  动画执行时间
 * on 对象代表出场动画数据结构
 * 	type  动画类型
 * 	time  动画执行时间
 * animate:{
           "in":{
             "type":"fadeIn",
             "time":1
           },
            "out":{
              "type":"fadeOut",
             "time":1
           }
         }
 * @param  {[object]} 组件对象
 * @return {[type]}
 */
function commonAnimate(obj){
	this.compoent = obj
	this.ele = obj.eleBox
	this.data = obj.data
	this.animate = this.data.animate 
	//默认动画执行时间
	this.defaultTime = 1000
	//动画数据结构
	if(typeof this.animate == 'undefined'){
		this.animate = {
			"in":{
			              "type":"",
			              "time":0
	            		},
		            "out":{
			            "type":"",
			            "time":0
	        		}		
		}
	}
	//判断有无入场动画和出场动画数据结构
	if(!this.animate.hasOwnProperty('in')){
		 this.animate.in = {
		              "type":"",
		              "time":this.defaultTime
            		}
	}
	if(!this.animate.hasOwnProperty('out')){
		 this.animate.out = {
		              "type":"",
		              "time":this.defaultTime
            		}
	}
	this.prefixs = ['ms','moz','webkit','o']
	//初始化动画对象
	this.init()
}
commonAnimate.prototype = {
	//入场动画执行方法
	in:function(type){
		this.animate.in.type  = type 
		if(type==''){
			this.animate.in.time = 0
		}else{
			this.animate.in.time = this.defaultTime
		}
		this.init()
		this.data.animate = this.animate
		this.compoent.eleBox.trigger(this.compoent.animateIn+this.compoent.id,'beta')
	},
	//出场动画执行方法
	out:function(type){
		this.animate.out.type  = type 
		if(type ==''){
			this.animate.out.time = 0
		}else{
			this.animate.out.time = this.defaultTime
		}
		this.init()
		this.data.animate = this.animate
		this.getAllOutTime()
		this.compoent.eleBox.trigger(this.compoent.animateOut+this.compoent.id,'beta')
		
	},
	changeTime:function(time){

		this.getAllOutTime()
		this.animate.in.time = time
		this.animate.out.time = time
	},
	getAllOutTime:function(){
		var outTime = 0
		outTime+=parseInt(global.STAGE.currentPage.commonAnimate.animate.out.time)
		$.map(global.STAGE.currentPage.compoent,function(obj){
			outTime+=parseInt(obj.commonAnimate.animate.out.time)
		})
		global.STAGE.currentPage.outTime = outTime
	},
	init:function(){
		var that = this
		//根据当前组件的id绑定入场动画
		this.compoent.eleBox.off(this.compoent.animateIn+this.compoent.id).on(this.compoent.animateIn+this.compoent.id,function(){
			//如果当前是编辑状态 隐藏编辑状态效果
			if(global.isEdit && global.EDIT.currentPE){
				global.EDIT.currentPE.hideBorder()
			}
			//执行组件入场动画
			that.run(that.animate.in,function(prop){
				//要是当前组件属于page类型
				if(that.compoent.type=='page'){
					//出发页面渲染事件 开始渲染组件
					$(document).trigger('startRenderCompoent'+that.compoent.id)
				}
				//要是当前属于编辑状态
				if(global.isEdit){
					//如果当前渲染动画不是page 则执行动画结束回调
					//需要在动画结束的时候添加编辑模式事件 绑定在edit.js类中
					if(that.compoent.type !== 'page'){
						$(document).trigger('comEditAnimateOver'+that.compoent.id)
					}
					//停止动画
					that.ele.css({transition: ''})
					//编辑组件编辑状态
					if(global.EDIT.currentPE){
						global.EDIT.currentPE.showBorder()
					}
				} 
			},'in')
		})
	

		this.compoent.eleBox.off(this.compoent.animateOut+this.compoent.id).on(this.compoent.animateOut+this.compoent.id,function(event,status){
			var target = this
			//如果当前是编辑状态 隐藏编辑状态效果
			if(global.isEdit && global.EDIT.currentPE){
				global.EDIT.currentPE.hideBorder()
			}
			//执行组件出场动画
			that.run(that.animate.out,function(prop){
				//动画执行完成组件隐藏 
				that.ele.css({display:'none'})
				//编辑状态 组件不需要时间计算和页面切换
				if(status == 'beta'){
					that.ele.show()
					if(global.isEdit && global.EDIT.currentPE){
						global.EDIT.currentPE.showBorder()
					}
				}else{
					//执行完动画需要扣除页面类型的组件动画执行时间
					global.STAGE.currentPage.outTime-=that.animate.out.time
					//当执行完成最后一个组件的出场动画时 切换页面
					if(global.STAGE.currentPage.outTime <= 0){
						
						$(document).trigger('pageSwitchStage'+global.STAGE.nextId)
					}else{
						//扣除当前组件动画执行时间
						if(global.STAGE.currentPage.data.hasOwnProperty('animate')){
							var pageTime = global.STAGE.currentPage.outTime-global.STAGE.currentPage.data.animate.out.time
						}
						if(pageTime<= 0){
							//所有动画结束时触发 页面类型的组件动画 出场事件
							//所有组件出场动画结束 才会触发页面出场动画
							$(document).trigger('endPageAnimate')
						}
					}
				}
				
				
			},'out')
		})
		
		
	},
	//页面切换的时候 执行出场动画
	runOutAnimate:function(){

			this.compoent.eleBox.trigger(this.compoent.animateOut+this.compoent.id)
	
	},
	//动画执行入口
	run:function(prop,callback,status){
		var that = this 
		//webkitTransitionEnd有多次绑定问题 只需要绑定一次
		//变动属性个数决定webkitTransitionEnd事件触发的次数 
		this.ele.one( 
		    'webkitTransitionEnd webkitAnimationEnd',
		    function(event) { 
		    	//动画执行结束触发回调
			callback()
			that.ele.removeClass()
		    })	
		//要是组件没有赋予动画类型 直接执行回调
		if(prop.type){
			that.ele.addClass(prop.type)
			that.ele.css({animationDuration:prop.time/1000+'s'})
		}else{
			callback()
		}	
		
	}
}