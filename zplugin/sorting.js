(function($) {
	
})(jQuery);
/*调用方法 
var text = "a{0}b{0}c{1}d\nqq{0}"; 
var text2 = $.format(text, 1, 2); 
alert(text2); 
*/
$.format = function (source, params) {
    if (arguments.length == 1)
        return function () {
            var args = $.makeArray(arguments);
            args.unshift(source);
            return $.format.apply(this, args);
        };
    if (arguments.length > 2 && params.constructor != Array) {
        params = $.makeArray(arguments).slice(1);
    }
    if (params.constructor != Array) {
        params = [params];
    }
    $.each(params, function (i, n) {
        source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
    });
    return source;
};
/*
// var a = "我喜欢吃{0}，也喜欢吃{1}，但是最喜欢的还是{0},偶尔再买点{2}";
// alert(String.format(a, "苹果","香蕉","香梨"));
// 结果:我喜欢吃苹果，也喜欢吃香蕉，但是最喜欢的还是苹果,偶尔再买点香梨
*/
String.format = function() {
    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    for ( var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};

function nowDate(){
	//日期时间自动补全0
	this.Full=function(a) {if (a < 10) {a = "0" + a;}return a;}
	var a = new Date(),
	Y = a.getFullYear(),
	M = a.getMonth()+1,
	D = a.getDate(),
	H = a.getHours(),
	m = a.getMinutes(),
	S = a.getSeconds();
	return Y+'-'+Full(M)+'-'+Full(D)+' '+this.Full(H)+':'+this.Full(m)+':'+this.Full(S);
}

//当前日期和参数之间相差多少分钟
function numDate(p) {
	var b = new Date(p),c = new Date();
		b = b.valueOf();
		c = c.valueOf();
		b = Math.floor((c - b)/1000/60);
	return b;	
}
//日期加天数的方法
function addDate(dd, dadd) {
	var a = new Date(dd)
	a = a.valueOf()
	a = a + dadd * 24 * 60 * 60 * 1000
	a = new Date(a)
	return a.getFullYear() + '-'
			+ Full(a.getMonth() + 1) + '-'
			+ Full(a.getDate());
}
//日期自动补全0
function Full(a) {
	if (a < 10) {
		a = "0" + a;
	}
	return a;
}
 //获取字符长度
function getByteLen(val) {
     var len = 0;
     for (var i = 0; i < val.length; i++) {
          var a = val.charAt(i);
          if (a.match(/[^\x00-\xff]/ig) != null) 
         {
             len += 2;
         }
         else
         {
             len += 1;
         }
     }
     return len;
 } 

/*
 * 添加删除数组指定内容
*/
function textarray (text,temp,type) {
	var array = temp.split(";");
	if(type){
		if(array.length==1 && array[0] == "" ){
    		array[0] = text;
    	}else{
    		array.push(text);
    	}
	}else{
		if(array.length != 1){
    		array.remove(text);
    	}else{
    		array[0] = '';
    	}
	}
	return array.join(";");
}
/*数组长度*/
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
/*删除指定值的数组*/
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
/*
 使用方法
console.log($.myTime.DateToUnix('2014-5-15 20:20:20'));
console.log($.myTime.UnixToDate(1325347200));
 */
(function($) {
    $.extend({
        myTime: {
            /**
             * 当前时间戳
             * @return <int>        unix时间戳(秒)  
             */
            CurTime: function(){
                return Date.parse(new Date())/1000;
            },
            /**              
             * 日期 转换为 Unix时间戳
             * @param <string> 2014-01-01 20:20:20  日期格式              
             * @return <int>        unix时间戳(秒)              
             */
            DateToUnix: function(string) {
                var f = string.split(' ', 2);
                var d = (f[0] ? f[0] : '').split('-', 3);
                var t = (f[1] ? f[1] : '').split(':', 3);
                return (new Date(
                        parseInt(d[0], 10) || null,
                        (parseInt(d[1], 10) || 1) - 1,
                        parseInt(d[2], 10) || null,
                        parseInt(t[0], 10) || null,
                        parseInt(t[1], 10) || null,
                        parseInt(t[2], 10) || null
                        )).getTime() / 1000;
            },
            /**              
             * 时间戳转换日期              
             * @param <int> unixTime    待时间戳(秒)              
             * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)              
             * @param <int>  timeZone   时区              
             */
            UnixToDate: function(unixTime, isFull, timeZone) {
                if (typeof (timeZone) == 'number')
                {
                    unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
                }
                var time = new Date(unixTime * 1000);
                var ymdhis = "";
                ymdhis += time.getUTCFullYear() + "-";
                ymdhis += (time.getUTCMonth()+1) + "-";
                ymdhis += time.getUTCDate();
                if (isFull === true)
                {
                    ymdhis += " " + time.getUTCHours() + ":";
                    ymdhis += time.getUTCMinutes() + ":";
                    ymdhis += time.getUTCSeconds();
                }
                return ymdhis;
            }
        }
    });
})(jQuery);


/*获取验证码,60s后重发*/	
var wait=60;
function time(o) {
    if (wait == 0) {
        o.removeAttribute("disabled");            
        o.innerHTML=" 获取验证码 ";
        wait = 60;
    } else { 
        o.setAttribute("disabled", true);
        o.innerHTML= "重新发送("+ wait + ")";
        wait--;
        setTimeout(function() {
            time(o)
        },
        1000)
    }
}
/*输入参数名称获取地址栏带的参数*/
function getUrlParam(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURI(r[2]); return null; //返回参数值
}


function modeler () {}
//比较数组是否相同
  modeler.compArray = function(array1, array2) {
  	if ((array1 && typeof array1 === "object" && array1.constructor === Array) && (array2 && typeof array2 === "object" && array2.constructor === Array)) {
  		if (array1.length == array2.length) {
  			for (var i = 0; i < array1.length; i++) {
  				var ggg = modeler.compObj(array1[i], array2[i]);
  				if (!ggg) {
  					return false;
  				}

  			}

  		} else {
  			return false;
  		}
  	} else {
  		throw new Error("argunment is  error ;");
  	}
  	return true;
  };
  modeler.compObj = function(obj1, obj2) //比较两个对象是否相等，不包含原形上的属性计较
  	{
  		if ((obj1 && typeof obj1 === "object") && ((obj2 && typeof obj2 === "object"))) {
  			var count1 = modeler.propertyLength(obj1);
  			var count2 = modeler.propertyLength(obj2);
  			if (count1 == count2) {
  				for (var ob in obj1) {
  					if (obj1.hasOwnProperty(ob) && obj2.hasOwnProperty(ob)) {

  						if (obj1[ob].constructor == Array && obj2[ob].constructor == Array) //如果属性是数组
  						{
  							if (!modeler.compArray(obj1[ob], obj2[ob])) {
  								return false;
  							};
  						} else if (typeof obj1[ob] === "string" && typeof obj2[ob] === "string") //纯属性
  						{
  							if (obj1[ob] !== obj2[ob]) {
  								return false;
  							}
  						} else if (typeof obj1[ob] === "object" && typeof obj2[ob] === "object") //属性是对象
  						{
  							if (!modeler.compObj(obj1[ob], obj2[ob])) {
  								return false;
  							};
  						} else {
  							return false;
  						}
  					} else {
  						return false;
  					}
  				}
  			} else {
  				return false;
  			}
  		}

  		return true;
  	};
  modeler.propertyLength = function(obj) //获得对象上的属性个数，不包含对象原形上的属性
  	{
  		var count = 0;
  		if (obj && typeof obj === "object") {
  			for (var ooo in obj) {
  				if (obj.hasOwnProperty(ooo)) {
  					count++;
  				}
  			}
  			return count;
  		} else {
  			throw new Error("argunment can not be null;");
  		}

  	};
 
//如果不存在ES5的string.trim()方法的话,就定义这个方法用以去除字符串开头和结尾的空格
String.prototype.trim = String.prototype.trim || function () {
	if(!this) return this;//空字符串不做处理
	return this.replace(/^\s+|\s+$/g,'');//使用正则表达式进行空格替换
}
