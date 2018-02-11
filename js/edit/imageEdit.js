function imageEdit(compoent){
	this.compoent = compoent
	this.tpl = '../tpl/imageEdit.html'
	this.editor = $('#imageEdit')
	if(typeof compoent.orignUrl !== 'undefined'){
		this.imageUrl = compoent.orignUrl 
	}else {
		compoent.orignUrl = this.imageUrl = compoent.url
	}
	
	this.type = 'imageEdit'
	this.create()
}
imageEdit.prototype= {
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
		this.editor = $('#imageEdit')
		var imgHtml  = $('<img src='+this.imageUrl+'>')
		this.editor.append(imgHtml)
		this.animateEdit = new animateEdit(this.compoent)
		this.imageSelect = imgHtml.imgAreaSelect({
       	 	handles: true,
       	 	instance: true,
       	 	hide:true,
       	 	onSelectEnd: function (img, selection) {
       	 		var orignImg = new Image()
       	 		if(typeof that.compoent.orignUrl !== 'undefined'){
				orignImg.src = that.compoent.orignUrl 
			}else {
				orignImg.src = that.imageUrl
			}
       	 		
       	 		orignImg.onload = function(){
       	 			that.orignW = orignImg.width
       	 			that.orignH = orignImg.height
	       	 		var radioW = that.orignW/img.width
	       	 		var radioH = that.orignH/img.height
	       	 		var width = selection.width*radioW
	       	 		var height = selection.height*radioH
	       	 		var sx = selection.x1*radioW
	       	 		var sy = selection.y1*radioH
	  			
	       	 		that.compoent.url = that.imageUrl = that.canvaDrawImage(img,sx,sy,that.orignW,that.orignH,0,0,width,height)
	       	 		var base64ImageContent = that.compoent.url.replace(/^data:image\/(png|jpg);base64,/, "");
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
	 				success:function(){
	 					console.log("Data Uploaded: ")
	 				}
	       	 		})
	       	 		var newImage = new Image()
	       	 		newImage.src = that.imageUrl
	       	 		newImage.onload = function(){
	       	 			that.compoent.width = global.EDIT.currentPE.width = newImage.width
	       	 			that.compoent.height = global.EDIT.currentPE.height = newImage.height
	       	 			that.compoent.setState(that.compoent)
	       	 			global.EDIT.currentPE.setState(global.EDIT.currentPE)
	       	 		}
       	 		}
			}
		})

	},
	getUrl:function(){
		
	},
	canvaDrawImage:function(img,sx,sy,swidth,sheight,x,y,width,height){
		var crop_canvas = document.createElement('canvas')
	    crop_canvas.width = width
	    crop_canvas.height = height
	       
	    crop_canvas.getContext('2d').drawImage(img,sx,sy,swidth,sheight,x,y,swidth,sheight);   
	    /*var url = crop_canvas.toDataURL("image/png");
	    $('body').append(convertCanvasToImage(crop_canvas));*/
	    return crop_canvas.toDataURL("image/png");
	},
	remove:function(){
		$('#editor').hide()
		this.editor.remove()
		this.imageSelect.remove()
	}
}

