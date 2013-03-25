Function.RegisterNamespace("xUnit.js.Model");

xUnit.js.Model.EventContext=function(component,result){
	this.Cancel=false;
	this.Component=component||null;
	this.Result=result||null;
};