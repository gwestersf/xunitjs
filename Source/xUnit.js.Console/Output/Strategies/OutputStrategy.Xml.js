Function.RegisterNamespace("xUnit.js.Console.Output.OutputStrategy");

xUnit.js.Console.Output.OutputStrategy.Xml=function(){
	// IOutputStrategy Members
	this.Prologue=function(){
		System.Environment.Write("<xunit>");
	};

	this.Epilogue=function(){
		System.Environment.Write("</xunit>");
	};

	this.BeginFileLoad=function(){};

	this.CompleteFileLoad=function(files,duration){
		System.Environment.Write(String.Format("<files duration=\"{0}\">",duration/1000));
		Array.ForEach(files,listFile);
		System.Environment.Write("</files>");
	};
	
	this.BeginRun=function(){
		System.Environment.Write("<facts>");
	};

	this.CompleteRun=function(successes,failures,errors,skipped,duration){
		System.Environment.Write("</facts>");
		var count=successes.length+failures.length+errors.length+skipped.length;
		System.Environment.Write(String.Format("<run count=\"{0}\" failures=\"{1}\" errors=\"{2}\" skipped=\"{3}\" duration=\"{4}\" timestamp=\"{5}\"",count,failures.length,errors.length,skipped.length,duration/1000,new Date()));
		if(failures.length||skipped.length){
			System.Environment.Write(">");
			if(errors.length){
				System.Environment.Write("<errors>");
				Array.ForEach(failures,listFailure);
				System.Environment.Write("</errors>");
			}
			if(failures.length){
				System.Environment.Write("<failures>");
				Array.ForEach(failures,listFailure);
				System.Environment.Write("</failures>");
			}
			if(skipped.length){
				System.Environment.Write("<skipped>");
				Array.ForEach(skipped,listSkipped);
				System.Environment.Write("</skipped>");
			}
			System.Environment.Write("</run>");
		}else System.Environment.Write(" />");
	};

	this.BeginComponent=function(component){};

	this.CompleteComponent=function(component,duration){
		if(!Object.IsType(xUnit.js.Model.Fact,component))return;
		System.Environment.Write(String.Format("<fact path=\"{0}\" result=\"{1}\" message=\"{2}\" duration=\"{3}\" />",encode(getPath(component)),getResult(component.State.Result),encode(component.State.Message||''),duration/1000));
	};

	this.Enumerate=function(component){
		System.Environment.Write(String.Format("<fact path=\"{0}\" />",encode(getPath(component))));
	};

	this.Error=function(error){
		var output=String.Concat(
			"<error",
				error.lineNumber?String.Format(" lineNumber=\"{0}\"",encode(error.lineNumber)):'',
				error.number?String.Format(" number=\"{0}\"",encode(error.number)):'',
			">",
			"<message>",encode(error),"</message>",
			error.toSource?String.Format("<source>{0}</source>",encode(error.toSource())):'',
			error.stack?String.Format("<stack>{0}</stack>",encode(error.stack)):'',
			"</error>"
		);	
		System.Environment.Write(output);
	}
	
	// IStrategySpecification Members
	this.IsSatisfiedBy=function(candidate){
		return String.Equals(xUnit.js.Console.Output.OutputFormatter.OutputTypes.xml,candidate);
	};
	
	// Private Methods
	function encode(value){
		if(value==undefined||!value.toString)return '';
		value=value.toString();
		return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
	}
	
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
	
	function listFile(file,context){
		System.Environment.Write(String.Format("<file path=\"{0}\" />",encode(file)));
	}
	
	function listFailure(fact,context){
		System.Environment.Write(String.Format("<fact path=\"{0}\" type=\"{1}\" message=\"{2}\" />",encode(getPath(fact)),encode(fact.State.Message&&fact.State.Message.name||"Exception"),encode(fact.State.Message||"[no message]")));
	}

	function listSkipped(fact,context){
		System.Environment.Write(String.Format("<fact path=\"{0}\" message=\"{1}\" />",encode(getPath(fact)),encode(fact.State.Message||"[no message]")));
	}
};

xUnit.js.Console.Output.OutputStrategy.Xml.Implement(xUnit.js.Console.Output.IOutputStrategy,'xUnit.js.Console.Output.OutputStrategy.Xml');
xUnit.js.Console.Output.OutputStrategy.Xml.Implement(System.Script.Strategy.IStrategySpecification,'xUnit.js.Console.Output.OutputStrategy.Xml');

xUnit.js.Console.Output.OutputFormatter.Strategies.Add(xUnit.js.Console.Output.OutputStrategy.Xml);
