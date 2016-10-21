/**
 * $.yxMobileSlider
 * @charset utf-8
 * @extends jquery.1.9.1
 * @fileOverview 创建一个焦点轮播插件，兼容PC端和移动端，若引用请保留出处，谢谢！
 * @author 李玉玺
 * @version 1.0
 * @date 2013-11-12
 * @example
 * $(".container").yxMobileSlider();
 */
(function($){
    $.fn.yxMobileSlider = function(settings){
        var defaultSettings = {
            width: 640, //容器宽度
            height: 320, //容器高度
            during: 5000, //间隔时间
            speed:30 //滑动速度
        }
        settings = $.extend(true, {}, defaultSettings, settings);
        return this.each(function(){
            var _this = $(this), s = settings;
            var startX = 0, startY = 0; //触摸开始时手势横纵坐标 
            var temPos; //滚动元素当前位置
            var iCurr = 0; //当前滚动屏幕数
            var timer = null; //计时器
            var oMover = $("ul", _this); //滚动元素
            var oLi = $("li", oMover); //滚动单元
            var num = oLi.length; //滚动屏幕数
            var oPosition = {}; //触点位置
            var moveWidth = s.width; //滚动宽度
            //初始化主体样式
            _this.width(s.width).height(s.height).css({
                position: 'relative',
                overflow: 'hidden',
				margin:'0 auto'
            }); //设定容器宽高及样式
            oMover.css({
                position: 'absolute',
                left: 0
            });
            oLi.css({
                float: 'left',
                display: 'inline'
            });
            $("img", oLi).css({
                width: '100%',
                height: '100%'
            });
            //初始化焦点容器及按钮
            _this.append('<div class="focus"><div></div></div>');
            var oFocusContainer = $(".focus");
            for (var i = 0; i < num; i++) {
                $("div", oFocusContainer).append("<span></span>");
            }
            var oFocus = $("span", oFocusContainer);
            oFocusContainer.css({
                minHeight: $(this).find('span').height() * 2,
                position: 'absolute',
                bottom: 0,
                background: 'rgba(0,0,0,0.5)'
            })
            $("span", oFocusContainer).css({
                display: 'block',
                float: 'left',
                cursor: 'pointer'
            })
            $("div", oFocusContainer).width(oFocus.outerWidth(true) * num).css({
                position: 'absolute',
                right: 10,
                top: '50%',
                marginTop: -$(this).find('span').width() / 2
            });
            oFocus.first().addClass("current");
            //页面加载或发生改变
            $(window).bind('resize load', function(){
                if (isMobile()) {
                    mobileSettings();
                    bindTochuEvent();
                }
                oLi.width(_this.width()).height(_this.height());//设定滚动单元宽高
                oMover.width(num * oLi.width());
                oFocusContainer.width(_this.width()).height(_this.height() * 0.15).css({
                    zIndex: 2
                });//设定焦点容器宽高样式
                _this.fadeIn(300);
            });
            //页面加载完毕BANNER自动滚动
            autoMove();
            //PC机下焦点切换
            if (!isMobile()) {
                oFocus.hover(function(){
                    iCurr = $(this).index() - 1;
                    stopMove();
                    doMove();
                }, function(){
                    autoMove();
                })
            }
            //自动运动
            function autoMove(){
                timer = setInterval(doMove, s.during);
            }
            //停止自动运动
            function stopMove(){
                clearInterval(timer);
            }
            //运动效果
            function doMove(){
                iCurr = iCurr >= num - 1 ? 0 : iCurr + 1;
                doAnimate(-moveWidth * iCurr);
                oFocus.eq(iCurr).addClass("current").siblings().removeClass("current");
            }
            //绑定触摸事件
            function bindTochuEvent(){
                oMover.get(0).addEventListener('touchstart', touchStartFunc, false);
                oMover.get(0).addEventListener('touchmove', touchMoveFunc, false);
                oMover.get(0).addEventListener('touchend', touchEndFunc, false);
            }
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
                clearInterval(timer);
                touchPos(e);
                startX = oPosition.x;
                startY = oPosition.y;
                temPos = oMover.position().left;
            }
            //触摸移动 
            function touchMoveFunc(e){
                touchPos(e);
                var moveX = oPosition.x - startX;
                var moveY = oPosition.y - startY;
                if (Math.abs(moveY) < Math.abs(moveX)) {
                    e.preventDefault();
                    oMover.css({
                        left: temPos + moveX
                    });
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
                            doAnimate(-moveX, autoMove);
                        }
                        else {
                            doAnimate(0, autoMove);
                            iCurr = 0;
                        }
                    }
                    else {
                        iCurr++;
                        if (iCurr < num && iCurr >= 0) {
                            var moveX = iCurr * moveWidth;
                            doAnimate(-moveX, autoMove);
                        }
                        else {
                            iCurr = num - 1;
                            doAnimate(-(num - 1) * moveWidth, autoMove);
                        }
                    }
                    oFocus.eq(iCurr).addClass("current").siblings().removeClass("current");
                }
            }
            //移动设备基于屏幕宽度设置容器宽高
            function mobileSettings(){
                moveWidth = $(window).width();
                var iScale = $(window).width() / s.width;
                _this.height(s.height * iScale).width($(window).width());
                oMover.css({
                    left: -iCurr * moveWidth
                });
            }
            //动画效果
            function doAnimate(iTarget, fn){
                oMover.stop().animate({
                    left: iTarget
                }, _this.speed , function(){
                    if (fn) 
                        fn();
                });
            }
            //判断是否是移动设备
            function isMobile(){
                if (navigator.userAgent.match(/Android/i) || navigator.userAgent.indexOf('iPhone') != -1 || navigator.userAgent.indexOf('iPod') != -1 || navigator.userAgent.indexOf('iPad') != -1) {
                    return true;
                }
                else {
                    return false;
                }
            }
        });
    }
})(jQuery);


/**
 * @name	jQuery.touchSlider
 * @version	201209_2
 * @since	201106
 * @param Object	settings	환경변수 오브젝트
 *		roll			-	순환 (default true)
 *		flexible		-	유동 레이아웃 (default false)
 *		view			-	다중 컬럼 (default 1)
 *		speed			-	애니메이션 속도 (default 75)
 *		range			-	넘김 판정 범위 (default 0.15)
 *		page			-	초기 페이지 (default 1)
 *		transition		-	CSS3 transition 사용 (default false)
 *		btn_prev		-	prev 버튼 (jQuery Object, default null)
 *		btn_next		-	next 버튼 (jQuery Object, default null)
 *		paging			-	page 버튼 (jQuery Object, default null)
 *		initComplete	-	초기화 콜백
 *		counter			-	슬라이드 콜백, 카운터
 *
 * @example
	$("#target").touchSlider({
		flexible : true
	});
*/

(function ($) {
	
	$.fn.touchSlider = function (settings) {
		
		settings.supportsCssTransitions = (function (style) {
			var prefixes = ['Webkit','Moz','Ms'];
			for(var i=0, l=prefixes.length; i < l; i++ ) {
				if( typeof style[prefixes[i] + 'Transition'] !== 'undefined') {
					return true;
				}
			}
			return false;
		})(document.createElement('div').style);
		
		settings = jQuery.extend({
			roll : true,
			flexible : false,
			btn_prev : null,
			btn_next : null,
			paging : null,
			speed : 75,
			view : 1,
			range : 0.15,
			page : 1,
			transition : false,
			initComplete : null,
			counter : null,
			multi : false
		}, settings);
		
		var opts = [];
		opts = $.extend({}, $.fn.touchSlider.defaults, settings);
		
		return this.each(function () {
			
			$.fn.extend(this, touchSlider);
			
			var _this = this;
			
			this.opts = opts;
			this._view = this.opts.view;
			this._speed = this.opts.speed;
			this._tg = $(this);
			this._list = this._tg.children().children();
			this._width = parseInt(this._tg.css("width"));
			this._item_w = parseInt(this._list.css("width"));
			this._len = this._list.length;
			this._range = this.opts.range * this._width;
			this._pos = [];
			this._start = [];
			this._startX = 0;
			this._startY = 0;
			this._left = 0;
			this._top = 0;
			this._drag = false;
			this._scroll = false;
			this._btn_prev;
			this._btn_next;
			
			this.init();
			
			$(this)
			.bind("touchstart", this.touchstart)
			.bind("touchmove", this.touchmove)
			.bind("touchend", this.touchend)
			.bind("dragstart", this.touchstart)
			.bind("drag", this.touchmove)
			.bind("dragend", this.touchend)
			
			$(window).bind("orientationchange resize", function () {
				_this.resize(_this);
			});
		});
	
	};
	
	var touchSlider = {
		
		init : function () {
			var _this = this;
			
			$(this).children().css({
				"width":this._width + "px",
				"overflow":"visible"
			});
			
			if(this.opts.flexible) this._item_w = this._width / this._view;
			if(this.opts.roll) this._len = Math.ceil(this._len / this._view) * this._view;
			
			var page_gap = (this.opts.page > 1 && this.opts.page <= this._len) ? (this.opts.page - 1) * this._item_w : 0;
			
			for(var i=0; i<this._len; ++i) {
				this._pos[i] = this._item_w * i - page_gap;
				this._start[i] = this._pos[i];
				this._list.eq(i).css({
					"float" : "none",
					"display" : "block",
					"position" : "absolute",
					"top" : "0",
					"left" : this._pos[i] + "px",
					"width" : this._item_w + "px"
				});
				if(this.opts.supportsCssTransitions && this.opts.transition) {
					this._list.eq(i).css({
						"-moz-transition" : "0ms",
						"-moz-transform" : "",
						"-ms-transition" : "0ms",
						"-ms-transform" : "",
						"-webkit-transition" : "0ms",
						"-webkit-transform" : "",
						"transition" : "0ms",
						"transform" : ""
					});
				}
			}
			
			if(this.opts.btn_prev && this.opts.btn_next) {
				this.opts.btn_prev.bind("click", function() {
					_this.animate(1, true);
					return false;
				})
				this.opts.btn_next.bind("click", function() {
					_this.animate(-1, true);
					return false;
				});
			}
			
			if(this.opts.paging) {
				$(this._list).each(function (i, el) {
					//var btn_page = _this.opts.paging.eq(0).clone();
					var btn_page = _this.opts.paging.eq(i);
					//_this.opts.paging.before(btn_page);
					
					btn_page.bind("click", function(e) {
						_this.go_page(i, e);
						return false;
					});
				});
				
				//this.opts.paging.remove();
			}
			
			this.counter();
			this.initComplete();
		},
		
		initComplete : function () {
			if(typeof(this.opts.initComplete) == "function") {
				this.opts.initComplete(this);
			}
		},
		
		resize : function (e) {
			if(e.opts.flexible) {
				var tmp_w = e._item_w;
				
				e._width = parseInt(e._tg.css("width"));
				e._item_w = e._width / e._view;
				e._range = e.opts.range * e._width;
				
				for(var i=0; i<e._len; ++i) {
					e._pos[i] = e._pos[i] / tmp_w * e._item_w;
					e._start[i] = e._start[i] / tmp_w * e._item_w;
					e._list.eq(i).css({
						"left" : e._pos[i] + "px",
						"width" : e._item_w + "px"
					});
					if(this.opts.supportsCssTransitions && this.opts.transition) {
						e._list.eq(i).css({
							"-moz-transition" : "0ms",
							"-moz-transform" : "",
							"-ms-transition" : "0ms",
							"-ms-transform" : "",
							"-webkit-transition" : "0ms",
							"-webkit-transform" : "",
							"transition" : "0ms",
							"transform" : ""
						});
					}
				}
			}
			
			this.counter();
		},
		
		touchstart : function (e) { 
			if((e.type == "touchstart" && e.originalEvent.touches.length <= 1) || e.type == "dragstart") {
				this._startX = e.pageX || e.originalEvent.touches[0].pageX;
				this._startY = e.pageY || e.originalEvent.touches[0].pageY;
				this._scroll = false;
				
				this._start = [];
				for(var i=0; i<this._len; ++i) {
					this._start[i] = this._pos[i];
				}
			}
		},
		
		touchmove : function (e) { 
			if((e.type == "touchmove" && e.originalEvent.touches.length <= 1) || e.type == "drag") {
				this._left = (e.pageX || e.originalEvent.touches[0].pageX) - this._startX;
				this._top = (e.pageY || e.originalEvent.touches[0].pageY) - this._startY;
				var w = this._left < 0 ? this._left * -1 : this._left;
				var h = this._top < 0 ? this._top * -1 : this._top;
				
				if (w < h || this._scroll) {
					this._left = 0;
					this._drag = false;
					this._scroll = true;
				} else {
					e.preventDefault();
					this._drag = true;
					this._scroll = false;
					this.position(e);
				}
				
				for(var i=0; i<this._len; ++i) {
					var tmp = this._start[i] + this._left;
					
					if(this.opts.supportsCssTransitions && this.opts.transition) {
						var trans = "translate3d(" + tmp + "px,0,0)";
						this._list.eq(i).css({
							"left" : "",
							"-moz-transition" : "0ms",
							"-moz-transform" : trans,
							"-ms-transition" : "0ms",
							"-ms-transform" : trans,
							"-webkit-transition" : "0ms",
							"-webkit-transform" : trans,
							"transition" : "0ms",
							"transform" : trans
						});
					} else {
						this._list.eq(i).css("left", tmp + "px");
					}
					
					this._pos[i] = tmp;
				}
			}
		},
		
		touchend : function (e) {
			if((e.type == "touchend" && e.originalEvent.touches.length <= 1) || e.type == "dragend") {
				if(this._scroll) {
					this._drag = false;
					this._scroll = false;
					return false;
				}
				
				this.animate(this.direction());
				this._drag = false;
				this._scroll = false;
			}
		},
		
		position : function (d) { 
			var gap = this._view * this._item_w;
			
			if(d == -1 || d == 1) {
				this._startX = 0;
				this._start = [];
				for(var i=0; i<this._len; ++i) {
					this._start[i] = this._pos[i];
				}
				this._left = d * gap;
			} else {
				if(this._left > gap) this._left = gap;
				if(this._left < - gap) this._left = - gap;
			}
			
			if(this.opts.roll) {
				var tmp_pos = [];
				for(var i=0; i<this._len; ++i) {
					tmp_pos[i] = this._pos[i];
				}
				tmp_pos.sort(function(a,b){return a-b;});

				
				var max_chk = tmp_pos[this._len-this._view];
				var p_min = $.inArray(tmp_pos[0], this._pos);
				var p_max = $.inArray(max_chk, this._pos);

				
				if(this._view <= 1) max_chk = this._len - 1;
				if(this.opts.multi) {
					if((d == 1 && tmp_pos[0] >= 0) || (this._drag && tmp_pos[0] >= 100)) {
						for(var i=0; i<this._view; ++i, ++p_min, ++p_max) {
							this._start[p_max] = this._start[p_min] - gap;
							this._list.eq(p_max).css("left", this._start[p_max] + "px");
						}
					} else if((d == -1 && tmp_pos[0] <= 0) || (this._drag && tmp_pos[0] <= -100)) {
						for(var i=0; i<this._view; ++i, ++p_min, ++p_max) {
							this._start[p_min] = this._start[p_max] + gap;
							this._list.eq(p_min).css("left", this._start[p_min] + "px");
						}
					}
				} else {
					if((d == 1 && tmp_pos[0] >= 0) || (this._drag && tmp_pos[0] > 0)) {
						for(var i=0; i<this._view; ++i, ++p_min, ++p_max) {
							this._start[p_max] = this._start[p_min] - gap;
							this._list.eq(p_max).css("left", this._start[p_max] + "px");
						}
					} else if((d == -1 && tmp_pos[max_chk] <= 0) || (this._drag && tmp_pos[max_chk] <= 0)) {
						for(var i=0; i<this._view; ++i, ++p_min, ++p_max) {
							this._start[p_min] = this._start[p_max] + gap;
							this._list.eq(p_min).css("left", this._start[p_min] + "px");
						}
					}
				}
			} else {
				if(this.limit_chk()) this._left = this._left / 2;
			}
		},
		
		animate : function (d, btn_click) {
			if(this._drag || !this._scroll || btn_click) {
				var _this = this;
				var speed = this._speed;
				
				if(btn_click) this.position(d);
				
				var gap = d * (this._item_w * this._view);
				if(this._left == 0 || (!this.opts.roll && this.limit_chk()) ) gap = 0;
				
				this._list.each(function (i, el) {
					_this._pos[i] = _this._start[i] + gap;
					
					if(_this.opts.supportsCssTransitions && _this.opts.transition) {
						var transition = speed + "ms";
						var transform = "translate3d(" + _this._pos[i] + "px,0,0)";
						
						if(btn_click) transition = "0ms";
						
						$(this).css({
							"left" : "",
							"-moz-transition" : transition,
							"-moz-transform" : transform,
							"-ms-transition" : transition,
							"-ms-transform" : transform,
							"-webkit-transition" : transition,
							"-webkit-transform" : transform,
							"transition" : transition,
							"transform" : transform
						});
					} else {
						$(this).stop();
						$(this).animate({"left": _this._pos[i] + "px"}, speed);
					}
				});			
				
				this.counter();
			}
		},
		
		direction : function () { 
			var r = 0;
		
			if(this._left < -(this._range)) r = -1;
			else if(this._left > this._range) r = 1;
			
			if(!this._drag || this._scroll) r = 0;
			
			return r;
		},
		
		limit_chk : function () {
			var last_p = parseInt((this._len - 1) / this._view) * this._view;
			return ( (this._start[0] == 0 && this._left > 0) || (this._start[last_p] == 0 && this._left < 0) );
		},
		
		go_page : function (i, e) {
			var crt = ($.inArray(0, this._pos) / this._view) + 1;
			var cal = crt - (i + 1);
			
			while(cal != 0) {
				if(cal < 0) {
					this.animate(-1, true);
					cal++;
				} else if(cal > 0) {
					this.animate(1, true);
					cal--;
				}
			}
		},
		
		counter : function () {
			if(typeof(this.opts.counter) == "function") {
				var param = {
					total : Math.ceil(this._len / this._view),
					current : ($.inArray(0, this._pos) / this._view) + 1
				};
				this.opts.counter(param);
			}
		}
		
	};

})(jQuery);


var heartbeat_timer = 0;
var last_health = -1;
var health_timeout = 30000;

$(function(){
			ws = ws_conn( "ws://www.zendstudio.net:9208/chat2" );
			$("#send_btn").click(function(){
				var msg = $("#mysendbox").val();
				ws.send( msg );
				$("#mysendbox").val("");
			});
});

function keepalive( ws ){
	var time = new Date();
	if( last_health != -1 && ( time.getTime() - last_health > health_timeout ) ){
			//此时即可以认为连接断开，可是设置重连或者关闭
			$("#keeplive_box").html( "服务器没有响应." ).css({"color":"red"});
			//ws.close();
	}
	else{
		$("#keeplive_box").html( "连接正常" ).css({"color":"green"});
		if( ws.bufferedAmount == 0 ){
			ws.send( '~H#C~' );
		}
	}
}

//websocket function
function ws_conn( to_url ){
	to_url = to_url || "";
	if( to_url == "" ){
		return false;
	}
	
	clearInterval( heartbeat_timer );
	$("#statustxt").html("Connecting...");
	var ws = new WebSocket( to_url );
  ws.onopen=function(){
		$("#statustxt").html("connected.");	
		$("#send_btn").attr("disabled", false);
		heartbeat_timer = setInterval( function(){keepalive(ws)}, 30000 );
	}
	ws.onerror=function(){
		$("#statustxt").html("error.");
		$("#send_btn").attr("disabled", true);
		clearInterval( heartbeat_timer );
		$("#keeplive_box").html( "连接出错." ).css({"color":"red"});
	}
	ws.onclose=function(){
		$("#statustxt").html("closed.");
		$("#send_btn").attr("disabled", true);
		clearInterval( heartbeat_timer );
		$("#keeplive_box").html( "连接已关闭." ).css({"color":"red"});
	}
	
	ws.onmessage=function(msg){
		var time = new Date();
		if( msg.data == ( '~H#S~' ) ){
			last_health = time.getTime();
			return;
		}
		
		$("#chatbox").val( $("#chatbox").val() + msg.data + "\n" );
		$("#chatbox").attr("scrollTop",$("#chatbox").attr("scrollHeight"));
	}
	
	return ws;
}
