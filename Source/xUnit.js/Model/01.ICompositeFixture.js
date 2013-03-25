Function.RegisterNamespace("xUnit.js.Model");

xUnit.js.Model.ICompositeFixture=new function(){
	this.Clear=function(){};
	this.GetFacts=function(){};
	this.GetFixtures=function(){};
	this.RegisterFact=function(fact){};
	this.RegisterFixture=function(fixture){};
};