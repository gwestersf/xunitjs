Function.RegisterNamespace("xUnit.js.Attributes");

xUnit.js.Attributes.SkipAttribute=function(reason){
	this.Reason;
	
	// ctor
	function SkipAttribute(reason){
		this.base();
		if(!Object.IsType(Function,this.Target))throw new Error("xUnit.js.Attributes.SkipAttribute.ctor: unable to locate attribute target.");
		this.Reason=reason;
		xUnit.js.Attributes.Engine.Instance.Skip(this.Target,reason);
	}
	return System.Script.DelayedConstructor(this,xUnit.js.Attributes.SkipAttribute,SkipAttribute,arguments);
}

xUnit.js.Attributes.SkipAttribute.Inherit(System.Script.Attributes.Attribute);
