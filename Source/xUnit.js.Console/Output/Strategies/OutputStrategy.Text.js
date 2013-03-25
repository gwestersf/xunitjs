Function.RegisterNamespace("xUnit.js.Console.Output.OutputStrategy");

xUnit.js.Console.Output.OutputStrategy.Text=function(){
	// IOutputStrategy Members
	this.Prologue=function(){
		System.Environment.Write("xUnit.js Console Runner");
	};

	this.Epilogue=function(){
		System.Environment.Write('\nDone.');
	};
	
	this.BeginFileLoad=function(){
		var startTime=new Date();
		System.Environment.Write("\nLoading Scripts:\n");
	};
	
	this.CompleteFileLoad=function(files,duration){
		Array.ForEach(files,listFile,null,{WorkingDirectory:System.Environment.GetWorkingDirectory()});
		if(files.length)System.Environment.Write('\n\n');
		System.Environment.Write(String.Format("Finished Loading Scripts in {0}.\n",formatDuration(duration)));
	};

	this.BeginRun=function(){
		System.Environment.Write("\nRunning tests:\n\n");	
	};
	
	this.CompleteRun=function(successes,failures,errors,skipped,duration){
		System.Environment.Write("\n\n");
		if(failures.length){
			System.Environment.Write("Failed Tests:\n");
			Array.ForEach(failures,reportFailure);			
		}
		if(errors.length){
			System.Environment.Write("Errored Tests:\n");
			Array.ForEach(errors,reportFailure);			
		}
		if(skipped.length){
			System.Environment.Write("\nSkipped Tests:\n");
			Array.ForEach(skipped,reportSkipped);			
		}
		var count=successes.length+failures.length+errors.length+skipped.length;
		System.Environment.Write(String.Format("\n\nTotal tests: {0}, Errors: {1}, Failures: {2}, Skipped: {3}, Time: {4}\n\n",count,errors.length,failures.length,skipped.length,formatDuration(duration)));
	};
	
	this.BeginComponent=function(component){};

	this.CompleteComponent=function(component,duration){
		if(!Object.IsType(xUnit.js.Model.Fact,component))return;
		var result='';
		switch(component.State.Result){
			case xUnit.js.Model.Result.Error:
				result='E';
				break;
			case xUnit.js.Model.Result.Failure:
				result='F';
				break;
			case xUnit.js.Model.Result.Skipped:
				result='S';
				break;
			case xUnit.js.Model.Result.Success:
				result='.';
				break;
		}
		System.Environment.Write(result);
	};

	this.Enumerate=function(component){
		System.Environment.Write(getPath(component));
		System.Environment.Write('\r\n');
	};

	this.Error=function(error){
		System.Environment.Write(formatError(error));
	}
	
	// IStrategySpecification Members
	this.IsSatisfiedBy=function(candidate){
		return String.Equals(xUnit.js.Console.Output.OutputFormatter.OutputTypes.text,candidate);
	};
	
	// Private Methods	
	function formatDuration(duration){
		if(!Object.IsType(Number,duration))return "an unknown amount of time";
		duration=duration/1000;
		var components={
			hours:{
				format:"{0} hour{1}",
				value:Math.floor(duration/60/60)
			},
			minutes:{
				format:"{0} minute{1}",
				value:Math.floor(duration/60)%60
			},
			seconds:{
				format:"{0} second{1}",
				value:duration%60
			}
		};
		var result=[];
		for(var x in components){
			var value=components[x].value;
			if(value)result.push(String.Format(components[x].format,value,value!=1?'s':''));
		}
		return result.join(", ");
	}

	function formatError(e){
		var errorText=String.Format("\nError: \n{0}",e);
		if(e.lineNumber)errorText=String.Format("\n{0} (line: {1})",errorText,e.lineNumber);
		if(e.number)errorText=String.Format("\n{0} (number: {1})",errorText,e.number);
		if(e.toSource)errorText=String.Format("{0}\nSource: {1}",errorText,e.toSource());
		if(e.stack)errorText=String.Format("{0}\nStackTrace: {1}",errorText,e.stack);
		return errorText;
	}

	function getPath(fact){
		return fact.GetPath().split('.').slice(1).join('.');
	}
	
	function listFile(file,context){
		var fileName=file;
		if(String.StartsWith(fileName,context.WorkingDirectory)){
			fileName=fileName.substr(context.WorkingDirectory.length+1);
		}
		System.Environment.Write('\n\t',fileName);
	}

	function reportFailure(fact,context){
		var msg=String.Format("{0} -- {1}: {2}",getPath(fact),fact.State.Message&&fact.State.Message.name||"Exception",fact.State.Message||"[no message]");
		var err=String.Format("\t{0}) {1}\n\n",context.Index+1,msg);
		System.Environment.WriteError(err);
	}

	function reportSkipped(fact,context){
		var msg=String.Format("{0} -- {1}",getPath(fact),fact.State.Message||"[no message]");
		System.Environment.Write(String.Format("\t{0}) {1}\n\n",context.Index+1,msg));
	}	

};

xUnit.js.Console.Output.OutputStrategy.Text.Implement(xUnit.js.Console.Output.IOutputStrategy,'xUnit.js.Console.Output.OutputStrategy.Text');
xUnit.js.Console.Output.OutputStrategy.Text.Implement(System.Script.Strategy.IStrategySpecification,'xUnit.js.Console.Output.OutputStrategy.Text');

xUnit.js.Console.Output.OutputFormatter.Strategies.Add(xUnit.js.Console.Output.OutputStrategy.Text);