/*!
* ZgetDataView v1.0.0
* 配合ZUI解决带查询的table展示列表
* 详尽信息请看官网：
* Copyright 2016, Mat.Wu
* 请尊重原创，保留头部版权
* 在保留版权的前提下可应用于个人或商业用途
* 2016-03-23 1,修改Form提交改成按钮提交
*            2,修改在返回数据记录为0时的提示
* 2016-03-24 1,修改初始化没有提交表单参数    
* 2016-03-25 1,添加字符串替换方法 format   
* 2016-03-28 1,添加字符串替换方法format的被替换值为空的判断 行320
*            2、添加分页最后一页数量的判断 行310  
* 2016-03-29 1、添加金额判断行235-241
*            2、添加分页同步获取行 321
*            3、修改行内容自定义操作 
* 2016-03-30 1、对钱列moneyID做默认初始化
* 2016-07-26 1、开启服务器分页及测试
*            2、修改bug没有收索到数据分页的更新1801         
*/
(function($) {
	var methods = {
		init:function (options) {
			if (!methods.isValid(options)){alert("参数不合法！");return;}   //检测用户传进来的参数是否合法
            var opts =  $.extend(true,{},defaults, options);//使用jQuery.extend 覆盖插件默认参数
            return this.each(function(){
            	var $this= $(this),tabledata,Html,Ttitle,Tbody,TpageList,Tselectall,pagePosition = opts.page.pagePosition=='left'?'text-left':opts.page.pagePosition=='right'?'text-right':'text-center';//分页显示位置	            
				Ttitle = '<div class="row">'+
	            				'<div class="col-md-6"><h4>'+opts.title+'</h4></div>'+
	            				'<div class="col-md-6"><div class="col-md-9 text-right"><p style="line-height:32px;margin:0">显示条数<p></div><div class="col-md-3 text-left">'+methods.PageView(opts.page.pageList,opts.page.pageSize)+'</div></div>'+
	            			'</div>';
	            Tbody =  '<table id="dataView" class="'+opts.dcls+'"><thead></thead><tbody></tbody></table>';
	            TpageList = '<div class="hr10"></div>'+
	            		'<div class="'+pagePosition+'">'+
							'<ul class="pager" id="pageList" style="margin: 0 0 5px;">'+
	            			'</ul></div>';
	            selectall = '<div class="row" id="checkrow" style="position: fixed;bottom: 0;width: 990px;background-color: rgba(0,0,0,.6);">'+
								'<div class="col-md-1">'+
									'<div class="checkbox">'+
									  '<label style="color: #FFFFFF;"><input id="checkAll" type="checkbox"> 全选 </label>'+
									'</div>'+
								'</div>'+
								'<div class="col-md-11" style="padding-top: 4px;">'+
									'<button type="button" class="btn btn-primary" id="checkbtn" style="width: 100px">&nbsp;&nbsp;'+opts.checkbox.btnname+'&nbsp;&nbsp;</button>'+
								'</div>'+
							'</div>';
				//如果全选功能开起
				if(opts.checkbox.value){
					Html = Ttitle+Tbody+selectall+TpageList;
					$this.after(Html);
					//注册全选反选事件
					$("#checkAll").on('click',function () {
						if (this.checked) {
							$("#dataView tbody").find(':checkbox').prop("checked", true);
						} else{
							$("#dataView tbody").find(':checkbox').prop("checked", false);
						}
					});
					//注册按钮事件
					$("#checkbtn").on('click',opts.checkbox.btnF);
					//注册滚动条事件
					$(window).scroll(function() {
					  var dh = $(document).height()-$(window).height() ,
					  	  sh = $(document).scrollTop(); 
					  if((dh-sh)<103){
					  	$("#checkrow").css('bottom',103);
					  }else{
					  	$("#checkrow").css('bottom',0);
					  }
					});
				}else{
					Html = Ttitle+Tbody+TpageList;
					$this.after(Html);
				}
				//显示条数变化后的事件方法
				$("#pageView").on('change',function () {
					var viewSize = $(this).val();
					if(opts.async){
						var mydata = [],DR = tabledata.rows;
						if(viewSize>parseInt(tabledata.total)){
							viewSize = parseInt(tabledata.total);
						}
						if(viewSize>tabledata.rows.length){
							viewSize = parseInt(tabledata.rows.length);
						}
						mydata = DR.slice(0,viewSize-1);
		            	methods.DbodyCreater(mydata,opts);
		            	methods.PpageListCreater(tabledata.total,viewSize,1,opts,tabledata);
		            }else{
		            	var param =  $(opts.queryParams).serializeArray();
		            		param.push({"name":"pageSize","value":viewSize});
		            		param.push({"name":"pageIndex","value":1});
		        		$.ajax({
		            		type:"POST",
			                async:false, 
			                url:opts.dataurl,
			                data:param,
		            		dataType : "json",
							success :function (data) {
									methods.DbodyCreater(data.rows,opts);
									methods.PpageListCreater(data.total,viewSize,pageNumber,opts,data);	            	
		            		}
						});
		            }
				});
	            //初始化
	            var init = function () {
	            	var param =  $(opts.queryParams).serializeArray();
	            	$.ajax({
	            		type:"POST",
		                async:false,
		                data:param,
		                url:opts.dataurl,
	            		dataType : "json",
						success :function (data) {
			            	methods.DtheadCreater(data.thead,opts.checkbox,opts.operate);
			            	$(".nav-line li:first").find('a').text('正常('+data.normalProductCount+')');
							$(".nav-line li:first").next().find('a').text('回收站('+data.recycledProductCount+')');
			            	var lis = data.thead.length;
							if (opts.checkbox.value) {++lis;}
							if (opts.operate) {++lis;}
							var mydata = [],DR = data.rows,viewSize=$("#pageView").val();
							if(data.total>0){
								if(viewSize>parseInt(data.total)){
									viewSize = parseInt(data.total);
								}
								if(viewSize>data.rows.length){
									viewSize = parseInt(data.rows.length);
								}
								mydata = DR.slice(0,viewSize-1);
								methods.DbodyCreater(mydata,opts);
								methods.PpageListCreater(data.total,viewSize,1,opts,data);
								tabledata = data;
							}else{
								$("#dataView tbody").empty();
								$("#dataView tbody").append('<tr><td colspan="'+lis+'">还没有相关数据！</tr>');
								methods.PpageListCreater(data.total,viewSize,1,opts,data);
								tabledata = data;
							}
	            		}
					});
	            }
	            //附加表单查询方法
	            if(typeof($(opts.queryParams))!="undefined"){
	            	$(opts.queryParams+" #search").on("click",function () {
	            		var param =  $(opts.queryParams).serializeArray();
	            		$.ajax({
		            		type:"POST",
			                async:false, 
			                url:opts.dataurl,
			                data:param,
		            		dataType : "json",
							success :function (data) {
								methods.DtheadCreater(data.thead,opts.checkbox,opts.operate);
								$(".nav-line li:first").find('a').text('正常('+data.normalProductCount+')');
								$(".nav-line li:first").next().find('a').text('回收站('+data.recycledProductCount+')');
								var lis = data.thead.length;
								if (opts.checkbox.value) {++lis;}
								if (opts.operate) {++lis;}
								var mydata = [],DR = data.rows,viewSize=$("#pageView").val();
								if(data.total>0){
									if(viewSize>parseInt(data.total)){
										viewSize = parseInt(data.total);
									}
									if(viewSize>data.rows.length){
										viewSize = parseInt(data.rows.length);
									}
									mydata = DR.slice(0,viewSize-1);
									methods.DbodyCreater(mydata,opts);
									methods.PpageListCreater(data.total,viewSize,1,opts,data);
									tabledata = data;
								}else{
									$("#dataView tbody").empty();
									$("#dataView tbody").append('<tr><td colspan="'+lis+'">还没有相关数据！</tr>');
									methods.PpageListCreater(data.total,viewSize,1,opts,data);
									tabledata = data;
								}			            	
		            		}
						});
						return false;
	            	});
	            }
				//初始化调用
				init();
            });
		},
		//私有方法，检测参数是否合法
	    isValid:function(options) {
	        return !options || (options && typeof options === "object") ? true : false;
	    },
	    //PageView构造方法
	    PageView:function(pageList,pageSize) {
	    	var List=['<select id="pageView" class="form-control">','','</select>'],
	    	opl = pageList.length,
	    	temp=[];
	    	while(opl>0){
	        	--opl;
	        	if (pageSize==pageList[opl]) {
	        		temp.push('<option value="'+pageList[opl]+'" selected="selected">'+pageList[opl]+'</option>');
	        	} else{
	        		temp.push('<option value="'+pageList[opl]+'">'+pageList[opl]+'</option>');
	        	}
	        	
	        }
	    	List[1] = temp.join('');
	    	return List.join('');
	    },
	    //头部构造方法
	    DtheadCreater:function(data,Select,operate) {
	    	var $thead = ['<tr>'],temp='';
	    	if(Select.value){$thead[1] = '<th>选择</th>';}
	    	for(var i=0,dl = data.length;i<dl;i++){
	    		temp += '<th>'+data[i]+'</th>';
	    	}
	    	$thead[2] = temp;
	    	if(operate){$thead[3] = '<th>操作</th>';}
	    	$thead[4] = '</tr>';
	    	$("#dataView thead").empty();
	    	$("#dataView thead").append($thead.join(""));
	    	
	    },
	    //内容构造方法
	    DbodyCreater:function(data,opts) {
	    	var DataArr = [],checkbox = opts.checkbox, operate = opts.operate, operateTemplate = opts.operateTemplate ;
	    	var moneyID= -1;
			for(var i=0,dl = data.length;i<dl;i++){
				//var temp = ['<tr>'], tdata = data[i].data;
				var temp = ['<tr>'], tdata = data[i];
				if(checkbox.value){
					var html = '<td><div class="checkbox"><label><input type="checkbox" name="'+checkbox.name+'[]" value="'+data[i].checkbox+'" style="float: none;"></label></div></td>';
					temp.push(html);
				}
				temp.push(opts.rowsTemplate(opts,tdata,moneyID));
				if(operate){temp.push('<td>'+operateTemplate(data[i])+'</td>');}
				temp.push('</tr>');
				DataArr.push(temp.join(""));
			}
			$("#dataView tbody").empty();
			$("#dataView tbody").append(DataArr.join(""));
	    },
	    /** 
		 * 创建分页
		 * @param {String} total 后台返回的总记录数 
		 * @param {int} pageSize 每页显示的记录数，默认是10
		 * @param {int} curPage 当前显示的记录数，默认是1
		 * @param {Object} opts 配置参数
		 * @param {Object} tabledata 数据结果集
		 * @param {int} groups 连续显示分页数，默认是5
		 */ 
	    PpageListCreater:function(total, pageSize, curPage,opts,tabledata,groups) {
	    	var output='',
	    		pageSize = parseInt(pageSize)>0 ? parseInt(pageSize) : 10,
	    		totalPage = Math.ceil(total/pageSize),
	    		curPage = parseInt(curPage)>0 ? parseInt(curPage) : 1,
	    		groups = typeof(groups)=="undefined"?5:groups;
		    if(parseInt(total) == 0 || parseInt(total) == 'NaN'){
		    	$("#pageList").empty(); 
		    	return;
	    	}
		    
		    //设置起始页码  
		    if (totalPage > groups) {  
		        if ( curPage > groups && curPage <= (totalPage - groups)) {  
		            var start = curPage - 2,end = curPage + 2;  
		        } else if (curPage > (totalPage - groups)) {  
		            var start = totalPage-4,end = totalPage; 
		        } else {  
		            var start = 1,end = groups;  
		        }  
		    } else {  
		        var start = 1,end = totalPage;  
		    }
		    
		    //首页上一页菜单控制  
		    if(curPage!=1){
		    	output += '<li class="previous"><a href="javascript:void(0)" data-page="1">首页</a><a href="javascript:void(0)" data-page="'+(curPage-1)+'">上一页</a></li>';
		    }else{
		    	output += '<li class="active"><a data-page="1">首页</a></li>';
		    }
		    //页码展示  
		    for(i = start; i <= end; i++) {  
		        if (i == curPage) {
		        	output += '<li class="active"><a data-page="'+curPage+'">'+curPage+'</a></li>';
		        }else {
		        	output += '<li><a href="javascript:void(0)" data-page="'+i+'">'+i+'</a></li>';
		        }
		    }  
		    //下一页菜单控制  
		    if( curPage != totalPage){
		    	output += '<li><a href="javascript:void(0)" data-page="'+(curPage+1)+'">下一页</a><a href="javascript:void(0)" data-page="'+totalPage+'">末页</a></li><li class="previous"><a>总数：'+total+'</a></li>';
		    }else{
		    	output += '<li class="active"><a>末页</a></li><li class="previous"><a>总数：'+total+'</a></li>';
		    }
		    //渲染到dom中  
		    $("#pageList").empty();
		    $("#pageList").html(output);
		    //注册分页面点击事件
		    $("#pageList li").on("click",function(){
				var pageNumber = parseInt($(this).children('a').attr('data-page')),viewSize=$("#pageView").val();
				if(opts.async){
		    		var mydata = [],
		    		DR = tabledata.rows,
		    		i = (pageNumber-1) * viewSize,
		    		l = pageNumber * viewSize;
		    		if(DR.length-i<viewSize){l = DR.length;}
		    		mydata = DR.slice(i,l-1);
			    	methods.DbodyCreater(mydata,opts);
		            methods.PpageListCreater(tabledata.total,viewSize,pageNumber,opts,tabledata);
	            }else{
	            	var param =  $(opts.queryParams).serializeArray();
	            		param.push({"name":"pageSize","value":viewSize});
	            		param.push({"name":"pageIndex","value":pageNumber});
	        		$.ajax({
	            		type:"POST",
		                async:false, 
		                url:opts.dataurl,
		                data:param,
	            		dataType : "json",
						success :function (data) {
								methods.DbodyCreater(data.rows,opts);
								methods.PpageListCreater(data.total,viewSize,pageNumber,opts,data);	            	
	            		}
					});
	            }
		    });
	    },
	    getData:function(){
	    	return $(window).tabledata;
	    }
	};
	
	//设置默认值并用逗号隔开
    var defaults = { 
    	title:'示例列表',
        dataurl : '/data.php',//数据获取链接地址
        dcls:'table table-striped table-hover table-bordered',//表格样式
        page:{
        	IsPage:true,//是否显示分页
        	pageNumber:1,//在设置分页属性的时候初始化页码。
        	pageSize:20,//在设置分页属性的时候初始化页面大小。
        	pageList:[20,50,100,200],//在设置分页属性的时候 初始化页面大小选择列表。
        	pagePosition:'right',//定义分页工具栏的位置。可用的值有：'left','cneter','right'
        },
        operate:true,//操作栏
        operateTemplate:function(row){
        	return '<a href="#" class="btn-link">详情</a>';
        },//根据行数据定义操作
		rowsTemplate:function(opts,row){
        	return '';
        },
        queryParams: '',//附加表单id
        checkbox:{
        	name:'id',//行复选筐name
        	value:true,//是否开启行全选
        	btnname:'批量确认',//批量按钮的文字
        	btnF:function(){}//批量按钮的点击事件
        },//复选框
		async:true, //分页请求数据方式，true 本地缓存,false同步获取
		format:function() {
		    if (arguments.length == 0 || arguments[0]==null){return '——';}
		    var str = arguments[0];
		    for ( var i = 1; i < arguments.length; i++) {
		        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
		        str = str.replace(re, arguments[i]);
		    }
		    return str;
		}
    };
    
	$.fn.extend({
        ZgetDataView: function(method) {
        	if(methods[method]){
				return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
			} else if(typeof method === 'object' || !method){
				return methods.init.apply(this,arguments);
			} else {
				$.error("Method " + method + ' does not exist on jQuery.imgBox');
			}
        }
    });
})(window.jQuery);