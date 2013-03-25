Function.RegisterNamespace("xUnit.js.Attributes");

xUnit.js.Attributes.FactAttribute=function(){
	// Public Members
	this.Fact=null;

	// ctor
	function FactAttribute(){
		this.base();
		if(!Object.IsType(Function,this.Target))throw new Error("xUnit.js.Attributes.FactAttribute.ctor: unable to locate attribute target.");
		this.Fact=xUnit.js.Attributes.Engine.Instance.RegisterFact(this.Target);
		addModelDecoration(this);
	}
	FactAttribute.apply(this,arguments);

	// Private Methods
	function addModelDecoration(attribute){
		var target=attribute.Target;
		if(Object.IsType(Function,target.GetDecoration))target=target.GetDecoration().GetMethod();
		target.GetModel=Function.GetDelegate(getModel,attribute);
	}

	function getModel(){
		return this.Fact;
	}
};

xUnit.js.Attributes.FactAttribute.Inherit(System.Script.Attributes.Attribute);