#URLHandler
###对标准Url（简单）的路径及search参数的处理
### 如何使用 
```
	var url='www.test.com?a=1&b=2#333'
	var uri=new UrlHandle(url);//无参数默认为location.href
	//1.获取search参数值
	uri.getParam('a');//获取指定search参数的值，无参数默认返回包含所有值的对象;
	//2.更新search参数值
	uri.param({a:3,c:4})//显示的设置某个参数的值为空时，将删除参数;
	//3.路径处理
	uri.resolve(path,keepParam)
	//4.生成处理结果路径;
	uri.build('/aa/bb',{a:3,c:4})===uri.resolve('/aa/bb').param({a:3,b:4}).build()
	uri.build({a:3,c:4})===uri.param({a:3,b:4}).build()
	uri.build('/aa/bb')===uri.resolve('/aa/bb').build()
```