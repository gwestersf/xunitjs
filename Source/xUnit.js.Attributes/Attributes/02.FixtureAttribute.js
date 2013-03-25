Function.RegisterNamespace("xUnit.js.Attributes");

xUnit.js.Attributes.FixtureAttribute=function(){
	// Public Members
	this.Fixture=null;

	// ctor
	function FixtureAttribute(){
		this.base();
		if(!Object.IsType(Function,this.Target))throw new Error("xUnit.js.Attributes.FixtureAttribute.ctor: unable to locate attribute target.");
		this.Fixture=xUnit.js.Attributes.Engine.Instance.RegisterFixture(this.Target);
		addModelDecoration(this);
		xUnit.js.Attributes.Engine.Instance.InstantiateFixture(this.Fixture);
	}
	FixtureAttribute.apply(this,arguments);

	// Private Methods
	function addModelDecoration(attribute){
		var target=attribute.Target;
		if(Object.IsType(Function,target.GetDecoration))target=target.GetDecoration().GetMethod();
		target.GetModel=Function.GetDelegate(getModel,attribute);
	}

	function getModel(){
		return this.Fixture;
	}
};

xUnit.js.Attributes.FixtureAttribute.Inherit(System.Script.Attributes.Attribute);
