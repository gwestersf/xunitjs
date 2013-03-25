Function.RegisterNamespace("xUnit.js.Attributes");

xUnit.js.Attributes.TraitAttribute=function(trait,invert){
	this.Trait;

	// ctor
	function TraitAttribute(trait){
		this.base();
		if(!Object.IsType(Function,this.Target))throw new Error("xUnit.js.Attributes.TraitAttribute.ctor: unable to locate attribute target.");
		this.Trait=trait;
	}
	return System.Script.DelayedConstructor(this,xUnit.js.Attributes.TraitAttribute,TraitAttribute,arguments);
}

xUnit.js.Attributes.TraitAttribute.Inherit(System.Script.Attributes.Attribute);
