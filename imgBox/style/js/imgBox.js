(function ($) {
	var methods = {
		init:function (opts) {
			var opts = $.extend(true, {}, options, opts);
			return this.each(function(){
				var _this = $(this), clength =  $(this).find('ul li').length,dotlist = ['<div class="dotList">'];
				//修改元素结构
				$(this).find('ul li').each(function (index,item) {
					if(index==0){
						dotlist.push('<span class="dot active"></span>');
						$(this).addClass('middle');
					}
					if(index==1){
						$(this).addClass('right');
					}
					if(index!=1 && index == $(".imgList li:last").index() ){
						$(this).addClass('left');
					}
					dotlist.push('<span class="dot"></span>');
				});
				dotlist.push('</div>');
				$(this).append(dotlist.join(''));
				var wwidth= $(window).width(),dwidth = $('.dotList').width();
				$('.dotList').css('left',(wwidth-dwidth)/2);
				//
				var oMover = $("ul", _this);//滚动元素
				var startX = 0, startY = 0; //触摸开始时手势横纵坐标 
				var oPosition = {}; //触点位置
				var iCurr = 0; //当前滚动屏幕数
				var oLi = $("li", oMover); //滚动单元
            	var num = oLi.length; //滚动屏幕数
            	var temPos = []; //滚动元素当前位置
            	var oFocus = $("span", $(".dotList"));
				//绑定触摸事件
	            function bindTochuEvent(){
	                oMover.get(0).addEventListener('touchstart', touchStartFunc, false);
	                oMover.get(0).addEventListener('touchmove', touchMoveFunc, false);
	                oMover.get(0).addEventListener('touchend', touchEndFunc, false);
	            }
				bindTochuEvent();
				//获取触点位置
	            function touchPos(e){
	                var touches = e.changedTouches, l = touches.length, touch, tagX, tagY;
	                for (var i = 0; i < l; i++) {
	                    touch = touches[i];
	                    tagX = touch.clientX;
	                    tagY = touch.clientY;
	                }
	                oPosition.x = tagX;
	                oPosition.y = tagY;
	                return oPosition;
	            }
	            //触摸开始
	            function touchStartFunc(e){
	                touchPos(e);
	                startX = oPosition.x;
	                startY = oPosition.y;
	                temPos[0] = $(".left").position().left;
	                temPos[1] = $(".middle").position().left;
	                temPos[2] = $(".right").position().left;
	            }
	            //触摸移动 
	            function touchMoveFunc(e){
	                touchPos(e);
	                var moveX = oPosition.x - startX;
	                var moveY = oPosition.y - startY;
	                if (Math.abs(moveY) < Math.abs(moveX)) {
	                    e.preventDefault();
	                    $(".left").css({left: temPos[0] + moveX});
	                    $(".middle").css({left: temPos[1] + moveX,});
	                    $(".right").css({left: temPos[2] + moveX});
	                }
	            }
	            //触摸结束
	            function touchEndFunc(e){
	                touchPos(e);
	                var moveX = oPosition.x - startX;
	                var moveY = oPosition.y - startY;
	                if (Math.abs(moveY) < Math.abs(moveX)) {
	                    if (moveX > 0) {
	                        iCurr--;
	                        if (iCurr >= 0) {
	                            var moveX = iCurr * moveWidth;
	                            $(".left").stop().animate({left: -moveX}).hide();
	                            $(".middle").stop().animate({left: -moveX}).hide();
	                            $(".right").stop().animate({left: -moveX}).hide();
	                        }
	                        else {
	                            
	                            iCurr = 0;
	                        }
	                    }else {
	                        iCurr++;
	                        if (iCurr < num && iCurr >= 0) {
	                            $(".left").stop().removeClass('left').removeAttr('style');
	                            $(".middle").stop().removeClass('middle').addClass('left').removeAttr('style');
	                            $(".right").stop().removeClass('right').addClass('middle').removeAttr('style');
	                            _this.find('li:eq('+(iCurr+1)+')').addClass('right');
	                        }
	                        else {
	                            iCurr = num - 1;
	                           
	                        }
	                    }
	                    oFocus.eq(iCurr).addClass("active").siblings().removeClass("active");
	                }
	            }
			});
		}
	};
	var options = {};
	$.fn.imgBox = function (method) {
		if(methods[method]){
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		} else if(typeof method === 'object' || !method){
			return methods.init.apply(this,arguments);
		} else {
			$.error("Method " + method + ' does not exist on jQuery.imgBox');
		}
	}
})(window.jQuery)

jQuery(document).ready(function(){
	$(".imgBox").imgBox();
});


