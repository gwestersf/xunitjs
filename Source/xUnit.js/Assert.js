Function.RegisterNamespace("xUnit.js");

xUnit.js.Assert=new function(){
	// Public methods
	this.AssignableFrom=function(expected,actual){
		if(!Object.IsType(Function,expected))throw new xUnit.js.Model.AssertError("Assert.AssignableFrom: 'expected' must be a valid Function pointer.");
		if(Object.Inherits(expected,actual))return;
		if(Object.Implements(expected,actual))return;
		if(Object.IsType(expected,actual))return;
		throw new xUnit.js.Model.AssertError("Assert.AssignableFrom: 'actual' is not assignable from 'expected'");
	};	

	this.Contains=function(expected,actual){
		if(Object.Contains(expected,actual))return;
		throw new xUnit.js.Model.AssertError("Assert.Contains: 'actual' did not contain the 'expected' value.");
	};
	
	this.DoesNotContain=function(expected,actual){
		if(!Object.Contains(expected,actual))return;
		throw new xUnit.js.Model.AssertError("Assert.DoesNotContain: 'actual' contained the 'expected' value.");
	};
	
	this.DoesNotThrow=function(actual){
		try{
			actual();
		}catch(e){
			throw new xUnit.js.Model.AssertError(String.Format("Assert.DoesNotThrow: 'actual' threw an Error. Error: {0}",e));
		}
	};
	
	this.Empty=function(actual){
		try{
			if(!Object.IsEmpty(actual))throw new xUnit.js.Model.AssertError(String.Format("Found value: {0}",!Object.IsType(Function,actual)?new System.Script.ObjectSerializer().Serialize(actual):actual));
		}catch(e){
			throw new xUnit.js.Model.AssertError(String.Format("Assert.Empty: 'actual' was not empty. {0}",e));
		}
	};

	this.Equal=function(expected,actual){
		var reason={};
		if(!Object.Equals(expected,actual,reason))throw new xUnit.js.Model.AssertError(String.Format("Assert.Equal: 'actual' was not equal to 'expected'. Reason: {0}",reason.Value));
	};

	this.Fail=function(reason){
		throw new xUnit.js.Model.AssertError(String.Format("Assert.Fail: {0}",reason||"[No reason given]"));
	};
	
	this.False=function(actual,message){
		if(actual!==false)throw new xUnit.js.Model.AssertError(String.Format("Assert.False: {0}",message||"'actual' was not false."));
	};
	
	this.InRange=function(actual,low,high,comparer){
		if(comparer!=undefined&&!Object.IsType(Function,comparer))throw new xUnit.js.Model.AssertError("Assert.InRange: 'comparer' must be a valid Function pointer.");
		if(comparer){
			if(comparer(low,actual)>0||comparer(actual,high)>0)throw new xUnit.js.Model.AssertError(String.Format("Assert.InRange: 'actual' was not in the range as specified by 'comparer'. Expected low '{0}', high '{1}', found '{2}'.",low,high,actual));
		}else{
			if(low>actual||actual>high)throw new xUnit.js.Model.AssertError(String.Format("Assert.InRange: 'actual' was not in the range specified. Expected low '{0}', high '{1}', found '{2}'.",low,high,actual));
		}
	};

	this.NotEmpty=function(actual){
		if(Object.IsEmpty(actual))throw new xUnit.js.Model.AssertError("Assert.NotEmpty: 'actual' was empty.");
	};

	this.NotEqual=function(expected,actual){
		var reason={};
		if(Object.Equals(expected,actual,reason))throw new xUnit.js.Model.AssertError("Assert.NotEqual: 'actual' was equal to 'expected'.");
	};

	this.NotInRange=function(actual,low,high,comparer){
		if(comparer!=undefined&&!Object.IsType(Function,comparer))throw new xUnit.js.Model.AssertError("Assert.NotInRange: 'comparer' must be a valid Function pointer.");
		if(comparer){
			if(comparer(low,actual)<=0&&comparer(actual,high)<=0)throw new xUnit.js.Model.AssertError(String.Format("Assert.NotInRange: 'actual' was in the range as specified by 'comparer'. Expected low '{0}', high '{1}', found '{2}'.",low,high,actual));
		}else{
			if(low<=actual&&actual<=high)throw new xUnit.js.Model.AssertError(String.Format("Assert.NotInRange: 'actual' was in the range specified. Expected low '{0}', high '{1}', found '{2}'.",low,high,actual));
		}
	};
	
	this.NotNull=function(actual){
		if(actual===null)throw new xUnit.js.Model.AssertError("Assert.NotNull: 'actual' was null.");	
	};

	this.NotSame=function(expected,actual){
		if(expected===actual)throw new xUnit.js.Model.AssertError("Assert.NotSame: 'actual' was the same object as 'expected'.");
	};

	this.NotType=function(expected,actual){
		if(Object.IsType(expected,actual))throw new xUnit.js.Model.AssertError("Assert.NotType: 'actual' was of the 'expected' type.");
	};
	
	this.NotUndefined=function(actual){
		if(typeof(actual)=="undefined")throw new xUnit.js.Model.AssertError("Assert.NotUndefined: 'actual' was undefined.");
	};	
	
	this.Null=function(actual){
		if(actual!==null)throw new xUnit.js.Model.AssertError(String.Format("Assert.Null: 'actual' was not null. Found '{0}'.",actual));
	};

	this.Same=function(expected,actual){
		if(expected!==actual)throw new xUnit.js.Model.AssertError("Assert.Same: 'actual' was not the same object as 'expected'.");
	};	

	this.Throws=function(expected,actual){
		try{
			actual();
		}catch(e){
			var reason={};
			if(Object.IsType(Function,expected)){
				if(!Object.IsType(expected,e))throw new xUnit.js.Model.AssertError(String.Format("Assert.Throws: 'actual' threw an exception, but it was of the wrong type. Expected: '{0}', found: '{1}'.",Function.GetName(expected),Function.GetName(e.constructor)));
			}else{
				if(!Object.IsType(expected.constructor,e))throw new xUnit.js.Model.AssertError(String.Format("Assert.Throws: 'actual' threw an exception, but it was of the wrong type. Expected: '{0}', found: '{1}'.",Function.GetName(expected.constructor),Function.GetName(e.constructor)));
				if(!Object.Equals(expected,e,reason))throw new xUnit.js.Model.AssertError(String.Format("Assert.Throws: 'actual' did not throw the 'expected' exception. Reason: '{0}'.",reason.Value));
			}
			return e;
		}
		throw new xUnit.js.Model.AssertError("Assert.Throws: 'actual' did not throw an Error.");
	};

	this.True=function(actual,message){
		if(actual!==true)throw new xUnit.js.Model.AssertError(String.Format("Assert.True: {0}",message||"'actual' was not true."));
	};

	this.Type=function(expected,actual){
		if(!Object.IsType(expected,actual))throw new xUnit.js.Model.AssertError("Assert.Type: 'actual' was not of the 'expected' type.");
	};
	
	this.Undefined=function(expected){
		if(typeof(expected)!="undefined")throw new xUnit.js.Model.AssertError("Assert.Undefined: 'actual' was not undefined.");
	};
};