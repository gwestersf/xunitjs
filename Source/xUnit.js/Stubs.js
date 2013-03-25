Function.RegisterNamespace("xUnit.js");

xUnit.js.Stubs=new function(){
	// Public Methods
	this.GetList=function(sourceList,methods,properties){
		if(!Object.IsType(Array,source))throw new Error("xUnit.js.Stubs.GetList: 'sourceList' must be a valid Array.");
		if(!properties)properties={};
		var list=[];
		for(var i=0;i<sourceList.length;i++){
			properties.SourceValue=sourceList[i];
			list.push(this.GetObject(methods,properties));
		}
		delete properties.SourceValue;
		return list;
	};
	
	this.GetMethod=function(name,arg1,arg2,argN,returnValue){
		if(!Object.IsType(String,name))throw new Error("xUnit.js.Stubs.GetMethod: 'name' must be a valid String.");
		var methodArguments=Array.prototype.slice.call(arguments,1,arguments.length-1);
		var methodReturnValue=arguments.length>1?arguments[arguments.length-1]:undefined;
		var method=function(){
			// Collect Calling Arguments
			var callingArguments={};
			for(var i=0;i<arguments.length;i++){
				callingArguments[methodArguments[i]||String.Format("Argument_{0}",i)]=arguments[i];
			}
			
			// Collect Expectation
			var expectedResult=null;
			if(Object.IsType(Function,methodReturnValue)){
				expectedResult=methodReturnValue.apply(this,arguments);
			}else{
				expectedResult=methodReturnValue;
			}

			// Store Invocation
			method.Calls.push({
				Arguments:callingArguments,
				ReturnValue:expectedResult
			});

			return expectedResult;
		};
		method.Calls=[];
		return method;
	};

	this.GetObject=function(methods,properties){
		var object={};
		if(methods){
			for(var x in methods){
				var methodArguments=[];
				var returnValue=null;
				if(Object.IsType(Function,methods[x])){
					methodArguments=Function.GetParameters(methods[x]);
					returnValue=methods[x];
				}else{
					methodArguments=methods[x].arguments||[];
					returnValue=methods[x].returnValue;
				}
				object[x]=this.GetMethod.apply([object,x].concat(methodArguments,returnValue));
			}
		}
		if(properties){
			Object.Copy(object,properties);
		}
		return object;
	};
};