Function.RegisterNamespace("Test.xUnit.js");

[Fixture]
Test.xUnit.js.RecordTest=function(){

	[Fixture]
	function Exception(){
		[Fact]
		function ThrowsOnNullDelegate(){
			var expected=new Error("Record.Exception: 'delegate' must be a valid Function pointer.");
			
			var actual=Assert.Throws(expected,function(){
				Record.Exception(null);
			});
			
			Assert.Equal(expected,actual);
		}
		[Fact]
		function ThrowsOnInvalidDelegate(){
			var expected=new Error("Record.Exception: 'delegate' must be a valid Function pointer.");
			
			var actual=Assert.Throws(expected,function(){
				Record.Exception(new Object());
			});
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function CallsDelegate(){
			var actual=false;
			
			Record.Exception(function(){
				actual=true;	
			});
			
			Assert.True(actual);
		}
		
		[Fact]
		function ReturnsNullIfNoExceptionThrown(){
			var actual=null;
			
			actual=Record.Exception(function(){});
			
			Assert.Null(actual);
		}
		[Fact]
		function ReturnsThrownException(){
			var expected=new Error("ReturnsThrownException");
			
			var actual=Record.Exception(function(){
				throw expected;
			});
			
			Assert.Equal(expected,actual);
		}
	}
}