;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		window.UrlHandle = factory();
	}
}(function () {
 
	function UrlHandle(url){
		if(!url && !location){
			throw new Error("UrlHandle param 'url' is required");
		}
		this._url=url||location.href;
		this._protocol=this.getProtocolString();
		this._host=this.getHostString();
	
		this._path=this.getPathString();
		this._segment=this.getSegmentArr();
	
		this._hash=this.getHashString();
	
		this._search=this.getSearchString();
		this._param=this.getParamObj();
		this.origin={
			url:this._url,
			protocol:this._protocol,
			host:this._host,
			path:this._path,
			segment:this.getSegmentArr(),
			hash:this._hash,
			
			search:this._search,
			param:this.getParamObj()
		}
	}
	UrlHandle.prototype={
		build:function(t,r){
			var path,
				param;
			if(arguments.length==1){
				if(typeof t =='string'){
					path=t;
				}else{
					param=t;
				}
			}
			if(arguments.length==2){
				path=t;
				param=r;
			}
			if(path){
				this.resolve(path);
			}
			if(param){
				this.param(param);
			}
			return this._url;
		},
		getTargetUrl:function(){
			var targetPath='',
				targetSearch='';
			for(var i=0;i<this._segment.length;i++){
				targetPath+=this._segment[i]
			}
			for(var i in this._param){
				targetSearch += "&" + i + "=" + this._param[i];
			}
			targetSearch=targetSearch.replace('&','?');
			this._path = targetPath;
			this._search = targetSearch;
			this._url=this._protocol+this._host+targetPath+targetSearch+this._hash;
			return this;
		},
		getProtocolString:function(u){
			var url = u || this._url;
			if(url.match(/:[/]{2,3}/)){
				return url.match(/.+:[/]{2,3}/)[0];
			}
			return '';
		},
		getHostString:function(u){
			var url = u || this._url;
			return url.replace(this.getProtocolString(url),'').match(/[^/#?]*/)[0];
		},
		getPathString:function(u){
			var url = u || this._url;
			var p=url.replace(this.getProtocolString(url),'').replace(this.getHostString(url),'').match(/[^#?]*/)[0];
			return p?p.match(/[/].*/)[0]:'';
		},
		getStandardPathString(u){
			var url = u || this._url;
			return this.getPathString(url).replace(/\/$/gi,'');
		},
		getSegmentArr:function(u){
			var url = u || this._url;
			return this.getPathString(url).match(/[/][^/]*/g)||[];
		},
		getHashString:function(u){
			var url = u || this._url;
			return url.match("\\#")?url.match(/#.*/)[0]:'';
		},
		getSearchString:function(u){
			var url = u || this._url;
			var s=url.replace(this.getHashString(url),'').match(/[?].*/);
			return s?s[0]:'';
		},
		getParamObj:function(u){
			var url = u || this._url;
			var paramString = this.getSearchString(url).replace('?','');
			if(paramString){
				var paramObj={};
				var paramArr=paramString.split('&');
				for(var i=0;i<paramArr.length;i++){
					if(paramArr[i]){
						paramObj[paramArr[i].split('=')[0]]=paramArr[i].split('=')[1]
					}
				}
				return paramObj;
			}
			return {};
		},
		getParam:function(name){
			if(name){
				return this._param[name];
			}
			return this._param;
		},
		resolve:function(path,keepParam){
			if(!keepParam){
				this._param={};
				this._hash='';
			}
			var pathStart=path.split('/')[0];
			if(!pathStart){
				//根目录
				this._segment=[path]
			}else{
				if(!pathStart.match(/^[.]+$/)){
					//下级目录
					this._segment.push('');
				}
				while(path.match(/[.]{2}[/]/g)){
					path=path.replace(/[.]{2}[/]/,'');
					this._segment.pop();
				}
				path='/'+path.replace(/[.][/]/,'');
				this._segment[this._segment.length-1]=path;
			}
			return this.getTargetUrl();
		},
		param:function(json){
			//将json[i]置为null将删除;
			for(var i in json){
				if(json[i] !== null) {
					this._param[i]=json[i];
				}else{
					delete this._param[i];
				}
			}	
			return this.getTargetUrl();
		}
	}
	return UrlHandle;
}))