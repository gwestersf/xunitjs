Function.RegisterNamespace("xUnit.js.Model");

xUnit.js.Model.Fact=function(method,name){
	// Private members
	var _events;
	var _skip;
	var _reason;


	// Public members
	this.Events;
	this.Method;
	this.Name;
	this.Parent;
	this.State;

	// ctor
	function Fact(method,name,parent){
		if(!Object.IsType(Function,method))throw new Error("xUnit.js.Model.Fact.ctor: 'method' must be a valid Function pointer.");
		this.Events=_events=new System.Event.EventManager("BeforeRun","AfterRun");
		this.Method=method;
		this.Name=name||method&&Function.GetName(method)||"[Anonymous]";
		this.Parent=parent||null;
		this.State={
			Message:'',
			Result:xUnit.js.Model.Result.Unknown
		};
	}
	if(this.constructor==xUnit.js.Model.Fact)Fact.apply(this,arguments);
	
	this.GetPath=function(){
		var path=[];
		var step=this;
		while(step){
			path.unshift(step.Name);
			step=step.Parent;
		}
		return path.join('.');
	};
	
	// IRunnable members
	this.Run=function(){
		this.State.Result=xUnit.js.Model.Result.Unknown;
		var context=new xUnit.js.Model.EventContext(this,this.State.Result);
		_events.Fire("BeforeRun",context);
		try{
			if(_skip||context.Cancel){
				this.State.Message=_reason||"[No reason given]";
				this.State.Result=xUnit.js.Model.Result.Skipped;
			}else{
				if(Function.IsEmpty(this.Method)||(Object.IsType(Function,this.Method.GetDecoration)&&Function.IsEmpty(this.Method.GetDecoration().GetMethod()))){
					throw new xUnit.js.Model.AssertError("No method body found. Assuming intentional failure (TDD).");
				}
				this.Method.apply(Object.Global(),[]);
				this.State.Result=xUnit.js.Model.Result.Success;
			}
		}catch(e){
			this.State.Message=e;
			this.State.Result=Object.IsType(xUnit.js.Model.AssertError,e)?xUnit.js.Model.Result.Failure:xUnit.js.Model.Result.Error;
		}
		context.Result=this.State.Result;
		_events.Fire("AfterRun",context);
		return this.State;
	};
	
	// ISkippable members
	this.Skip=function(reason){
		_skip=true;
		_reason=reason;
	};
		
};

xUnit.js.Model.Fact.Implement(xUnit.js.Model.IRunnable,"xUnit.js.Model.Fact");
xUnit.js.Model.Fact.Implement(xUnit.js.Model.ISkippable,"xUnit.js.Model.Fact");