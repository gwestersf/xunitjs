Function.RegisterNamespace("Test.xUnit.js");

[Fixture]
Test.xUnit.js.Assert=function(){
	var AssertError=xUnit.js.Model.AssertError;

	[Fixture]
	function Contains(){
		[Fact]
		function CallsObjectContains(){
			var targetContains=Object.Contains;
			Object.Contains=function(){
				actual=true;
				return true;
			}
			var actual=false;
			
			Assert.Contains();
			Object.Contains=targetContains;
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.Contains.CallsObjectContains: 'actual' was false.");
		}
		
		[Fact]
		function DoesNotThrowIfObjectContainsReturnsTrue(){
			var targetContains=Object.Contains;
			Object.Contains=function(){
				return true;
			}
			
			var actual=Record.Exception(function(){
				Assert.Contains();
			});
			Object.Contains=targetContains;
			
			if(actual!=null)throw new AssertError("Test.xUnit.js.Assert.Contains.DoesNotThrowIfObjectContainsReturnsTrue: 'actual' was not null.");
		}
		
		[Fact]
		function ThrowsIfObjectContainsReturnsFalse(){
			var targetContains=Object.Contains;
			Object.Contains=function(){
				return false;
			}
			var expected="Assert.Contains: 'actual' did not contain the 'expected' value.";
			
			var actual=Record.Exception(function(){
				Assert.Contains();
			});
			Object.Contains=targetContains;
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Contains.ThrowsIfObjectContainsReturnsFalse: expected '{0}', found '{1}'.",expected,actual));
		}
	}
	
	[Fixture]
	function DoesNotContain(){
		[Fact]
		function CallsObjectContains(){
			var targetContains=Object.Contains;
			Object.Contains=function(){
				actual=true;
				return false;
			}
			var actual=false;
			
			Assert.DoesNotContain();
			Object.Contains=targetContains;
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.DoesNotContain.CallsObjectContains: 'actual' was false.");
		}
		
		[Fact]
		function DoesNotThrowIfObjectContainsReturnsFalse(){
			var targetContains=Object.Contains;
			Object.Contains=function(){
				return false;
			}
			
			var actual=Record.Exception(function(){
				Assert.DoesNotContain();
			});
			Object.Contains=targetContains;
			
			if(actual!=null)throw new AssertError("Test.xUnit.js.Assert.DoesNotContain.DoesNotThrowIfObjectContainsReturnsTrue: 'actual' was not null.");
		}
		
		[Fact]
		function ThrowsIfObjectContainsReturnsTrue(){
			var targetContains=Object.Contains;
			Object.Contains=function(){
				return true;
			}
			var expected="Assert.DoesNotContain: 'actual' contained the 'expected' value.";
			
			var actual=Record.Exception(function(){
				Assert.DoesNotContain();
			});
			Object.Contains=targetContains;
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.DoesNotContain.ThrowsIfObjectContainsReturnsTrue: expected '{0}', found '{1}'.",expected,actual));
		}
	}
	
	[Fixture]
	function DoesNotThrow(){
		[Fact]
		function CallsDelegatePassed(){
			var target=function(){
				actual=true;
			}
			var actual=false;
			
			Assert.DoesNotThrow(target);
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.DoesNotThrow.CallsDelegatePassed: 'actual' was false.");
		}
		
		[Fact]
		function DoesNotThrowIfDelegateDoesNotThrow(){
			var target=function(){}
			
			var actual=Record.Exception(function(){
				Assert.DoesNotThrow(target);
			});

			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.DoesNotThrow.DoesNotThrowIfDelegateDoesNotThrow: 'actual' threw an error. Error: {0}",actual));
		}

		[Fact]
		function ThrowsIfDelegateThrows(){
			var target=function(){
				throw new AssertError();
			}
			
			var actual=Record.Exception(function(){
				Assert.DoesNotThrow(target);
			});

			if(actual==null)throw new AssertError("Test.xUnit.js.Assert.DoesNotThrow.ThrowsIfDelegateThrows: 'actual' did not throw an error.");
		}

		[Fact]
		function ThrowsWhatDelegateThrows(){
			var targetError=new Error("expected");
			var expected=String.Format("Assert.DoesNotThrow: 'actual' threw an Error. Error: {0}",targetError);
			var target=function(){
				throw targetError;
			}
			
			var actual=Record.Exception(function(){
				Assert.DoesNotThrow(target);
			});

			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.DoesNotThrow.ThrowsWhatDelegateThrows: expected '{0}', found '{1}'.",expected,actual));
		}
	}
	
	[Fixture]
	function Empty(){
		[Fact]
		function ThrowsIfActualIsAnArrayWithValues(){
			var actual=Record.Exception(function(){
				Assert.Empty(["expected"]);
			});
			
			if(actual==null)throw new AssertError("Test.xUnit.js.Empty.ThrowsIfActualIsAnArrayWithValues: 'actual' did not throw.");
		}

		[Fact]
		function ThrowsKnownErrorIfActualIsAnArrayWithValues(){
			var target=["target"];
			var expected=String.Format("Assert.Empty: 'actual' was not empty. Found value: [\"target\"]",target);

			var actual=Record.Exception(function(){
				Assert.Empty(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Empty.ThrowsKnownErrorIfActualIsAnArrayWithValues: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsANonEmptyString(){
			var actual=Record.Exception(function(){
				Assert.Empty("expected");
			});
			
			if(actual==null)throw new AssertError("Test.xUnit.js.Empty.ThrowsIfActualIsANonEmptyString: 'actual' did not throw.");
		}

		[Fact]
		function ThrowsKnownErrorIfActualIsANonEmptyString(){
			var target="target";
			var expected=String.Format("Assert.Empty: 'actual' was not empty. Found value: \"{0}\"",target);

			var actual=Record.Exception(function(){
				Assert.Empty(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Empty.ThrowsKnownErrorIfActualIsANonEmptyString: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsABoolean(){
			var actual=Record.Exception(function(){
				Assert.Empty(true);
			});
			
			if(actual==null)throw new AssertError("Test.xUnit.js.Empty.ThrowsIfActualIsABoolean: 'actual' did not throw.");
		}

		[Fact]
		function ThrowsKnownErrorIfActualIsABoolean(){
			var target=true;
			var expected=String.Format("Assert.Empty: 'actual' was not empty. Found value: {0}",target);

			var actual=Record.Exception(function(){
				Assert.Empty(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Empty.ThrowsKnownErrorIfActualIsABoolean: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsNotAnEmptyError(){
			var actual=Record.Exception(function(){
				Assert.Empty(new Error("error"));
			});
			
			if(actual==null)throw new AssertError("Test.xUnit.js.Empty.ThrowsIfActualIsAnError: 'actual' did not throw.");
		}

		[Fact]
		function ThrowsKnownErrorIfActualIsAnError(){
			var target=new Error("target");
			var expected=String.Format("Assert.Empty: 'actual' was not empty. Found value: {0}",new System.Script.ObjectSerializer().Serialize(target));

			var actual=Record.Exception(function(){
				Assert.Empty(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Empty.ThrowsKnownErrorIfActualIsAnError: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsANotEmptyFunction(){
			var actual=Record.Exception(function(){
				Assert.Empty(function(){return;});
			});
			
			if(actual==null)throw new AssertError("Test.xUnit.js.Empty.ThrowsIfActualIsAFunction: 'actual' did not throw.");
		}

		[Fact]
		function ThrowsKnownErrorIfActualIsANotEmptyFunction(){
			var target=function target(){return};
			var expected=String.Format("Assert.Empty: 'actual' was not empty. Found value: {0}",target);

			var actual=Record.Exception(function(){
				Assert.Empty(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Empty.ThrowsKnownErrorIfActualIsAFunction: expected '{0}', found '{1}'.",expected,actual));
		}
							
		[Fact]
		function ThrowsIfActualIsANumber(){
			var actual=Record.Exception(function(){
				Assert.Empty(1);
			});
			
			if(actual==null)throw new AssertError("Test.xUnit.js.Empty.ThrowsIfActualIsANumber: 'actual' did not throw.");
		}

		[Fact]
		function ThrowsKnownErrorIfActualIsANumber(){
			var target=1;
			var expected=String.Format("Assert.Empty: 'actual' was not empty. Found value: {0}",target);

			var actual=Record.Exception(function(){
				Assert.Empty(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Empty.ThrowsKnownErrorIfActualIsANumber: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAnObjectWithProperties(){
			var actual=Record.Exception(function(){
				Assert.Empty({expected:"expected"});
			});
			
			if(actual==null)throw new AssertError("Test.xUnit.js.Empty.ThrowsIfActualIsAnObjectWithProperties: 'actual' did not throw.");
		}

		[Fact]
		function ThrowsKnownErrorIfActualIsAnObjectWithProperties(){
			var target={target:"target"};
			var expected=String.Format("Assert.Empty: 'actual' was not empty. Found value: {0}",new System.Script.ObjectSerializer().Serialize(target));

			var actual=Record.Exception(function(){
				Assert.Empty(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Empty.ThrowsKnownErrorIfActualIsAnObjectWithProperties: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsOmitted(){
			var actual=Record.Exception(function(){
				Assert.Empty();
			});
			
			if(actual==null)throw new AssertError(String.Format("Test.xUnit.js.Empty.ThrowsIfActualIsOmitted: 'actual' did not throw an error."));
		}

		[Fact]
		function DoesNotThrowIfActualIsUndefined(){
			var actual=Record.Exception(function(){
				Assert.Empty(undefined);
			});
			
			if(actual==null)throw new AssertError(String.Format("Test.xUnit.js.Empty.ThrowsIfActualIsOmitted: 'actual' did not throw an error."));
		}

		[Fact]
		function DoesNotThrowIfActualIsNull(){
			var actual=Record.Exception(function(){
				Assert.Empty(null);
			});
			
			if(actual==null)throw new AssertError(String.Format("Test.xUnit.js.Empty.ThrowsIfActualIsOmitted: 'actual' did not throw an error."));
		}

		[Fact]
		function DoesNotThrowIfActualIsAnEmptyArray(){
			var actual=Record.Exception(function(){
				Assert.Empty([]);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Empty.DoesNotThrowIfActualIsAnEmptyArray: 'actual' threw an error. Error: {0}",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsAnEmptyString(){
			var actual=Record.Exception(function(){
				Assert.Empty('');
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Empty.DoesNotThrowIfActualIsAnEmptyString: 'actual' threw an error. Error: {0}",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsAnEmptyObject(){
			var actual=Record.Exception(function(){
				Assert.Empty({});
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Empty.DoesNotThrowIfActualIsAnEmptyObject: 'actual' threw an error. Error: {0}",actual));
		}
	}

	[Fixture]
	function Equal(){
		[Fact]
		function CallsObjectEquals(){
			var targetEquals=Object.Equals;
			Object.Equals=function(){
				actual=true;
				return true;
			}
			var actual=false;

			Assert.Equal(1,1);
			Object.Equals=targetEquals;
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.Equal.CallsObjectEquals: 'actual' was false.");
		}

		[Fact]
		function PassesExpectedToObjectEquals(){
			var targetEquals=Object.Equals;
			Object.Equals=function(targetExpected){
				actual=targetExpected;
				return true;
			}
			var actual=null;
			var expected="expected";

			Assert.Equal(expected,1);
			Object.Equals=targetEquals;
			
			if(expected!=actual)throw new AssertError("Test.xUnit.js.Assert.Equal.PassesExpectedToObjectEquals: 'expected' was not equal to 'actual'.");
		}

		[Fact]
		function PassesActualToObjectEquals(){
			var targetEquals=Object.Equals;
			Object.Equals=function(targetExpected,targetActual){
				actual=targetActual;
				return true;
			}
			var actual=null;
			var expected="expected";

			Assert.Equal(1,expected);
			Object.Equals=targetEquals;
			
			if(expected!=actual)throw new AssertError("Test.xUnit.js.Assert.Equal.PassesExpectedToObjectEquals: 'expected' was not equal to 'actual'.");
		}
		
		[Fact]
		function PassesReasonToObjectEquals(){
			var targetEquals=Object.Equals;
			Object.Equals=function(targetExpected,targetMatch,targetReason){
				actual=targetReason;
				return true;
			}
			var actual=null;

			Assert.Equal(1,1);
			Object.Equals=targetEquals;
			
			if(actual==null)throw new AssertError("Test.xUnit.js.Assert.Equal.PassesReasonToObjectEquals: 'actual' was null.");
		}
		
		[Fact]
		function ThrowsIfObjectEqualsReturnsFalse(){
			var targetEquals=Object.Equals;
			Object.Equals=function(){
				return false;
			}
			
			var actual=Record.Exception(function(){
				Assert.Equal(1,1);
			});
			Object.Equals=targetEquals;
			
			if(actual==null)throw new AssertError("Test.xUnit.js.Assert.Equal.ThrowsIfObjectEqualsReturnsFalse: 'actual' was null.");
		}
		
		[Fact]
		function ThrowsKnownErrorIfObjectEqualsReturnsFalse(){
			var targetReason="targetReason";
			var targetEquals=Object.Equals;
			Object.Equals=function(targetExpected,targetActual,reason){
				reason.Value=targetReason;
				return false;
			}
			var expected=String.Format("Assert.Equal: 'actual' was not equal to 'expected'. Reason: {0}",targetReason);
			
			var actual=Record.Exception(function(){
				Assert.Equal(1,1);
			});
			Object.Equals=targetEquals;
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Equal.ThrowsKnownErrorIfObjectEqualsReturnsFalse: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function DoesNotThrowIfObjectEqualsReturnsTrue(){
			var targetEquals=Object.Equals;
			Object.Equals=function(){
				return true;
			}

			var actual=Record.Exception(function(){
				Assert.Equal(1,1);
			});
			Object.Equals=targetEquals;

			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.Equal.DoesNotThrowIfObjectEqualsReturnsTrue: 'actual' was not null. Error: '{0}'",actual));
		}
	}

	[Fixture]
	function Fail(){
		[Fact]
		function ThrowsIfReasonIsOmitted(){
			var actual=Record.Exception(function(){
				Assert.Fail();
			});

			if(actual==null)throw new AssertError("Test.xUnit.js.Assert.Fail.ThrowsIfReasonIsOmitted: 'actual' was null.");
		}

		[Fact]
		function ThrowsUnknownReasonIfReasonIsOmitted(){
			var expected=String.Format("Assert.Fail: {0}","[No reason given]");

			var actual=Record.Exception(function(){
				Assert.Fail();
			});

			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Fail.ThrowsUnknownReasonIfReasonIsOmitted: expected '{0}', found '{1}'.",expected,actual));		
		}

		[Fact]
		function ThrowsIfReasonIsUndefined(){
			var actual=Record.Exception(function(){
				Assert.Fail(undefined);
			});

			if(actual==null)throw new AssertError("Test.xUnit.js.Assert.Fail.ThrowsIfReasonIsUndefined: 'actual' was null.");
		}

		[Fact]
		function ThrowsUnknownReasonIfReasonIsUndefined(){
			var expected=String.Format("Assert.Fail: {0}","[No reason given]");

			var actual=Record.Exception(function(){
				Assert.Fail(undefined);
			});

			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Fail.ThrowsUnknownReasonIfReasonIsUndefined: expected '{0}', found '{1}'.",expected,actual));		
		}
		
		[Fact]
		function ThrowsIfReasonIsNull(){
			var actual=Record.Exception(function(){
				Assert.Fail(null);
			});

			if(actual==null)throw new AssertError("Test.xUnit.js.Assert.Fail.ThrowsIfReasonIsNull: 'actual' was null.");
		}

		[Fact]
		function ThrowsUnknownReasonIfReasonIsNull(){
			var expected=String.Format("Assert.Fail: {0}","[No reason given]");

			var actual=Record.Exception(function(){
				Assert.Fail(null);
			});

			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Fail.ThrowsUnknownReasonIfReasonIsNull: expected '{0}', found '{1}'.",expected,actual));		
		}
		
		[Fact]
		function ThrowsIfReasonIsPassed(){
			var actual=Record.Exception(function(){
				Assert.Fail("reason");
			});

			if(actual==null)throw new AssertError("Test.xUnit.js.Assert.Fail.ThrowsIfReasonIsOmitted: 'actual' was null.");
		}

		[Fact]
		function ThrowsReasonIfReasonIsPassed(){
			var targetReason="targetReason";
			var expected=String.Format("Assert.Fail: {0}",targetReason);

			var actual=Record.Exception(function(){
				Assert.Fail(targetReason);
			});

			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Fail.ThrowsReasonIfReasonIsPassed: expected '{0}', found '{1}'.",expected,actual));		
		}
	}
	
	[Fixture]
	function False(){
		[Fact]
		function ThrowsIfActualIsOmitted(){
			var expected=String.Format("Assert.False: {0}","'actual' was not false.");

			var actual=Record.Exception(function(){
				Assert.False();
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.False.ThrowsIfActualIsOmitted: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsUndefined(){
			var expected=String.Format("Assert.False: {0}","'actual' was not false.");

			var actual=Record.Exception(function(){
				Assert.False(undefined);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.False.ThrowsIfActualIsUndefined: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsNull(){
			var expected=String.Format("Assert.False: {0}","'actual' was not false.");

			var actual=Record.Exception(function(){
				Assert.False(null);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.False.ThrowsIfActualIsNull: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsZero(){
			var expected=String.Format("Assert.False: {0}","'actual' was not false.");

			var actual=Record.Exception(function(){
				Assert.False(0);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.False.ThrowsIfActualIsZero: expected '{0}', found '{1}'.",expected,actual));
		}
		

		[Fact]
		function ThrowsIfActualIsANumber(){
			var expected=String.Format("Assert.False: {0}","'actual' was not false.");

			var actual=Record.Exception(function(){
				Assert.False(1);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.False.ThrowsIfActualIsANumber: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsAnArray(){
			var expected=String.Format("Assert.False: {0}","'actual' was not false.");

			var actual=Record.Exception(function(){
				Assert.False(new Array());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.False.ThrowsIfActualIsAnArray: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAnError(){
			var expected=String.Format("Assert.False: {0}","'actual' was not false.");

			var actual=Record.Exception(function(){
				Assert.False(new Error());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.False.ThrowsIfActualIsAnError: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsAFunction(){
			var expected=String.Format("Assert.False: {0}","'actual' was not false.");

			var actual=Record.Exception(function(){
				Assert.False(new Function());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.False.ThrowsIfActualIsAFunction: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAnObject(){
			var expected=String.Format("Assert.False: {0}","'actual' was not false.");

			var actual=Record.Exception(function(){
				Assert.False(new Object());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.False.ThrowsIfActualIsAnError: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAnEmptyString(){
			var expected=String.Format("Assert.False: {0}","'actual' was not false.");

			var actual=Record.Exception(function(){
				Assert.False('');
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.False.ThrowsIfActualIsAnEmptyString: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsAString(){
			var expected=String.Format("Assert.False: {0}","'actual' was not false.");

			var actual=Record.Exception(function(){
				Assert.False("target");
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.False.ThrowsIfActualIsAString: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsTrue(){
			var expected=String.Format("Assert.False: {0}","'actual' was not false.");

			var actual=Record.Exception(function(){
				Assert.False(true);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.False.ThrowsIfActualIsTrue: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function DoesNotThrowIfActualIsFalse(){
			var actual=Record.Exception(function(){
				Assert.False(false);
			});
			
			if(actual!=null)throw new AssertError("Test.xUnit.js.Assert.False.DoesNotThrowIfActualIsFalse: 'actual' threw an error.");
		}
	}
	
	[Fixture]
	function InRange(){
		[Fact]
		function ThrowsIfComparerIsNotAValidFunction(){
			var expected="Assert.InRange: 'comparer' must be a valid Function pointer.";
			
			var actual=Record.Exception(function(){
				Assert.InRange(1,1,1,new Object());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.InRange.ThrowsIfComparerIsNotAValidFunction: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function CallsComparer(){
			var target=function(){
				actual=true;
			}
			var actual=false;

			Assert.InRange(1,1,1,target);
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.InRange.CallsComparer: did not call comparer.");
		}

		[Fact]
		function PassesActualToComparerWithLow(){
			var targetCalls=0;
			var target=function(low,targetActual){
				if(++targetCalls<2)actual=targetActual;
			}
			var actual=null;
			var expected=5;

			Assert.InRange(expected,1,10,target);
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.InRange.PassesActualToComparerWithLow: did not pass actual to comparer with low.");
		}

		[Fact]
		function PassesLowToComparerWithActual(){
			var targetCalls=0;
			var target=function(low){
				if(++targetCalls<2)actual=low;
			}
			var actual=null;
			var expected=1;

			Assert.InRange(5,expected,10,target);
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.InRange.PassesLowToComparerWithActual: did not pass low to comparer with actual.");
		}

		[Fact]
		function PassesHighToComparerWithActual(){
			var targetCalls=0;
			var target=function(targetActual,high){
				if(++targetCalls>1)actual=high;
			}
			var actual=null;
			var expected=10;

			Assert.InRange(5,1,expected,target);
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.InRange.PassesHighToComparerWithActual: did not pass high to comparer with actual.");
		}

		[Fact]
		function PassesActualToComparerWithHigh(){
			var targetCalls=0;
			var target=function(targetActual,high){
				if(++targetCalls>1)actual=targetActual;
			}
			var actual=null;
			var expected=5;

			Assert.InRange(expected,1,10,target);
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.InRange.PassesHighToComparerWithActual: did not pass actual to comparer with high.");
		}
		
		[Fact]
		function ThrowsIfComparerReturnsGreaterThanZeroForLow(){
			var targetActual=5;
			var targetLow=1;
			var targetHigh=10;
			var targetCalls=0;
			var targetComparer=function(targetLow,targetActual){
				if(++targetCalls==1)return 1;
			};
			var expected=String.Format("Assert.InRange: 'actual' was not in the range as specified by 'comparer'. Expected low '{0}', high '{1}', found '{2}'.",targetLow,targetHigh,targetActual);
			
			var actual=Record.Exception(function(){
				Assert.InRange(targetActual,targetLow,targetHigh,targetComparer);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.InRange.ThrowsIfComparerReturnsGreaterThanZeroForLow: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfComparerReturnsGreaterThanZeroForHigh(){
			var targetActual=5;
			var targetLow=1;
			var targetHigh=10;
			var targetCalls=0;
			var targetComparer=function(targetActual,targetHigh){
				if(++targetCalls==2)return 1;
			};
			var expected=String.Format("Assert.InRange: 'actual' was not in the range as specified by 'comparer'. Expected low '{0}', high '{1}', found '{2}'.",targetLow,targetHigh,targetActual);
			
			var actual=Record.Exception(function(){
				Assert.InRange(targetActual,targetLow,targetHigh,targetComparer);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.InRange.ThrowsIfComparerReturnsGreaterThanZeroForHigh: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfLowIsGreaterThanActual(){
			var targetActual=5;
			var targetLow=10;
			var targetHigh=10;
			var expected=String.Format("Assert.InRange: 'actual' was not in the range specified. Expected low '{0}', high '{1}', found '{2}'.",targetLow,targetHigh,targetActual);
			
			var actual=Record.Exception(function(){
				Assert.InRange(targetActual,targetLow,targetHigh);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.InRange.ThrowsIfLowIsGreaterThanActual: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsGreaterThanHigh(){
			var targetActual=15;
			var targetLow=1;
			var targetHigh=10;
			var expected=String.Format("Assert.InRange: 'actual' was not in the range specified. Expected low '{0}', high '{1}', found '{2}'.",targetLow,targetHigh,targetActual);
			
			var actual=Record.Exception(function(){
				Assert.InRange(targetActual,targetLow,targetHigh);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.InRange.ThrowsIfActualIsGreaterThanHigh: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function DoesNotThrowIfActualIsInRangeForComparer(){
			var targetActual=5;
			var targetLow=1;
			var targetHigh=10;
			var targetComparer=function(){
				return -1;
			}
			
			var actual=Record.Exception(function(){
				Assert.InRange(targetActual,targetLow,targetHigh);
			});
			
			if(actual!=null)throw new AssertError("Test.xUnit.js.Assert.InRange.DoesNotThrowIfActualIsInRange: 'actual' threw an error.");
		}

		[Fact]
		function DoesNotThrowIfActualIsInRangeInclusiveForComparer(){
			var targetActual=5;
			var targetLow=1;
			var targetHigh=10;
			var targetComparer=function(){
				return 0;
			}
			
			var actual=Record.Exception(function(){
				Assert.InRange(targetActual,targetLow,targetHigh);
			});
			
			if(actual!=null)throw new AssertError("Test.xUnit.js.Assert.InRange.DoesNotThrowIfActualIsInRange: 'actual' threw an error.");
		}
		
		[Fact]
		function DoesNotThrowIfActualIsInRange(){
			var targetActual=5;
			var targetLow=1;
			var targetHigh=10;
			
			var actual=Record.Exception(function(){
				Assert.InRange(targetActual,targetLow,targetHigh);
			});
			
			if(actual!=null)throw new AssertError("Test.xUnit.js.Assert.InRange.DoesNotThrowIfActualIsInRange: 'actual' threw an error.");
		}	
	}
	
	[Fixture]
	function AssignableFrom(){
		[Fact]
		function ThrowsIfExpectedIsOmitted(){
			var expected="Assert.AssignableFrom: 'expected' must be a valid Function pointer.";
			
			var actual=Record.Exception(function(){
				Assert.AssignableFrom();
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.AssignableFrom.ThrowsIfExpectedIsOmitted: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfExpectedIsUndefined(){
			var expected="Assert.AssignableFrom: 'expected' must be a valid Function pointer.";
			
			var actual=Record.Exception(function(){
				Assert.AssignableFrom(undefined);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.AssignableFrom.ThrowsIfExpectedIsUndefined: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfExpectedIsNull(){
			var expected="Assert.AssignableFrom: 'expected' must be a valid Function pointer.";
			
			var actual=Record.Exception(function(){
				Assert.AssignableFrom(null);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.AssignableFrom.ThrowsIfExpectedIsNull: expected '{0}', found '{1}'.",expected,actual));
		}		

		[Fact]
		function ThrowsIfExpectedIsNotAValidFunction(){
			var expected="Assert.AssignableFrom: 'expected' must be a valid Function pointer.";
			
			var actual=Record.Exception(function(){
				Assert.AssignableFrom(new Object());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.AssignableFrom.ThrowsIfExpectedIsNotAValidFunction: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function CallsObjectInherits(){
			var targetInherits=Object.Inherits;
			Object.Inherits=function(){
				actual=true;
				return true;
			}
			var actual=false;
			
			Assert.AssignableFrom(function(){});
			Object.Inherits=targetInherits;
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.AssignableFrom.CallsObjectInherits: 'actual' was false.");			
		}

		[Fact]
		function PassesExpectedToObjectInherits(){
			var targetInherits=Object.Inherits;
			Object.Inherits=function(targetExpected){
				actual=targetExpected;
				return true;
			}
			var actual=null;
			var expected=function(){};
			
			Assert.AssignableFrom(expected);
			Object.Inherits=targetInherits;
			
			if(expected!=actual)throw new AssertError(String.Format("Test.xUnit.js.Assert.AssignableFrom.PassesExpectedToObjectInherits: expected '{0}', found '{1}'.",expected,actual));			
		}

		[Fact]
		function PassesActualToObjectInherits(){
			var targetInherits=Object.Inherits;
			Object.Inherits=function(targetExpected,targetActual){
				actual=targetActual;
				return true;
			}
			var actual=null;
			var expected="expected";
			
			Assert.AssignableFrom(function(){},expected);
			Object.Inherits=targetInherits;
			
			if(expected!=actual)throw new AssertError(String.Format("Test.xUnit.js.Assert.AssignableFrom.PassesActualToObjectInherits: expected '{0}', found '{1}'.",expected,actual));			
		}

		[Fact]
		function CallsObjectImplements(){
			var targetImplements=Object.Implements;
			Object.Implements=function(){
				actual=true;
				return true;
			}
			var actual=false;
			
			Assert.AssignableFrom(function(){},new Object());
			Object.Implements=targetImplements;
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.AssignableFrom.CallsObjectImplements: 'actual' was false.");			
		}

		[Fact]
		function PassesExpectedToObjectImplements(){
			var targetImplements=Object.Implements;
			Object.Implements=function(targetExpected){
				actual=targetExpected;
				return true;
			}
			var actual=null;
			var expected=function(){};
			
			Assert.AssignableFrom(expected);
			Object.Implements=targetImplements;
			
			if(expected!=actual)throw new AssertError(String.Format("Test.xUnit.js.Assert.AssignableFrom.PassesExpectedToObjectImplements: expected '{0}', found '{1}'.",expected,actual));			
		}

		[Fact]
		function PassesActualToObjectImplements(){
			var targetImplements=Object.Implements;
			Object.Implements=function(targetExpected,targetActual){
				actual=targetActual;
				return true;
			}
			var actual=null;
			var expected="expected";
			
			Assert.AssignableFrom(function(){},expected);
			Object.Implements=targetImplements;
			
			if(expected!=actual)throw new AssertError(String.Format("Test.xUnit.js.Assert.AssignableFrom.PassesActualToObjectImplements: expected '{0}', found '{1}'.",expected,actual));			
		}
		
		[Fact]
		function CallsObjectIsType(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls<2)return targetIsType(targetExpected,targetActual);
				actual=true;
				return true;
			}
			var actual=false;
			
			Assert.AssignableFrom(function(){},new Object());
			Object.IsType=targetIsType;
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.AssignableFrom.CallsObjectIsType: 'actual' was false.");			
		}

		[Fact]
		function PassesExpectedToObjectIsType(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls<2)return targetIsType(targetExpected,targetActual);
				actual=targetExpected;
				return true;
			}
			var actual=null;
			var expected=function(){}
			
			Assert.AssignableFrom(expected);
			Object.IsType=targetIsType;
			
			if(expected!=actual)throw new AssertError(String.Format("Test.xUnit.js.Assert.AssignableFrom.PassesExpectedToObjectImplements: expected '{0}', found '{1}'.",expected,actual));			
		}

		[Fact]
		function PassesActualToObjectIsType(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls<2)return targetIsType(targetExpected,targetActual);
				actual=targetActual;
				return true;
			}
			var targetInherits=Object.Inherits;
			Object.Inherits=function(){
				return false;
			}
			var targetImplements=Object.Implements;
			Object.Implements=function(){
				return false;
			}			
			var actual=null;
			var expected=new Object();

			Assert.AssignableFrom(function(){},expected);
			Object.Inherits=targetInherits;
			Object.Implements=targetImplements;
			Object.IsType=targetIsType;
			
			if(expected!=actual)throw new AssertError(String.Format("Test.xUnit.js.Assert.AssignableFrom.PassesActualToObjectIsType: expected '{0}', found '{1}'.",expected,actual));			
		}
		
		[Fact]
		function ThrowsIfIsTypeInheritsAndImplementsReturnFalse(){
			var targetCalls=0;
			var targetIsType=Object.IsType;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=3)return targetIsType(targetExpected,targetActual);
				return false;
			}
			var targetInherits=Object.Inherits;
			Object.Inherits=function(){
				return false;
			}
			var targetImplements=Object.Implements;
			Object.Implements=function(){
				return false;
			}
			var expected="Assert.AssignableFrom: 'actual' is not assignable from 'expected'";

			var actual=Record.Exception(function(){
				Assert.AssignableFrom(function(){});
			});
			Object.Implements=targetImplements;
			Object.Inherits=targetInherits;
			Object.IsType=targetIsType;
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.AssignableFrom.ThrowsIfIsTypeInheritsAndImplementsReturnFalse: expected '{0}', found '{1}'.",expected,actual));			
		}
	}
	
	[Fixture]
	function NotType(){
		[Fact]
		function CallsObjectIsType(){
			var targetIsType=Object.IsType;
			Object.IsType=function(){
				actual=true;
			}
			var actual=false;
			
			Assert.NotType();
			Object.IsType=targetIsType;
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.NotType.CallsObjectIsType: 'actual' was not true.");
		}

		[Fact]
		function PassesExpectedToObjectIsType(){
			var targetIsType=Object.IsType;
			Object.IsType=function(targetExpected){
				actual=targetExpected;
			}
			var actual=null;
			var expected="expected";
			
			Assert.NotType(expected);
			Object.IsType=targetIsType;
			
			if(expected!=actual)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotType.PassesExpectedToObjectIsType: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function PassesActualToObjectIsType(){
			var targetIsType=Object.IsType;
			Object.IsType=function(targetExpected,targetActual){
				actual=targetActual;
			}
			var actual=null;
			var expected="expected";
			
			Assert.NotType('',expected);
			Object.IsType=targetIsType;
			
			if(expected!=actual)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotType.PassesActualToObjectIsType: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfObjectIsTypeReturnsTrue(){
			var targetIsType=Object.IsType;
			Object.IsType=function(){
				return true;
			}
			var expected="Assert.NotType: 'actual' was of the 'expected' type.";
			
			var actual=Record.Exception(function(){
				Assert.NotType();
			});
			Object.IsType=targetIsType;
			
			if(!Object.Equals(expected,actual))throw new AssertError("Test.xUnit.js.Assert.NotType.CallsObjectIsType: 'actual' was not true.");
		}	
	}
	
	[Fixture]
	function Type(){
		[Fact]
		function CallsObjectIsType(){
			var targetIsType=Object.IsType;
			Object.IsType=function(){
				actual=true;
				return true;
			}
			var actual=false;
			
			Assert.Type();
			Object.IsType=targetIsType;
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.Type.CallsObjectIsType: 'actual' was not true.");
		}

		[Fact]
		function PassesExpectedToObjectIsType(){
			var targetIsType=Object.IsType;
			Object.IsType=function(targetExpected){
				actual=targetExpected;
				return true;
			}
			var actual=null;
			var expected="expected";
			
			Assert.Type(expected);
			Object.IsType=targetIsType;
			
			if(expected!=actual)throw new AssertError(String.Format("Test.xUnit.js.Assert.Type.PassesExpectedToObjectIsType: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function PassesActualToObjectIsType(){
			var targetIsType=Object.IsType;
			Object.IsType=function(targetExpected,targetActual){
				actual=targetActual;
				return true;
			}
			var actual=null;
			var expected="expected";
			
			Assert.Type('',expected);
			Object.IsType=targetIsType;
			
			if(expected!=actual)throw new AssertError(String.Format("Test.xUnit.js.Assert.Type.PassesActualToObjectIsType: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfObjectIsTypeReturnsFalse(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=2)return targetIsType(targetExpected,targetActual);
				return false;
			}
			var expected="Assert.Type: 'actual' was not of the 'expected' type.";
			
			var actual=Record.Exception(function(){
				Assert.Type();
			});
			Object.IsType=targetIsType;
			
			if(expected!=actual)throw new AssertError(String.Format("Test.xUnit.js.Assert.Type.ThrowsIfObjectIsTypeReturnsTrue: expected '{0}', found '{1}'.",expected,actual));
		}
	}
	
	[Fixture]
	function NotEmpty(){
		[Fact]
		function ThrowsIfActualIsOmitted(){
			var expected="Object.IsEmpty: 'instance' was undefined.";

			var actual=Record.Exception(function(){
				Assert.NotEmpty();
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.ThrowsIfActualIsOmitted: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsUndefined(){
			var expected="Object.IsEmpty: 'instance' was undefined.";
			
			var actual=Record.Exception(function(){
				Assert.NotEmpty(undefined);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.ThrowsIfActualIsUndefined: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsNull(){
			var expected="Object.IsEmpty: 'instance' was undefined.";
			
			var actual=Record.Exception(function(){
				Assert.NotEmpty(null);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.ThrowsIfActualIsNull: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAnArrayWithNoValues(){
			var expected="Assert.NotEmpty: 'actual' was empty.";
			
			var actual=Record.Exception(function(){
				Assert.NotEmpty([]);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError("Test.xUnit.js.Assert.ThrowsIfActualIsAnArrayWithNoValues: 'actual' did not throw.");
		}

		[Fact]
		function ThrowsIfActualIsAnEmptyString(){
			var expected="Assert.NotEmpty: 'actual' was empty.";
			
			var actual=Record.Exception(function(){
				Assert.NotEmpty('');
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError("Test.xUnit.js.Assert.ThrowsIfActualIsAnEmptyString: 'actual' did not throw.");
		}
		
		[Fact]
		function ThrowsIfActualIsAnObjectWithNoProperties(){
			var expected="Assert.NotEmpty: 'actual' was empty.";
			
			var actual=Record.Exception(function(){
				Assert.NotEmpty([]);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError("Test.xUnit.js.Assert.ThrowsIfActualIsAnObjectWithNoProperties: 'actual' did not throw.");
		}
		
		[Fact]
		function DoesNotThrowIfActualIsAnArrayWithValues(){
			var actual=Record.Exception(function(){
				Assert.NotEmpty([1]);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.DoesNotThrowIfActualIsAnArrayWithValues: 'actual' was not null. Error: '{0}'",actual));
		}
		
		[Fact]
		function DoesNotThrowIfActualIsANonEmptyString(){
			var actual=Record.Exception(function(){
				Assert.NotEmpty('target');
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.DoesNotThrowIfActualIsANonEmptyString: 'actual' was not null. Error: '{0}'",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsABooleanTrue(){
			var actual=Record.Exception(function(){
				Assert.NotEmpty(true);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.DoesNotThrowIfActualIsABooleanTrue: 'actual' was not null. Error: '{0}'",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsABooleanFalse(){
			var actual=Record.Exception(function(){
				Assert.NotEmpty(false);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.DoesNotThrowIfActualIsABooleanFalse: 'actual' was not null. Error: '{0}'",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsAnError(){
			var actual=Record.Exception(function(){
				Assert.NotEmpty(new Error("error"));
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.DoesNotThrowIfActualIsAnError: 'actual' was not null. Error: '{0}'",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsAFunction(){
			var actual=Record.Exception(function(){
				Assert.NotEmpty(function(){return;});
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.DoesNotThrowIfActualIsAFunction: 'actual' was not null. Error: '{0}'",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsZero(){
			var actual=Record.Exception(function(){
				Assert.NotEmpty(0);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.DoesNotThrowIfActualIsZero: 'actual' was not null. Error: '{0}'",actual));
		}
		
		[Fact]
		function DoesNotThrowIfActualIsANumber(){
			var actual=Record.Exception(function(){
				Assert.NotEmpty(1);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.DoesNotThrowIfActualIsANumber: 'actual' was not null. Error: '{0}'",actual));
		}
		
		[Fact]
		function DoesNotThrowIfActualIsAnObjectWithProperties(){
			var actual=Record.Exception(function(){
				Assert.NotEmpty({target:'target'});
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.DoesNotThrowIfActualIsAnObjectWithProperties: 'actual' was not null. Error: '{0}'",actual));
		}
	}
	
	[Fixture]
	function NotEqual(){
		[Fact]
		function CallsObjectEquals(){
			var targetEquals=Object.Equals;
			Object.Equals=function(){
				actual=true;
				return false;
			}
			var actual=false;

			Assert.NotEqual(0,1);
			Object.Equals=targetEquals;
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.NotEqual.CallsObjectEquals: 'actual' was false.");
		}

		[Fact]
		function PassesExpectedToObjectEquals(){
			var targetEquals=Object.Equals;
			Object.Equals=function(targetExpected){
				actual=targetExpected;
				return false;
			}
			var actual=null;
			var expected="expected";

			Assert.NotEqual(expected,1);
			Object.Equals=targetEquals;
			
			if(expected!=actual)throw new AssertError("Test.xUnit.js.Assert.NotEqual.PassesExpectedToObjectEquals: 'expected' was not equal to 'actual'.");
		}

		[Fact]
		function PassesActualToObjectEquals(){
			var targetEquals=Object.Equals;
			Object.Equals=function(targetExpected,targetActual){
				actual=targetActual;
				return false;
			}
			var actual=null;
			var expected="expected";

			Assert.NotEqual(1,expected);
			Object.Equals=targetEquals;
			
			if(expected!=actual)throw new AssertError("Test.xUnit.js.Assert.NotEqual.PassesExpectedToObjectEquals: 'expected' was not equal to 'actual'.");
		}
		
		[Fact]
		function PassesReasonToObjectEquals(){
			var targetEquals=Object.Equals;
			Object.Equals=function(targetExpected,targetMatch,targetReason){
				actual=targetReason;
				return false;
			}
			var actual=null;

			Assert.NotEqual(1,1);
			Object.Equals=targetEquals;
			
			if(actual==null)throw new AssertError("Test.xUnit.js.Assert.NotEqual.PassesReasonToObjectEquals: 'actual' was null.");
		}
		
		[Fact]
		function ThrowsIfObjectEqualsReturnsTrue(){
			var targetEquals=Object.Equals;
			Object.Equals=function(){
				return true;
			}
			
			var actual=Record.Exception(function(){
				Assert.NotEqual(1,1);
			});
			Object.Equals=targetEquals;
			
			if(actual==null)throw new AssertError("Test.xUnit.js.Assert.NotEqual.ThrowsIfObjectEqualsReturnsTrue: 'actual' was null.");
		}
		
		[Fact]
		function ThrowsKnownErrorIfObjectEqualsReturnsTrue(){
			var targetEquals=Object.Equals;
			Object.Equals=function(targetExpected,targetActual){
				return true;
			}
			var expected="Assert.NotEqual: 'actual' was equal to 'expected'.";
			
			var actual=Record.Exception(function(){
				Assert.NotEqual(0,1);
			});
			Object.Equals=targetEquals;
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.NotEqual.ThrowsKnownErrorIfObjectEqualsReturnsTrue: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function DoesNotThrowIfObjectEqualsReturnsFalse(){
			var targetEquals=Object.Equals;
			Object.Equals=function(){
				return false;
			}

			var actual=Record.Exception(function(){
				Assert.NotEqual(0,1);
			});
			Object.Equals=targetEquals;

			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotEqual.DoesNotThrowIfObjectEqualsReturnsFalse: 'actual' was not null. Error: '{0}'",actual));
		}
	}
	
	[Fixture]
	function NotInRange(){
		[Fact]
		function ThrowsIfComparerIsNotAValidFunction(){
			var expected="Assert.NotInRange: 'comparer' must be a valid Function pointer.";
			
			var actual=Record.Exception(function(){
				Assert.NotInRange(1,1,1,new Object());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.NotInRange.ThrowsIfComparerIsNotAValidFunction: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function CallsComparer(){
			var target=function(){
				actual=true;
			}
			var actual=false;

			Assert.NotInRange(1,1,1,target);
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.NotInRange.CallsComparer: did not call comparer.");
		}

		[Fact]
		function PassesActualToComparerWithLow(){
			var targetCalls=0;
			var target=function(low,targetActual){
				if(++targetCalls<2)actual=targetActual;
			}
			var actual=null;
			var expected=5;

			Assert.NotInRange(expected,1,10,target);
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.NotInRange.PassesActualToComparerWithLow: did not pass actual to comparer with low.");
		}

		[Fact]
		function PassesLowToComparerWithActual(){
			var targetCalls=0;
			var target=function(low){
				if(++targetCalls<2)actual=low;
			}
			var actual=null;
			var expected=1;

			Assert.NotInRange(5,expected,10,target);
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.NotInRange.PassesLowToComparerWithActual: did not pass low to comparer with actual.");
		}

		[Fact]
		function PassesHighToComparerWithActual(){
			var targetCalls=0;
			var target=function(targetActual,high){
				if(++targetCalls==2)actual=high;
				return targetCalls-1;
			}
			var actual=null;
			var expected=10;

			Assert.NotInRange(5,1,expected,target);

			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.NotInRange.PassesHighToComparerWithActual: did not pass high to comparer with actual. Expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function PassesActualToComparerWithHigh(){
			var targetCalls=0;
			var target=function(targetActual,high){
				if(++targetCalls>1)actual=targetActual;
				return targetCalls-1;
			}
			var actual=null;
			var expected=5;

			Assert.NotInRange(expected,1,10,target);
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.NotInRange.PassesHighToComparerWithActual: did not pass actual to comparer with high.");
		}
		
		[Fact]
		function ThrowsIfComparerReturnsLessThanZeroForLowAndHigh(){
			var targetActual=5;
			var targetLow=1;
			var targetHigh=10;
			var targetComparer=function(targetLow,targetActual){
				return -1;
			};
			var expected=String.Format("Assert.NotInRange: 'actual' was in the range as specified by 'comparer'. Expected low '{0}', high '{1}', found '{2}'.",targetLow,targetHigh,targetActual);
			
			var actual=Record.Exception(function(){
				Assert.NotInRange(targetActual,targetLow,targetHigh,targetComparer);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.NotInRange.ThrowsIfComparerReturnsGreaterThanZeroForLow: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfComparerReturnsZeroForLowAndHigh(){
			var targetActual=5;
			var targetLow=1;
			var targetHigh=10;
			var targetComparer=function(targetLow,targetActual){
				return 0;
			};
			var expected=String.Format("Assert.NotInRange: 'actual' was in the range as specified by 'comparer'. Expected low '{0}', high '{1}', found '{2}'.",targetLow,targetHigh,targetActual);
			
			var actual=Record.Exception(function(){
				Assert.NotInRange(targetActual,targetLow,targetHigh,targetComparer);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.NotInRange.ThrowsIfComparerReturnsZeroForLow: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfLowIsLessThanActualAndHighIsGreaterThanActual(){
			var targetActual=5;
			var targetLow=1;
			var targetHigh=10;
			var expected=String.Format("Assert.NotInRange: 'actual' was in the range specified. Expected low '{0}', high '{1}', found '{2}'.",targetLow,targetHigh,targetActual);
			
			var actual=Record.Exception(function(){
				Assert.NotInRange(targetActual,targetLow,targetHigh);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.NotInRange.ThrowsIfLowIsGreaterThanActual: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function DoesNotThrowIfActualIsNotInRangeForComparer(){
			var targetActual=5;
			var targetLow=1;
			var targetHigh=10;
			var targetComparer=function(){
				return 1;
			}
			
			var actual=Record.Exception(function(){
				Assert.NotInRange(targetActual,targetLow,targetHigh,targetComparer);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotInRange.DoesNotThrowIfActualIsNotInRange: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsNotInRange(){
			var targetActual=-5;
			var targetLow=1;
			var targetHigh=10;
			
			var actual=Record.Exception(function(){
				Assert.NotInRange(targetActual,targetLow,targetHigh);
			});
			
			if(actual!=null)throw new AssertError("Test.xUnit.js.Assert.NotInRange.DoesNotThrowIfActualIsNotInRange: 'actual' threw an error.");
		}
	}
	
	[Fixture]
	function NotNull(){
		[Fact]
		function DoesNotThrowIfActualIsOmitted(){
			var actual=Record.Exception(function(){
				Assert.NotNull();
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotNull.DoesNotThrowIfActualIsOmitted: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsUndefined(){
			var actual=Record.Exception(function(){
				Assert.NotNull(undefined);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotNull.DoesNotThrowIfActualIsUndefined: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsAnArray(){
			var actual=Record.Exception(function(){
				Assert.NotNull([]);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotNull.DoesNotThrowIfActualIsAnArray: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsABooleanTrue(){
			var actual=Record.Exception(function(){
				Assert.NotNull(true);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotNull.DoesNotThrowIfActualIsABooleanTrue: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsABooleanFalse(){
			var actual=Record.Exception(function(){
				Assert.NotNull(false);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotNull.DoesNotThrowIfActualIsABooleanFalse: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsAnError(){
			var actual=Record.Exception(function(){
				Assert.NotNull(new Error());
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotNull.DoesNotThrowIfActualIsAnError: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsAFunction(){
			var actual=Record.Exception(function(){
				Assert.NotNull(function(){});
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotNull.DoesNotThrowIfActualIsAFunction: 'actual' threw an error. Error: '{0}'.",actual));
		}
		
		[Fact]
		function DoesNotThrowIfActualIsZero(){
			var actual=Record.Exception(function(){
				Assert.NotNull(0);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotNull.DoesNotThrowIfActualIsZero: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsANumber(){
			var actual=Record.Exception(function(){
				Assert.NotNull(1);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotNull.DoesNotThrowIfActualIsANumber: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsAnObject(){
			var actual=Record.Exception(function(){
				Assert.NotNull(new Object());
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotNull.DoesNotThrowIfActualIsAnObject: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsACustomObject(){
			var actual=Record.Exception(function(){
				Assert.NotNull(new function(){
					this.target="target"}
				);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotNull.DoesNotThrowIfActualIsACustomObject: 'actual' threw an error. Error: '{0}'.",actual));
		}
		
		[Fact]
		function ThrowsIfActualIsNull(){
			var expected="Assert.NotNull: 'actual' was null.";
			
			var actual=Record.Exception(function(){
				Assert.NotNull(null);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.NotNull.ThrowsIfActualIsNull: expected '{0}', found '{1}'.",expected,actual));
		}
	}
	
	[Fixture]
	function NotSame(){
		[Fact]
		function ThrowsIfExpectedAndActualAreSameArrayReference(){
			var target=[];
			var expected="Assert.NotSame: 'actual' was the same object as 'expected'.";
		
			var actual=Record.Exception(function(){
				Assert.NotSame(target,target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.NotSame.ThrowsIfExpectedAndActualAreSameArrayReference: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfExpectedAndActualAreSameBooleanValueTrue(){
			var expected="Assert.NotSame: 'actual' was the same object as 'expected'.";
		
			var actual=Record.Exception(function(){
				Assert.NotSame(true,true);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.NotSame.ThrowsIfExpectedAndActualAreSameBooleanValueTrue: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfExpectedAndActualAreSameBooleanValueFalse(){
			var expected="Assert.NotSame: 'actual' was the same object as 'expected'.";
		
			var actual=Record.Exception(function(){
				Assert.NotSame(false,false);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.NotSame.ThrowsIfExpectedAndActualAreSameBooleanValueFalse: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfExpectedAndActualAreSameErrorReference(){
			var target=new Error();
			var expected="Assert.NotSame: 'actual' was the same object as 'expected'.";
		
			var actual=Record.Exception(function(){
				Assert.NotSame(target,target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.NotSame.ThrowsIfExpectedAndActualAreSameErrorReference: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfExpectedAndActualAreSameFunctionPointer(){
			var target=new Function();
			var expected="Assert.NotSame: 'actual' was the same object as 'expected'.";
		
			var actual=Record.Exception(function(){
				Assert.NotSame(target,target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.NotSame.ThrowsIfExpectedAndActualAreSameFunctionPointer: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfExpectedAndActualAreSameNumberValue(){
			var target=new Function();
			var expected="Assert.NotSame: 'actual' was the same object as 'expected'.";
		
			var actual=Record.Exception(function(){
				Assert.NotSame(1,1);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.NotSame.ThrowsIfExpectedAndActualAreSameNumberValue: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfExpectedAndActualAreSameObjectReference(){
			var target=new Object();
			var expected="Assert.NotSame: 'actual' was the same object as 'expected'.";
		
			var actual=Record.Exception(function(){
				Assert.NotSame(target,target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.NotSame.ThrowsIfExpectedAndActualAreSameObjectReference: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfExpectedAndActualAreSameStringValue(){
			var expected="Assert.NotSame: 'actual' was the same object as 'expected'.";
		
			var actual=Record.Exception(function(){
				Assert.NotSame("target","target");
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.NotSame.ThrowsIfExpectedAndActualAreSameStringValue: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function DoesNotThrowIfExpectedAndActualAreDifferentArrayReferences(){
			var actual=Record.Exception(function(){
				Assert.NotSame([],[]);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotSame.DoesNotThrowIfExpectedAndActualAreDifferentArrayReferences: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfExpectedAndActualAreDifferentBooleanValues(){
			var actual=Record.Exception(function(){
				Assert.NotSame(true,false);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotSame.DoesNotThrowIfExpectedAndActualAreDifferentBooleanValues: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfExpectedAndActualAreDifferentErrorReferences(){
			var actual=Record.Exception(function(){
				Assert.NotSame(new Error(),new Error());
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotSame.DoesNotThrowIfExpectedAndActualAreDifferentErrorReferences: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfExpectedAndActualAreDifferentFunctionPointers(){
			var actual=Record.Exception(function(){
				Assert.NotSame(function(){},function(){});
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotSame.DoesNotThrowIfExpectedAndActualAreDifferentFunctionPointers: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfExpectedAndActualAreDifferentNumberValues(){
			var actual=Record.Exception(function(){
				Assert.NotSame(0,1);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotSame.DoesNotThrowIfExpectedAndActualAreDifferentNumberValues: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfExpectedAndActualAreDifferentObjectReferences(){
			var actual=Record.Exception(function(){
				Assert.NotSame(new Object(),new Object());
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotSame.DoesNotThrowIfExpectedAndActualAreDifferentObjectReferences: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfExpectedAndActualAreDifferentCustomObjectReferences(){
			var target=function(){};
			
			var actual=Record.Exception(function(){
				Assert.NotSame(new target(),new target());
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotSame.DoesNotThrowIfExpectedAndActualAreDifferentCustomObjectReferences: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfExpectedAndActualAreDifferentStringValues(){
			var actual=Record.Exception(function(){
				Assert.NotSame("target1","target2");
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotSame.DoesNotThrowIfExpectedAndActualAreDifferentStringValues: 'actual' threw an error. Error: '{0}'.",actual));
		}
	}

	[Fixture]
	function NotUndefined(){
		[Fact]
		function ThrowsIfActualIsOmitted(){
			var expected="Assert.NotUndefined: 'actual' was undefined.";
			
			var actual=Record.Exception(function(){
				Assert.NotUndefined();
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.NotUndefined.ThrowsIfActualIsOmitted: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsUndefined(){
			var expected="Assert.NotUndefined: 'actual' was undefined.";
			
			var actual=Record.Exception(function(){
				Assert.NotUndefined(undefined);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.NotUndefined.ThrowsIfActualIsUndefined: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsNull(){
			var actual=Record.Exception(function(){
				Assert.NotUndefined(null);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotUndefined.DoesNotThrowIfActualIsNull: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsAnArray(){
			var actual=Record.Exception(function(){
				Assert.NotUndefined([]);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotUndefined.DoesNotThrowIfActualIsAnArray: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsABooleanFalse(){
			var actual=Record.Exception(function(){
				Assert.NotUndefined(false);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotUndefined.DoesNotThrowIfActualIsABooleanFalse: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsABooleanTrue(){
			var actual=Record.Exception(function(){
				Assert.NotUndefined(true);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotUndefined.DoesNotThrowIfActualIsABooleanTrue: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsAnError(){
			var actual=Record.Exception(function(){
				Assert.NotUndefined(new Error());
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotUndefined.DoesNotThrowIfActualIsAnError: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsAFunction(){
			var actual=Record.Exception(function(){
				Assert.NotUndefined(function(){});
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotUndefined.DoesNotThrowIfActualIsAFunction: 'actual' threw an error. Error: '{0}'.",actual));
		}
		
		[Fact]
		function DoesNotThrowIfActualIsZero(){
			var actual=Record.Exception(function(){
				Assert.NotUndefined(0);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotUndefined.DoesNotThrowIfActualIsZero: 'actual' threw an error. Error: '{0}'.",actual));
		}
		
		[Fact]
		function DoesNotThrowIfActualIsANumber(){
			var actual=Record.Exception(function(){
				Assert.NotUndefined(1);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotUndefined.DoesNotThrowIfActualIsANumber: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsAnObject(){
			var actual=Record.Exception(function(){
				Assert.NotUndefined(new Object());
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotUndefined.DoesNotThrowIfActualIsAnObject: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsACustomObject(){
			var actual=Record.Exception(function(){
				Assert.NotUndefined(new function(){
					this.taqrget="target";
				});
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotUndefined.DoesNotThrowIfActualIsACustomObject: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsAnEmptyString(){
			var actual=Record.Exception(function(){
				Assert.NotUndefined('');
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotUndefined.DoesNotThrowIfActualIsAnEmptyString: 'actual' threw an error. Error: '{0}'.",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsAString(){
			var actual=Record.Exception(function(){
				Assert.NotUndefined("target");
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.NotUndefined.DoesNotThrowIfActualIsAString: 'actual' threw an error. Error: '{0}'.",actual));
		}
	}
	
	[Fixture]
	function Null(){
		[Fact]
		function ThrowsIfActualIsOmitted(){
			var target=undefined;
			var expected=String.Format("Assert.Null: 'actual' was not null. Found '{0}'.",target);
		
			var actual=Record.Exception(function(){
				Assert.Null();
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Null.ThrowsIfActualIsOmitted: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsUndefined(){
			var target=undefined;
			var expected=String.Format("Assert.Null: 'actual' was not null. Found '{0}'.",target);
		
			var actual=Record.Exception(function(){
				Assert.Null(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Null.ThrowsIfActualIsUndefined: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAnArray(){
			var target=new Array();
			var expected=String.Format("Assert.Null: 'actual' was not null. Found '{0}'.",target);
		
			var actual=Record.Exception(function(){
				Assert.Null(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Null.ThrowsIfActualIsAnArray: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsABooleanFalse(){
			var target=false;
			var expected=String.Format("Assert.Null: 'actual' was not null. Found '{0}'.",target);
		
			var actual=Record.Exception(function(){
				Assert.Null(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Null.ThrowsIfActualIsABooleanFalse: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsABooleanTrue(){
			var target=true;
			var expected=String.Format("Assert.Null: 'actual' was not null. Found '{0}'.",target);
		
			var actual=Record.Exception(function(){
				Assert.Null(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Null.ThrowsIfActualIsABooleanTrue: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAnError(){
			var target=new Error();
			var expected=String.Format("Assert.Null: 'actual' was not null. Found '{0}'.",target);
		
			var actual=Record.Exception(function(){
				Assert.Null(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Null.ThrowsIfActualIsAnError: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsAFunction(){
			var target=new Function();
			var expected=String.Format("Assert.Null: 'actual' was not null. Found '{0}'.",target);
		
			var actual=Record.Exception(function(){
				Assert.Null(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Null.ThrowsIfActualIsAFunction: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsZero(){
			var target=0;
			var expected=String.Format("Assert.Null: 'actual' was not null. Found '{0}'.",target);
		
			var actual=Record.Exception(function(){
				Assert.Null(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Null.ThrowsIfActualIsZero: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsANumber(){
			var target=1;
			var expected=String.Format("Assert.Null: 'actual' was not null. Found '{0}'.",target);
		
			var actual=Record.Exception(function(){
				Assert.Null(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Null.ThrowsIfActualIsANumber: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsAnObject(){
			var target=new Object();
			var expected=String.Format("Assert.Null: 'actual' was not null. Found '{0}'.",target);
		
			var actual=Record.Exception(function(){
				Assert.Null(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Null.ThrowsIfActualIsAnObject: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsACustomObject(){
			var target=new function(){
				this.target="target";
			};
			var expected=String.Format("Assert.Null: 'actual' was not null. Found '{0}'.",target);
		
			var actual=Record.Exception(function(){
				Assert.Null(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Null.ThrowsIfActualIsACustomObject: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAnEmptyString(){
			var target='';
			var expected=String.Format("Assert.Null: 'actual' was not null. Found '{0}'.",target);
		
			var actual=Record.Exception(function(){
				Assert.Null(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Null.ThrowsIfActualIsAnEmptyString: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAString(){
			var target="target";
			var expected=String.Format("Assert.Null: 'actual' was not null. Found '{0}'.",target);
		
			var actual=Record.Exception(function(){
				Assert.Null(target);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Null.ThrowsIfActualIsAString: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function DoesNotThrowIfActualIsNull(){
			var actual=Record.Exception(function(){
				Assert.Null(null);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.Null.ThrowsIfActualIsAnArray: 'actual' threw an error. Error: '{0}'.",actual));
		}
	}
	
	[Fixture]
	function Same(){
		[Fact]
		function ThrowsIfExpectedAndActualAreDifferentArrayReferences(){
			var expected="Assert.Same: 'actual' was not the same object as 'expected'.";
		
			var actual=Record.Exception(function(){
				Assert.Same(new Array(),new Array());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Same.ThrowsIfExpectedAndActualAreDifferentArrayReferences: expected '{0}', found '{1}'",expected,actual));
		}

		[Fact]
		function ThrowsIfExpectedAndActualAreDifferentBooleanValues(){
			var expected="Assert.Same: 'actual' was not the same object as 'expected'.";
		
			var actual=Record.Exception(function(){
				Assert.Same(true,false);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Same.ThrowsIfExpectedAndActualAreDifferentBooleanValues: expected '{0}', found '{1}'",expected,actual));
		}

		[Fact]
		function ThrowsIfExpectedAndActualAreDifferentErrorReferences(){
			var expected="Assert.Same: 'actual' was not the same object as 'expected'.";
		
			var actual=Record.Exception(function(){
				Assert.Same(new Error(),new Error());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Same.ThrowsIfExpectedAndActualAreDifferentErrorReferences: expected '{0}', found '{1}'",expected,actual));
		}

		[Fact]
		function ThrowsIfExpectedAndActualAreDifferentFunctionPointers(){
			var expected="Assert.Same: 'actual' was not the same object as 'expected'.";
		
			var actual=Record.Exception(function(){
				Assert.Same(new Function(),new Function());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Same.ThrowsIfExpectedAndActualAreDifferentFunctionPointers: expected '{0}', found '{1}'",expected,actual));
		}

		[Fact]
		function ThrowsIfExpectedAndActualAreDifferentNumberValues(){
			var expected="Assert.Same: 'actual' was not the same object as 'expected'.";
		
			var actual=Record.Exception(function(){
				Assert.Same(0,1);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Same.ThrowsIfExpectedAndActualAreDifferentNumberValues: expected '{0}', found '{1}'",expected,actual));
		}

		[Fact]
		function ThrowsIfExpectedAndActualAreDifferentObjectReferences(){
			var expected="Assert.Same: 'actual' was not the same object as 'expected'.";
		
			var actual=Record.Exception(function(){
				Assert.Same(new Object(),new Object());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Same.ThrowsIfExpectedAndActualAreDifferentObjectReferences: expected '{0}', found '{1}'",expected,actual));
		}

		[Fact]
		function ThrowsIfExpectedAndActualAreDifferentCustomObjectReferences(){
			var target=function(){};
			var expected="Assert.Same: 'actual' was not the same object as 'expected'.";
		
			var actual=Record.Exception(function(){
				Assert.Same(new target(),new target());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Same.ThrowsIfExpectedAndActualAreDifferentCustomObjectReferences: expected '{0}', found '{1}'",expected,actual));
		}

		[Fact]
		function ThrowsIfExpectedAndActualAreDifferentStringValues(){
			var expected="Assert.Same: 'actual' was not the same object as 'expected'.";
		
			var actual=Record.Exception(function(){
				Assert.Same("target1","target2");
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Same.ThrowsIfExpectedAndActualAreDifferentStringValues: expected '{0}', found '{1}'",expected,actual));
		}
		
		[Fact]
		function DoesNotThrowIfExpectedAndActualAreSameArrayReference(){
			var target=new Array();
			
			var actual=Record.Exception(function(){
				Assert.Same(target,target);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.Same.DoesNotThrowIfExpectedAndActualAreSameArrayReference: 'actual' threw an error. Error: '{0}'.",actual));
		}
		
		[Fact]
		function DoesNotThrowIfExpectedAndActualAreSameBooleanValueFalse(){
			var actual=Record.Exception(function(){
				Assert.Same(false,false);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.Same.DoesNotThrowIfExpectedAndActualAreSameBooleanValueFalse: 'actual' threw an error. Error: '{0}'.",actual));
		}
		
		[Fact]
		function DoesNotThrowIfExpectedAndActualAreSameBooleanValueTrue(){
			var actual=Record.Exception(function(){
				Assert.Same(true,true);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.Same.DoesNotThrowIfExpectedAndActualAreSameBooleanValueTrue: 'actual' threw an error. Error: '{0}'.",actual));
		}
		
		
		[Fact]
		function DoesNotThrowIfExpectedAndActualAreSameErrorReference(){
			var target=new Error();
			
			var actual=Record.Exception(function(){
				Assert.Same(target,target);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.Same.DoesNotThrowIfExpectedAndActualAreSameErrorReference: 'actual' threw an error. Error: '{0}'.",actual));
		}
		
		[Fact]
		function DoesNotThrowIfExpectedAndActualAreSameFunctionPointer(){
			var target=new Function();
			
			var actual=Record.Exception(function(){
				Assert.Same(target,target);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.Same.DoesNotThrowIfExpectedAndActualAreSameFunctionPointer: 'actual' threw an error. Error: '{0}'.",actual));
		}
		
		[Fact]
		function DoesNotThrowIfExpectedAndActualAreSameNumberValue(){
			var actual=Record.Exception(function(){
				Assert.Same(1,1);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.Same.DoesNotThrowIfExpectedAndActualAreSameNumberValue: 'actual' threw an error. Error: '{0}'.",actual));
		}
		
		[Fact]
		function DoesNotThrowIfExpectedAndActualAreSameObjectReference(){
			var target=new Object();
			
			var actual=Record.Exception(function(){
				Assert.Same(target,target);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.Same.DoesNotThrowIfExpectedAndActualAreSameObjectReference: 'actual' threw an error. Error: '{0}'.",actual));
		}
		
		[Fact]
		function DoesNotThrowIfExpectedAndActualAreSameCustomObjectReference(){
			var target=new function(){};
			
			var actual=Record.Exception(function(){
				Assert.Same(target,target);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.Same.DoesNotThrowIfExpectedAndActualAreSameCustomObjectReference: 'actual' threw an error. Error: '{0}'.",actual));
		}
		
		[Fact]
		function DoesNotThrowIfExpectedAndActualAreSameStringValue(){
			var actual=Record.Exception(function(){
				Assert.Same("target","target");
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.Same.DoesNotThrowIfExpectedAndActualAreSameStringValue: 'actual' threw an error. Error: '{0}'.",actual));
		}
	}
	
	[Fixture]
	function Throws(){
		[Fact]
		function CallsDelegate(){
			var target=function(){
				actual=true;
				throw new AssertError();
			}
			var actual=false;
		
			Assert.Throws(Error,target);

			if(!actual)throw new AssertError("Test.xUnit.js.Assert.Throws.CallsDelegate: 'actual' was false.");
		}

		[Fact]
		function ThrowsIfDelegateDoesNotThrow(){
			var expected="Assert.Throws: 'actual' did not throw an Error.";
			
			var actual=Record.Exception(function(){
				Assert.Throws(Error,function(){});
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Throws.ThrowsIfDelegateDoesNotThrow: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function CallsObjectIsTypeIfExpectedIsAFunction(){
			var targetIsType=Object.IsType;
			Object.IsType=function(){
				actual=true;
				return true;
			}
			var actual=false;
		
			Assert.Throws(Error,function(){
				throw new AssertError();
			});
			Object.IsType=targetIsType;
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.Throws.CallsObjectIsTypeWithThrownError: 'actual' was false.");
		}

		[Fact]
		function PassesExpectedToObjectIsTypeIfExpectedIsAFunction(){
			var targetIsType=Object.IsType;
			Object.IsType=function(targetExpected){
				actual=targetExpected;
				return true;
			}
			var actual=null;
			var expected=Error;
		
			Assert.Throws(expected,function(){
				throw new AssertError();
			});
			Object.IsType=targetIsType;
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Throws.PassesExpectedToObjectIsTypeIfExpectedIsAFunction: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function PassesActualToObjectIsTypeIfExpectedIsAFunction(){
			var targetIsType=Object.IsType;
			Object.IsType=function(targetExpected,targetActual){
				actual=targetActual;
				return true;
			}
			var actual=null;
			var expected=new Error();
		
			Assert.Throws(Error,function(){
				throw expected;
			});
			Object.IsType=targetIsType;
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Throws.PassesActualToObjectIsTypeWithThrownError: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfObjectIsTypeReturnsFalseIfExpectedIsAFunction(){
			var targetConstructor=Error;
			var targetExpected=new Error();
			var expected=String.Format("Assert.Throws: 'actual' threw an exception, but it was of the wrong type. Expected: '{0}', found: '{1}'.",Function.GetName(targetConstructor),Function.GetName(targetConstructor));
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=3)return targetIsType(targetExpected,targetActual);
				return false;
			}

			var actual=Record.Exception(function(){
				Assert.Throws(targetConstructor,function(){
					throw targetExpected;
				});
			});
			Object.IsType=targetIsType;
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Throws.ThrowsIfObjectIsTypeReturnsFalseIfExpectedIsAFunction: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function CallsObjectIsTypeIfExpectedIsAnInstance(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=2)return targetIsType(targetExpected,targetActual);
				actual=true;
				return true;
			}
			var actual=false;
			
			Assert.Throws(new Error(),function(){
				throw new Error();
			});
			Object.IsType=targetIsType;
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.Throws.CallsObjectIsTypeWithThrownError: 'actual' was false.");
		}

		[Fact]
		function PassesExpectedConstructorToObjectIsTypeIfExpectedIsAnInstance(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=2)return targetIsType(targetExpected,targetActual);
				actual=targetExpected;
				return true;
			}
			var actual=null;
			var expected=Error;
		
			Assert.Throws(new expected(),function(){
				throw new Error();
			});
			Object.IsType=targetIsType;

			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Throws.PassesExpectedConstructorToObjectIsTypeIfExpectedIsAnInstance: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function PassesActualToObjectIsTypeIfExpectedIsAnInstance(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=2)return targetIsType(targetExpected,targetActual);
				actual=targetActual;
				return true;
			}
			var actual=null;
			var expected=new Error();
		
			Assert.Throws(new Error(),function(){
				throw expected;
			});
			Object.IsType=targetIsType;
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Throws.PassesActualToObjectIsTypeWithThrownError: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfObjectIsTypeReturnsFalseIfExpectedIsAnInstance(){
			var targetConstructor=Error;
			var targetExpected=new Error();
			var expected=String.Format("Assert.Throws: 'actual' threw an exception, but it was of the wrong type. Expected: '{0}', found: '{1}'.",Function.GetName(targetConstructor),Function.GetName(targetConstructor));
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=3)return targetIsType(targetExpected,targetActual);
				return false;
			}

			var actual=Record.Exception(function(){
				Assert.Throws(targetExpected,function(){
					throw new targetConstructor();
				});
			});
			Object.IsType=targetIsType;
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Throws.ThrowsIfObjectIsTypeReturnsFalseIfExpectedIsAFunction: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function CallsObjectEqualsIfExpectedIsAnInstance(){
			var targetEquals=Object.Equals;
			Object.Equals=function(){
				actual=true;
				return true;
			}
			var actual=false;
			
			Assert.Throws(new Error(),function(){
				throw new AssertError();
			});
			Object.Equals=targetEquals;
			
			if(!actual)throw new AssertError("Test.xUnit.js.Assert.Throws.CallsObjectEqualsIfExpectedIsAnInstance: 'actual' was false.");
		}

		[Fact]
		function PassesExpectedToObjectEqualsIfExpectedIsAnInstance(){
			var targetEquals=Object.Equals;
			Object.Equals=function(targetExpected){
				actual=targetExpected;
				return true;
			}
			var actual=null;
			var expected=new Error();
			
			Assert.Throws(expected,function(){
				throw new AssertError();
			});
			Object.Equals=targetEquals;
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Throws.PassesExpectedToObjectEqualsIfExpectedIsAnInstance: expected '{0}', found '{1}'",expected,actual));
		}

		[Fact]
		function PassesActualToObjectEqualsIfExpectedIsAnInstance(){
			var targetEquals=Object.Equals;
			Object.Equals=function(targetExpected,targetActual){
				actual=targetActual;
				return true;
			}
			var actual=null;
			var expected=new Error();
			
			Assert.Throws(new Error(),function(){
				throw expected;
			});
			Object.Equals=targetEquals;
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Throws.PassesActualToObjectEqualsIfExpectedIsAnInstance: expected '{0}', found '{1}'",expected,actual));
		}

		[Fact]
		function PassesReasonToObjectEqualsIfExpectedIsAnInstance(){
			var targetEquals=Object.Equals;
			Object.Equals=function(targetExpected,targetActual,targetReason){
				actual=targetReason;
				return true;
			}
			var actual=null;
			
			Assert.Throws(new Error(),function(){
				throw new AssertError();
			});
			Object.Equals=targetEquals;
			
			if(actual==null)throw new AssertError("Test.xUnit.js.Assert.Throws.PassesActualToObjectEqualsIfExpectedIsAnInstance: 'actual' was null.");
		}
		
		[Fact]
		function ThrowsIfObjectEqualsReturnsFalseIfExpectedIsAnInstance(){
			var targetEquals=Object.Equals;
			Object.Equals=function(){
				return false;
			}

			var actual=Record.Exception(function(){
				Assert.Throws(new Error(),function(){
					throw new AssertError();
				});
			});
			Object.Equals=targetEquals;
			
			if(actual==null)throw new AssertError("Test.xUnit.js.Assert.Throws.ThrowsIfObjectIsTypeReturnsFalseIfExpectedIsAFunction: 'actual' was null.");
		}

		[Fact]
		function ThrowsErrorWithReasonIfObjectEqualsReturnsFalseIfExpectedIsAnInstance(){
			var targetReason="targetReason";
			var expected=String.Format("Assert.Throws: 'actual' did not throw the 'expected' exception. Reason: '{0}'.",targetReason);
			var targetEquals=Object.Equals;
			Object.Equals=function(targetExpected,targetActual,reason){
				reason.Value=targetReason;
				return false;
			}

			var actual=Record.Exception(function(){
				Assert.Throws(new Error(),function(){
					throw new AssertError();
				});
			});
			Object.Equals=targetEquals;
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Throws.ThrowsErrorWithReasonIfObjectEqualsReturnsFalseIfExpectedIsAnInstance: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ReturnsThrownErrorIfExpectedIsAFunctionAndTypesMatch(){
			var expected=new Error();
			
			var actual=Assert.Throws(Error,function(){
				throw expected;
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Throws.ReturnsThrownErrorIfExpectedIsAFunctionAndTypesMatch: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ReturnsThrownErrorIfExpectedIsAnInstanceAndTypesMatchAndErrorsMatch(){
			var expected=new Error("expected");
			
			var actual=Assert.Throws(expected,function(){
				throw expected;
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Throws.ReturnsThrownErrorIfExpectedIsAnInstanceAndTypesMatchAndErrorsMatch: expected '{0}', found '{1}'.",expected,actual));
		}
	}
	
	[Fixture]
	function True(){
		[Fact]
		function ThrowsIfActualIsOmitted(){
			var expected=String.Format("Assert.True: {0}","'actual' was not true.");

			var actual=Record.Exception(function(){
				Assert.True();
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.True.ThrowsIfActualIsOmitted: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsUndefined(){
			var expected=String.Format("Assert.True: {0}","'actual' was not true.");

			var actual=Record.Exception(function(){
				Assert.True(undefined);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.True.ThrowsIfActualIsUndefined: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsNull(){
			var expected=String.Format("Assert.True: {0}","'actual' was not true.");

			var actual=Record.Exception(function(){
				Assert.True(null);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.True.ThrowsIfActualIsNull: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsZero(){
			var expected=String.Format("Assert.True: {0}","'actual' was not true.");

			var actual=Record.Exception(function(){
				Assert.True(0);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.True.ThrowsIfActualIsZero: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsANumber(){
			var expected=String.Format("Assert.True: {0}","'actual' was not true.");

			var actual=Record.Exception(function(){
				Assert.True(1);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.True.ThrowsIfActualIsANumber: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsAnArray(){
			var expected=String.Format("Assert.True: {0}","'actual' was not true.");

			var actual=Record.Exception(function(){
				Assert.True(new Array());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.True.ThrowsIfActualIsAnArray: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAnError(){
			var expected=String.Format("Assert.True: {0}","'actual' was not true.");

			var actual=Record.Exception(function(){
				Assert.True(new Error());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.True.ThrowsIfActualIsAnError: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsAFunction(){
			var expected=String.Format("Assert.True: {0}","'actual' was not true.");

			var actual=Record.Exception(function(){
				Assert.True(new Function());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.True.ThrowsIfActualIsAFunction: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAnObject(){
			var expected=String.Format("Assert.True: {0}","'actual' was not true.");

			var actual=Record.Exception(function(){
				Assert.True(new Object());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.True.ThrowsIfActualIsAnError: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAnEmptyString(){
			var expected=String.Format("Assert.True: {0}","'actual' was not true.");

			var actual=Record.Exception(function(){
				Assert.True('');
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.True.ThrowsIfActualIsAnEmptyString: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsAString(){
			var expected=String.Format("Assert.True: {0}","'actual' was not true.");

			var actual=Record.Exception(function(){
				Assert.True("target");
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.True.ThrowsIfActualIsAString: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsFalse(){
			var expected=String.Format("Assert.True: {0}","'actual' was not true.");

			var actual=Record.Exception(function(){
				Assert.True(false);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.True.ThrowsIfActualIsTrue: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function DoesNotThrowIfActualIsTrue(){
			var actual=Record.Exception(function(){
				Assert.True(true);
			});
			
			if(actual!=null)throw new AssertError("Test.xUnit.js.Assert.True.DoesNotThrowIfActualIsFalse: 'actual' threw an error.");
		}
	}
	
	[Fixture]
	function Undefined(){
		[Fact]
		function ThrowsIfActualIsNull(){
			var expected="Assert.Undefined: 'actual' was not undefined.";
			
			var actual=Record.Exception(function(){
				Assert.Undefined(null);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Undefined.ThrowsIfActualIsNull: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAnArray(){
			var expected="Assert.Undefined: 'actual' was not undefined.";
			
			var actual=Record.Exception(function(){
				Assert.Undefined([]);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Undefined.ThrowsIfActualIsAnArray: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsABooleanFalse(){
			var expected="Assert.Undefined: 'actual' was not undefined.";
			
			var actual=Record.Exception(function(){
				Assert.Undefined(false);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Undefined.ThrowsIfActualIsABooleanFalse: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsABooleanTrue(){
			var expected="Assert.Undefined: 'actual' was not undefined.";
			
			var actual=Record.Exception(function(){
				Assert.Undefined(true);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Undefined.ThrowsIfActualIsABooleanTrue: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAnError(){
			var expected="Assert.Undefined: 'actual' was not undefined.";
			
			var actual=Record.Exception(function(){
				Assert.Undefined(new Error());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Undefined.ThrowsIfActualIsAnError: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAFunction(){
			var expected="Assert.Undefined: 'actual' was not undefined.";
			
			var actual=Record.Exception(function(){
				Assert.Undefined(function(){});
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Undefined.ThrowsIfActualIsAFunction: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsZero(){
			var expected="Assert.Undefined: 'actual' was not undefined.";
			
			var actual=Record.Exception(function(){
				Assert.Undefined(0);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Undefined.ThrowsIfActualIsZero: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function ThrowsIfActualIsANumber(){
			var expected="Assert.Undefined: 'actual' was not undefined.";
			
			var actual=Record.Exception(function(){
				Assert.Undefined(1);
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Undefined.ThrowsIfActualIsANumber: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAnObject(){
			var expected="Assert.Undefined: 'actual' was not undefined.";
			
			var actual=Record.Exception(function(){
				Assert.Undefined(new Object());
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Undefined.ThrowsIfActualIsAnObject: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsACustomObject(){
			var expected="Assert.Undefined: 'actual' was not undefined.";
			
			var actual=Record.Exception(function(){
				Assert.Undefined(new function(){
					this.taqrget="target";
				});
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Undefined.ThrowsIfActualIsACustomObject: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAnEmptyString(){
			var expected="Assert.Undefined: 'actual' was not undefined.";
			
			var actual=Record.Exception(function(){
				Assert.Undefined('');
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Undefined.ThrowsIfActualIsAnEmptyString: expected '{0}', found '{1}'.",expected,actual));
		}

		[Fact]
		function ThrowsIfActualIsAString(){
			var expected="Assert.Undefined: 'actual' was not undefined.";

			var actual=Record.Exception(function(){
				Assert.Undefined("target");
			});
			
			if(!Object.Equals(expected,actual))throw new AssertError(String.Format("Test.xUnit.js.Assert.Undefined.ThrowsIfActualIsAString: expected '{0}', found '{1}'.",expected,actual));
		}
		
		[Fact]
		function DoesNotThrowIfActualIsOmitted(){
			var actual=Record.Exception(function(){
				Assert.Undefined();
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.Undefined.DoesNotThrowIfActualIsOmitted: 'actual' threw an error. Error: '{0}'",actual));
		}

		[Fact]
		function DoesNotThrowIfActualIsUndefined(){
			var actual=Record.Exception(function(){
				Assert.Undefined(undefined);
			});
			
			if(actual!=null)throw new AssertError(String.Format("Test.xUnit.js.Assert.Undefined.DoesNotThrowIfActualIsUndefined: 'actual' threw an error. Error: '{0}'",actual));
		}
	}
}