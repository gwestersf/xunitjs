Function.RegisterNamespace("xUnit.js.Model");

xUnit.js.Model.AssertError=function(){
	// Public Properties
	this.name="AssertError";
	this.message="";
	this.stack="";

	// ctor
	function AssertError(message){
		if(message==null)message='';
		if(Object.IsType(Function,message.toString))message=message.toString();
		var error=new Error(message);
		error.name=this.name;
		this.message=message;
		this.stack=error.stack||getStack(this);
	}
	AssertError.apply(this,arguments);

	// Private Methods
	function getStack(error){
		var map={};
		var stack=[String.Format("{0}: {1}",error.name,error.message)];
		var caller=getStack.caller&&getStack.caller.caller;
		while(caller){
			if(map[caller]){
				stack.push(String.Format("{0} (Recursion Entry Point)",Function.GetName(caller)));
				break;
			}
			if(caller.caller==System.Script.Attributes.DecoratedFunction){
				stack.push(Function.GetName(caller.arguments[0]));
			}else stack.push(Function.GetName(caller));
			map[caller]=true;
			caller=caller.caller;
		}
		return stack.join('\n\tat ');
	}
};

xUnit.js.Model.AssertError.prototype=new Error();
