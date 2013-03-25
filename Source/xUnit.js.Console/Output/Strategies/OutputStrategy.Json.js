Function.RegisterNamespace("xUnit.js.Console.Output.OutputStrategy");

xUnit.js.Console.Output.OutputStrategy.Json=function(){
	var _output;

	// IOutputStrategy Members
	this.Prologue=function(){
		_output={
			files:{
				list:[]
			},
			facts:{
				list:[]
			}
		};
	};

	this.Epilogue=function(){
		System.Environment.Write(new System.Script.ObjectSerializer().Serialize(_output));
	};

	this.BeginFileLoad=function(){};

	this.CompleteFileLoad=function(files,duration){
		Array.ForEach(files,listFile);
		_output.files.duration=duration/1000;
	};

	this.BeginRun=function(){
		_output.facts.list.length=0;
		_output.run={
			count:0,
			errors:0,
			failures:0,
			skipped:0,
			duration:0,
			timestamp:new Date()
		};
	};

	this.CompleteRun=function(successes,failures,errors,skipped,duration){
		var count=successes.length+failures.length+errors.length+skipped.length;
		_output.run.count=count;
		_output.run.failures=failures.length;
		_output.run.errors=errors.length;
		_output.run.skipped=skipped.length;
		_output.run.duration=duration/1000;
		if(errors.length){
			_output.run.errors=[];
			Array.ForEach(errors,listError);
		}
		if(failures.length){
			_output.run.failures=[];
			Array.ForEach(failures,listFailure);
		}
		if(skipped.length){
			_output.run.skipped=[];
			Array.ForEach(skipped,listSkipped);
		}
	};
	
	this.BeginComponent=function(component){
		// no-op
	};

	this.CompleteComponent=function(component,duration){
		if(!Object.IsType(xUnit.js.Model.Fact,component))return;
		_output.facts.list.push({
			path:getPath(component),
			result:getResult(component.State.Result),
			message:component.State.Message||'',
			duration:duration/1000
		});
	};

	this.Enumerate=function(component){
		_output.facts.list.push({
			path:getPath(component)
		});
	};

	this.Error=function(error){
		var output={message:error.toString()};
		if(error.lineNumber)output.lineNumber=error.lineNumber;
		if(error.number)output.number=error.number;
		if(error.toSource)output.source=error.toSource();
		if(error.stack)output.stack=error.stack;
		_output.error=output;
	}
	
	// IStrategySpecification Members
	this.IsSatisfiedBy=function(candidate){
		return String.Equals(xUnit.js.Console.Output.OutputFormatter.OutputTypes.json,candidate);
	};
	
	// Private Methods
	function getPath(fact){
		return fact.GetPath().split('.').slice(1).join('.');
	}
	
	function getResult(result){
		switch(result){
			case xUnit.js.Model.Result.Error:
				return "Error";
			case xUnit.js.Model.Result.Failure:
				return "Failure";
			case xUnit.js.Model.Result.Skipped:
				return "Skipped";
			case xUnit.js.Model.Result.Success:
				return "Success";
		}
		return '';
	}
	
	function listError(fact,context){
		_output.run.errors.push({
			path:getPath(fact),
			type:fact.State.Message&&fact.State.Message.name||"Exception",
			message:fact.State.Message||"[no message]"
		});
	}

	function listFile(file,context){
		_output.files.list.push({
			path:file
		});
	}

	function listFailure(fact,context){
		_output.run.failures.push({
			path:getPath(fact),
			type:fact.State.Message&&fact.State.Message.name||"Exception",
			message:fact.State.Message||"[no message]"
		});
	}

	function listSkipped(fact,context){
		_output.run.failures.push({
			path:getPath(fact),
			message:fact.State.Message||"[no message]"
		});
	}	
};

xUnit.js.Console.Output.OutputStrategy.Json.Implement(xUnit.js.Console.Output.IOutputStrategy,'xUnit.js.Console.Output.OutputStrategy.Json');
xUnit.js.Console.Output.OutputStrategy.Json.Implement(System.Script.Strategy.IStrategySpecification,'xUnit.js.Console.Output.OutputStrategy.Json');

xUnit.js.Console.Output.OutputFormatter.Strategies.Add(xUnit.js.Console.Output.OutputStrategy.Json);
