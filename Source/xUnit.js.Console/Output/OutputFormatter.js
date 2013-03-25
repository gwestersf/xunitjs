Function.RegisterNamespace("xUnit.js.Console.Output");

xUnit.js.Console.Output.OutputFormatter=new function(){
	var _strategyManager;
	var _candidate;
	var _types={
		json:"json",
		text:"text",
		xml:"xml"
	};

	// Public Members
	this.Strategies;
	this.OutputTypes;

	// ctor
	function OutputFormatter(){
		_candidate=_types.text;
		this.OutputTypes=_types;
		this.Strategies=_strategyManager=new System.Script.Strategy.StrategyManager();
	}
	OutputFormatter.apply(this,arguments);

	this.SetType=function(type){
		if(Object.IsType(Function,type&&type.toString)){
			type=type.toString().toLowerCase();
			if(_types[type])_candidate=_types[type];
		}
	};
	
	// IOutputStrategy Members
	this.Prologue=function(){
		return _strategyManager.Get(_candidate).Prologue();
	};

	this.Epilogue=function(){
		return _strategyManager.Get(_candidate).Epilogue();
	};
	
	this.BeginFileLoad=function(){
		return _strategyManager.Get(_candidate).BeginFileLoad();
	};

	this.CompleteFileLoad=function(files,duration){
		return _strategyManager.Get(_candidate).CompleteFileLoad(files,duration);
	};
	
	this.BeginRun=function(){
		return _strategyManager.Get(_candidate).BeginRun();
	};

	this.CompleteRun=function(successes,failures,errors,skipped,duration){
		return _strategyManager.Get(_candidate).CompleteRun(successes,failures,errors,skipped,duration);
	};

	this.BeginComponent=function(component){
		return _strategyManager.Get(_candidate).BeginComponent(component);
	};

	this.CompleteComponent=function(component,duration){
		return _strategyManager.Get(_candidate).CompleteComponent(component,duration);
	};

	this.Enumerate=function(component){
		return _strategyManager.Get(_candidate).Enumerate(component);
	};

	this.Error=function(error){
		return _strategyManager.Get(_candidate).Error(error);
	};

};

xUnit.js.Console.Output.OutputFormatter.constructor.Implement(xUnit.js.Console.Output.IOutputStrategy,'xUnit.js.Console.Output.OutputFormatter');