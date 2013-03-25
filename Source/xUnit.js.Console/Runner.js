Function.RegisterNamespace("xUnit.js.Console");

xUnit.js.Console.Runner=function(){	
	// Private members
	var _durations;
	var _engine;
	var _exitCode;
	var _output;
	var _scriptLoader;

	var _results={
		errors:[],
		failures:[],
		skipped:[],
		success:[]
	}
	
	// ctor
	function Runner(){
		_durations=[];
		_exitCode=0;
		_scriptLoader=new xUnit.js.Console.ScriptLoader();
		_output=xUnit.js.Console.Output.OutputFormatter;
		_engine=xUnit.js.Attributes.Engine.Instance;
		_engine.Events.Add("AfterRun",Component_AfterRun);
		_engine.Events.Add("BeforeRun",Component_BeforeRun);
		System.IO.Path.DirectorySeparator=System.Environment.GetWorkingDirectory().indexOf('\\')>-1?'\\':'/';
	}
	if(this.constructor==xUnit.js.Console.Runner)Runner.apply(this,arguments);
	
	// IRunnable Members
	this.Run=function(){
		try{
			var parameters=System.Environment.GetParameters();
			if(parameters.unnamed.length>0){
				loadDependency(parameters.named.dependency);
				_output.SetType(parameters.named.output);
				_output.Prologue();
				try{
					loadScripts(parameters.unnamed,parameters.named.extensions);
					runAction(parameters.named.action,parameters.named.target||null,parameters.named.trait||null,parameters.named["-trait"]||null);
				}catch(error){
					_exitCode=0x10AD; // LOAD: Runtime exception during script load or test run.
					_output.Error(error);
				}
				_output.Epilogue();
			}else{
				usage();
			}
		}catch(criticalError){
			_exitCode=0xDEAD; // DEAD: Game over, man.
			System.Environment.Write(criticalError);
		}
		System.Environment.Exit(_exitCode);
	};

	// Private methods
	function loadDependency(dependency){
		if(dependency==undefined||!dependency.length)return;
		System.IO.Path.SetRoot(System.Environment.GetWorkingDirectory());
		var dependencies=_scriptLoader.GetScriptList([dependency]);
		_scriptLoader.LoadScripts(dependencies);
	}

	function loadScripts(pathList,extensions){
		var timeStamp=new Date();
		_output.BeginFileLoad();
		System.IO.Path.SetRoot(System.Environment.GetWorkingDirectory());
		if(extensions)extensions=extensions.split(',');
		var scriptList=_scriptLoader.GetScriptList(pathList,extensions);
		_scriptLoader.LoadScripts(scriptList);
		_output.CompleteFileLoad(scriptList,new Date()-timeStamp);
	}
	
	function runAction(action,target,trait,negativeTrait){
		if(!Object.IsType(String,action))action='';
		switch(action.toLowerCase()){
			case 'enumerate':
				enumerateTests(target,trait,negativeTrait);
				break;
			case 'runtests':
			default:
				runTests(target,trait,negativeTrait);
				break;
		}
	}
	
	function enumerateTests(target,trait,negativeTrait){
		Array.ForEach(_engine.Enumerate(target,trait,negativeTrait),enumerate);
	}
	
	function enumerate(model){
		_output.Enumerate(model);
	}
	
	function runTests(target,trait,negativeTrait){
		var startTime=new Date();
		_durations.length=_results.success.length=_results.failures.length=_results.errors.length=_results.skipped.length=0;
		_output.BeginRun();
		_engine.Run(target,trait,negativeTrait);
		_output.CompleteRun(_results.success,_results.failures,_results.errors,_results.skipped,new Date()-startTime);
	}

	function factCompleted(fact){
		switch(fact.State.Result){
			case xUnit.js.Model.Result.Error:
				_results.errors.push(fact);
				_exitCode=0xBAD; // BAD: Your test is bad and you should feel bad.
				break;
			case xUnit.js.Model.Result.Failure:
				_results.failures.push(fact);
				_exitCode=0xFAE1; // FAIL: Your test has failed. Get well soon.
				break;
			case xUnit.js.Model.Result.Skipped:
				_results.skipped.push(fact);
				break;
			case xUnit.js.Model.Result.Success:
				_results.success.push(fact);
				break;
		}
	}	

	function usage(){
		var message=[
			"",
			"xUnit.js Console Runner v0.8.3.8",
			"",
			"Usage:",
			"<environment> xUnit.js.Console.js [/action:<action>] [/extensions:<extensions>] [/dependency:<dependency>] [/output:<output>] [/target:<name>] [/-target:<name>] [/trait:<name>] [/-trait:<name>] <path>[ <path>...] ",
			"",
			"<environment> The environment in which the tests are to be run.",
			"",
			"              Supported environments include:",
			"",
            "                - Microsoft Script Engine (cscript.exe, Windows only)",
            "                - Google's V8 developer console (D8 executable)",
            "                - Mozilla's SpiderMonkey console (js executable)",
            "                - Mozilla's Rhino console (js.jar)",
			"",
			"<action>      The action to perform. Optional. Valid actions are ",
			"              [Enumerate|RunTests]. If omitted, defaults to 'RunTests'.",
			"",
			"<target>      The name of a fact, fixture, or partial namespace to run. ",
			"              Optional. If omitted, runs all facts and fixtures found and ",
			"              registered at <path>.",
			"",
			"<trait>       The name, or comma separated list of names, of traits to run. ",
			"              Optional. If omitted, runs all facts and fixtures found and ",
			"              registered at <path>. If specified, runs only targets designated ",
			"              with the matching trait attribute, e.g. '[Trait(\"trait\")]'.",
			"",
			"<-trait>      The name, or comma separated list of names, of traits to skip. ",
			"              Optional. If omitted, runs all facts and fixtures found and ",
			"              registered at <path>. If specified, runs only targets not ",
			"              designated with a matching trait attribute.",
			"",
			"<extensions>  A comma separated list of file extensions to include while ",
			"              searching <path> for files to load. If omitted, defaults to '.js'.",
			"",
			"<output>      The desired output type. Optional. Valid outputs are ",
			"              [Text|Xml|Json]. If omitted, defaults to 'Text'.",
			"",
			"<dependency>  The path to a script file or directory containing dependencies to ",
			"              load before beginning the test run. These filse will load before ",
			"              any of the files in <path>, and before any output is written.",
			"",
			"<path>        The path to a script file or directory containing files to load",
			"              and parse for tests. Additional paths may be separated by a space.",
			"",
			"",
			"Examples:",
			"",
			"  cscript xUnit.js.Console.js /action:Enumerate xUnit.js/Tests",
			"",
			"  d8 - xUnit.js.Console.js -- /target:Test.xUnit.js.Console xUnit.js/Tests",
			"",
			"  js xUnit.js.Console.js xUnit.js/Tests/xUnit.js.Console/Runner.js",
			"",
			"  java -jar js.jar xUnit.js.Console.js /output:Xml xUnit.js/Tests",
			"",
            ""
		];
		System.Environment.Write(message.join('\n'));
	}
	
	// Events
	function Component_BeforeRun(context){
		_durations.push(new Date());
		_output.BeginComponent(context.Component);
	}

	function Component_AfterRun(context){
		if(Object.IsType(xUnit.js.Model.Fact,context.Component)){
			factCompleted(context.Component);
		}
		_output.CompleteComponent(context.Component,new Date()-_durations.pop());
	}
};

xUnit.js.Console.Runner.Implement(xUnit.js.IRunnable,'xUnit.js.Console.Runner');