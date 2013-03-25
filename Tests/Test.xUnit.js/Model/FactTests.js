Function.RegisterNamespace("Test.xUnit.js.Model");

[Fixture]
Test.xUnit.js.Model.Fact=function(){
	[Fixture]
	function FactTest(){
		[Fact]
		function ThrowsIfMethodInvalid(){
			var expected="xUnit.js.Model.Fact.ctor: 'method' must be a valid Function pointer.";
			
			var actual=Record.Exception(function(){
				new xUnit.js.Model.Fact(new Object());
			});

			Assert.NotNull(actual);
			Assert.Equal(expected,actual.toString());
		}
		[Fact]
		function InitializesEvents(){
			var actual=new xUnit.js.Model.Fact(function(){});
			
			Assert.NotNull(actual.Events);
		}

		[Fact]
		function SetsMethod(){
			var expected=function(){};
			
			var actual=new xUnit.js.Model.Fact(expected);
			
			Assert.Equal(expected,actual.Method);
		}

		[Fact]
		function SetsAnonymousNameFromFunction(){
			var expected="[anonymous]";
			
			var actual=new xUnit.js.Model.Fact(function(){});
			
			Assert.Equal(expected,actual.Name);
		}

		[Fact]
		function SetsNameFromFunction(){
			var expected="FactName";
			
			var actual=new xUnit.js.Model.Fact(function FactName(){});
			
			Assert.Equal(expected,actual.Name);
		}
		
		[Fact]
		function SetsNameFromParameter(){
			var expected="FactNameOverride";
			
			var actual=new xUnit.js.Model.Fact(function FactName(){},expected);
			
			Assert.Equal(expected,actual.Name);
		}
		
		[Fact]
		function SetsStateResultToUnknown(){
			var expected=xUnit.js.Model.Result.Unknown;

			var actual=new xUnit.js.Model.Fact(function(){}).State.Result;
			
			Assert.Equal(expected,actual);
		}
	}
	
	[Fixture]
	function GetPath(){
		[Fact]
		function ReturnsNameOfOrphanedFact(){
			var expected="expected";
			var target=new xUnit.js.Model.Fact(function(){},expected);
			
			var actual=target.GetPath();
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function ReturnsNameOfFactConcatenatedWithNameOfParent(){
			var targetExpected="expected";
			var target=new xUnit.js.Model.Fact(function(){},targetExpected,{Name:targetExpected});
			var expected=[targetExpected,targetExpected].join('.');
			
			var actual=target.GetPath();
			
			Assert.Equal(expected,actual);
		}
	}
	
	[Fixture]
	function Run(){		
		[Fact]
		function FiresBeforeRunEvent(){
			var actual=false;
			var target=new xUnit.js.Model.Fact(function(){});
			target.Events.Add("BeforeRun",function(){actual=true;});
			
			target.Run();
			
			Assert.True(actual);
		}

		[Fact]
		function SetsStateResultToUnknown(){
			var expected=xUnit.js.Model.Result.Unknown;
			var actual=null;
			var target=new xUnit.js.Model.Fact(function(){});
			target.Events.Add("BeforeRun",function(context){actual=context.Component.State.Result;});
			
			target.Run();
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function CancelingEventSkipsFact(){
			var actual=false;
			var target=new xUnit.js.Model.Fact(function(){
				actual=true;
			});
			target.Events.Add("BeforeRun",function(context){
				context.Cancel=true;
			});
			
			target.Run();
			
			Assert.False(actual);
		}

		[Fact]
		function CancelingEventSetsResultToSkipped(){
			var expected=xUnit.js.Model.Result.Skipped;
			var actual=null;
			var target=new xUnit.js.Model.Fact(function(){});
			target.Events.Add("BeforeRun",function(context){
				context.Cancel=true;
			});

			target.Run();
			actual=target.State.Result;

			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function PassingFactSetsResultToSuccess(){
			var expected=xUnit.js.Model.Result.Success;
			var actual=null;
			var target=new xUnit.js.Model.Fact(function(){return;});
			
			target.Run();
			actual=target.State.Result;
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function EmptyMethodSetsResultToFailure(){
			var expected=xUnit.js.Model.Result.Failure;
			var actual=null;
			var target=new xUnit.js.Model.Fact(function(){});
			
			target.Run();
			actual=target.State.Result;
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function FailingFactSetsResultToFailure(){
			var expected=xUnit.js.Model.Result.Failure;
			var actual=null;
			var target=new xUnit.js.Model.Fact(function(){Assert.Fail()});
			
			target.Run();
			actual=target.State.Result;
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function ErroringFactSetsResultToError(){
			var expected=xUnit.js.Model.Result.Error;
			var actual=null;
			var target=new xUnit.js.Model.Fact(function(){throw new Error()});
			
			target.Run();
			actual=target.State.Result;
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function FailingFactSetsStateMessage(){
			var expected=new Error("Fact Failed.");
			var actual=null;
			var target=new xUnit.js.Model.Fact(function(){throw expected});
			
			target.Run();
			actual=target.State.Message;
			
			Assert.Equal(expected.toString(),actual);
		}

		[Fact]
		function FiresAfterRunEvent(){
			var actual=false;
			var target=new xUnit.js.Model.Fact(function(){});
			target.Events.Add("AfterRun",function(){actual=true;});
			
			target.Run();
			
			Assert.True(actual);
		}
	}		
}
