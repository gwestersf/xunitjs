Function.RegisterNamespace("xUnit.js.Attributes");

xUnit.js.Attributes.MockedImportAttribute=function(path,mock,callback){	
	// ctor
	function MockedImportAttribute(path,mock,callback){
		if(!Object.IsType(Function,mock))throw new Error("xUnit.js.Attributes.MockedImportAttribute.ctor: 'mock' must be a valid Function pointer.");
		var target=this;
		mock(function(){
			target.base(path,callback);
		});
	}
	return System.Script.DelayedConstructor(this,xUnit.js.Attributes.MockedImportAttribute,MockedImportAttribute,arguments);
}

xUnit.js.Attributes.MockedImportAttribute.Inherit(System.Script.ScriptLoader.Attributes.ImportAttribute);
