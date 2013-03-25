Function.RegisterNamespace("xUnit.js");

xUnit.js.Record=new function(){
	// Public methods
	this.Exception=function(delegate){
		if(!Object.IsType(Function,delegate))throw new Error("Record.Exception: 'delegate' must be a valid Function pointer.");
		try{
			delegate();
		}catch(e){
			return e;
		}
		return null;
	};
};