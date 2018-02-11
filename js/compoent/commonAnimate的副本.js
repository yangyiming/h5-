 // "animate":{
 //             "in":{
 //               "type":"fadeIn",
 //               "time":1
 //             },
 //             "out":{
 //               "type":"fadeOut",
 //               "time":1
 //             }
 //           }
 //            

function commonAnimate(obj){
	this.compoent = obj
	this.ele = obj.eleBox
	this.data = obj.data
	this.animate = this.data.animate 
	this.defaultTime = 1000
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
	this.animateInstance = {in:{animate:'',time:''},out:{animate:'',time:''}}
	this.prefixs = ['ms','moz','webkit','o']
	// this.orignData = {x:this.data.x,y:this.data.y,width:this.data.width,height:this.data.height,scale:this.data.scale,rotate:this.data.rotate}
	this.dataInit()
	this.init()
}
commonAnimate.prototype = {
	dataInit:function(){

		for(var x in this.animate){

				for(var y in this.animate[x]){
					if(y == "time"){	
						this.animateInstance.in.time = this.animate.in.time
						this.animateInstance.out.time = this.animate.out.time
					}
					//飞入
					if(y == "type"){
						if(this.animate[x][y] == 'fly' && x=='in'){
							this.animateInstance.in.animate = 'rotateIn'
						}
						if(this.animate[x][y] == 'fly' && x=='out'){
							this.animateInstance.in.animate = 'rotateOut'
						}
						if(this.animate[x][y] == 'rotate' && x=='in'){
							
							this.animateInstance.in.animate = 'rotateIn'
						}
						if(this.animate[x][y] == 'rotate' && x=='out'){
						
							this.animateInstance.out.animate = 'rotateOut'
						}
						if(this.animate[x][y] == ''){
							
						}
					}
				}
			
		}
	},
	in:function(type){
		this.animate.in.type  = type 
		if(type==''){
			this.animate.in.time = 0
		}else{
			this.animate.in.time = this.defaultTime
		}
		this.dataInit()
		this.init()
		this.data.animate = this.animate
		this.compoent.eleBox.trigger(this.compoent.animateIn+this.compoent.id,'beta')
	},
	out:function(type){
		this.animate.out.type  = type 
		if(type ==''){
			this.animate.out.time = 0
		}else{
			this.animate.out.time = this.defaultTime
		}
		this.dataInit()
		this.init()
		this.data.animate = this.animate
		this.getAllOutTime()
		this.compoent.eleBox.trigger(this.compoent.animateOut+this.compoent.id,'beta')
		
	},
	changeTime:function(time){

		this.getAllOutTime()
		this.animate.in.time = time
		this.animate.out.time = time
		this.dataInit()
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
		if(this.animate.in.type!==''){
			this.compoent.eleBox.on(this.compoent.animateIn+this.compoent.id,function(){
				if(global.isEdit && global.EDIT.currentPE){
					global.EDIT.currentPE.hideBorder()
				}
				that.run(that.animateInstance.in,function(prop){
					if(that.compoent.type=='page'){
						$(document).trigger('startRenderCompoent'+that.compoent.id)
					}
					if(global.isEdit){
						if(that.compoent.type !== 'page'){
							$(document).trigger('comEditAnimateOver'+that.compoent.id)
						}
						that.ele.css({transition: ''})
						if(global.EDIT.currentPE){
							global.EDIT.currentPE.showBorder()
						}
					} 
				},'in')
			})
		}
		if(this.animate.out.type!==''){
			this.compoent.eleBox.on(this.compoent.animateOut+this.compoent.id,function(event,status){
				var target = this
				if(global.isEdit && global.EDIT.currentPE){
					global.EDIT.currentPE.hideBorder()
				}
				
				that.run(that.animateInstance.out,function(prop){
					that.ele.css({display:'none'})
					if(status == 'beta'){
						that.ele.show()
						if(global.isEdit && global.EDIT.currentPE){
							global.EDIT.currentPE.showBorder()
						}
					}else{
						global.STAGE.currentPage.outTime-=that.animate.out.time
						if(global.STAGE.currentPage.outTime <= 0){
							//恢复组建数据
							$(document).trigger('pageSwitchStage'+global.STAGE.nextId)
						}else{
							var pageTime = global.STAGE.currentPage.outTime-global.STAGE.currentPage.data.animate.out.time
							if(pageTime<= 0){
								$(document).trigger('endPageAnimate')
							}
						}
					}
					
					
				},'out')
			})
		}
		
	},
	runOutAnimate:function(){
		if(this.animate.out.type!==''){
			this.compoent.eleBox.trigger(this.compoent.animateOut+this.compoent.id)
		}else {
			this.ele.css({display:'none'})
		}
	},
	run:function(prop,callback,status){
		var that = this 
		//webkitTransitionEnd有多次绑定问题 只需要绑定一次
		//变动属性个数决定webkitTransitionEnd事件触发的次数 
	
		this.ele.one( 
		    'webkitTransitionEnd webkitAnimationEnd',
		    function(event) { 
		    	
			callback()
			
		    })
		
		if(prop.animate){
			that.ele.addClass(prop.animate)
			that.ele.css({animationDuration:prop.time/1000+'s'})
		}else{
			callback()
		}	
		
	}
}