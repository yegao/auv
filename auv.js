/**
 * Created by Yegaogao on 2017/4/7.
 */
(function(window,undefined){
	//全局变量、系统变量声明
	var undefinedType = typeof undefined,
		document = window.document,
		docEle = document.documentElement;
	var auv = function(o){
		return new auv.prototype.init(o);
	}
	
	auv.prototype = {
		constructor:auv,
		init:function(o){
			if(typeof o == 'string'){
				this.context = document.querySelectorAll(o);
			}
			else if(o instanceof NodeList || o instanceof HTMLCollection || o instanceof NamedNodeMap || o instanceof HTMLElement){
				this.context = o;
			}
			else if(o instanceof Array){
				var i = 0,len = o.length;
				window.auv_temp = [];
				for(;i<len;i++){
					window.auv_temp.push(auv(o[i]).context);
				}
				this.context = window.auv_temp;
				//清除缓存区域
				(delete window.auv_temp) || (window.auv_temp = null);
			}
			if(this.context && 'length' in this.context){
				this.multiple =  true;
			}
			else{
				this.multiple =  false;
			}
			this.nature = o;
			return this;
		},
		bridge:{
			only:function(one,type,callback){
				var rankuuid = auv.uuid();
				window[rankuuid] = callback;
				if(one && one.eventList) {
					if((new RegExp("(\s|%)"+type+"(\s|:)")).test(one.eventList)) {
						var old = (one.eventList.match(new RegExp("%[\s| ]*"+type+"[\s| ]*:.{36}%"))[0]).slice(-37,-1);
						one.removeEventListener ? one.removeEventListener(type,window[old],false) : one.detachEvent("on"+type,window[old]);
						one.addEventListener ? one.addEventListener(type,callback,false) : one.attachEvent("on"+type,callback);
						one.eventList = one.eventList.replace(old,rankuuid);
						if(window[old]) {
							delete window[old];
						}
					}
					else {
						one.addEventListener ? one.addEventListener(type,callback,false) : one.attachEvent("on"+type,callback);
						one.eventList += "%"+type+":"+rankuuid+"%";
					}
				}
				else {
					one.addEventListener ? one.addEventListener(type,callback,false) : one.attachEvent("on"+type,callback);
					one.eventList = "%"+type+":"+rankuuid+"%";
				};
			}
		},
		on:function(type,callback){
			if(this.multiple){
				var i = 0,len = this.context.length;
				for(;i<len;i++){
					var one = this.context[i];
					one.addEventListener ? one.addEventListener(type,callback,false) : one.attachEvent("on"+type,callback);
				}
			}
			else{
				var one = this.context;
				one.addEventListener ? one.addEventListener(type,callback,false) : one.attachEvent("on"+type,callback);
			}
		},
		only:function(type,callback){
			if(this.multiple){
				var i = 0,len = this.context.length;
				for(;i<len;i++){
					var one = this.context[i];
					this.bridge.only(one,type,callback);
				}
			}
			else{
				var one = this.context;
				this.bridge.only(one,type,callback);
			}
		},
	}
	
	auv.prototype.init.prototype = auv.prototype;
	//extends
	auv.uuid = function (len, radix) {
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		var uuid = [], i;
		radix = radix || chars.length;
		if (len) {
			for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
		} else {
			var r;
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random()*16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}
		return uuid.join('');
	}
	window.auv = auv;
})(window);
