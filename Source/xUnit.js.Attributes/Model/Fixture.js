Function.RegisterNamespace("xUnit.js.Attributes.Model");

xUnit.js.Attributes.Model.Fixture=function(name,parent,method){
	this.Method;

	// ctor
	function Fixture(name,parent,method){
		if(!Object.IsType(Function,method))throw new Error("xUnit.js.Attributes.Model.Fixture.ctor: 'method' must be a valid Function pointer.");
		this.Method=method;
		this.base(name,parent);
	}
	Fixture.apply(this,arguments);
};

xUnit.js.Attributes.Model.Fixture.Inherit(xUnit.js.Model.Fixture);