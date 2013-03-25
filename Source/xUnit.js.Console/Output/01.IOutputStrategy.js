Function.RegisterNamespace("xUnit.js.Console.Output");

xUnit.js.Console.Output.IOutputStrategy=new function(){
	this.Prologue=function(){};
	this.Epilogue=function(){};
	
	this.BeginFileLoad=function(){};
	this.CompleteFileLoad=function(files,duration){};

	this.BeginRun=function(){};
	this.CompleteRun=function(successes,failures,errors,skipped,duration){};

	this.BeginComponent=function(component){};
	this.CompleteComponent=function(component,duration){};
	
	this.Enumerate=function(component){};
	this.Error=function(error){};
};