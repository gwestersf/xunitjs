Function.RegisterNamespace("Test.xUnit.js.Attributes");

[Fixture]
Test.xUnit.js.Attributes.Engine=function(){
	[Fixture]
	function Engine(){
		[Fact]
		function CallsBaseOnEngine(){
			var actual=new xUnit.js.Attributes.Engine().Events;

			Assert.NotNull(actual);
		}
	}
	
	[Fixture]
	function RegisterFixture(){
		[Fact]
		function ThrowsIfTargetMethodIsOmitted(){
			var expected="xUnit.js.Attributes.Engine.RegisterFixture: 'targetMethod' must be a valid Function pointer.";		
			var target=new xUnit.js.Attributes.Engine();
			var actual=Record.Exception(function(){
				target.RegisterFixture();
			});

			Assert.Equal(expected,actual);
		}

		[Fact]
		function ThrowsIfTargetMethodIsNull(){
			var expected="xUnit.js.Attributes.Engine.RegisterFixture: 'targetMethod' must be a valid Function pointer.";		
			var target=new xUnit.js.Attributes.Engine();
			
			var actual=Record.Exception(function(){
				target.RegisterFixture(null);
			});

			Assert.Equal(expected,actual);
		}

		[Fact]
		function ThrowsIfTargetMethodIsUndefined(){
			var expected="xUnit.js.Attributes.Engine.RegisterFixture: 'targetMethod' must be a valid Function pointer.";		
			var target=new xUnit.js.Attributes.Engine();
			
			var actual=Record.Exception(function(){
				target.RegisterFixture(undefined);
			});

			Assert.Equal(expected,actual);
		}

		[Fact]
		function ThrowsIfTargetMethodIsNotAFunction(){
			var expected="xUnit.js.Attributes.Engine.RegisterFixture: 'targetMethod' must be a valid Function pointer.";		
			var target=new xUnit.js.Attributes.Engine();
			
			var actual=Record.Exception(function(){
				target.RegisterFixture({});
			});

			Assert.Equal(expected,actual);
		}
				
		[Fact]
		function PassesGetNameResultToFixtureConstructor(){
			var targetFixture=xUnit.js.Model.Fixture;
			xUnit.js.Attributes.Model.Fixture=function(name){
				actual=name;
				var fixture=new targetFixture(name,null);
				fixture.constructor=xUnit.js.Model.Fixture;
				return fixture;
			}
			var target=new xUnit.js.Attributes.Engine();
			var targetExpected=function expected(){};
			var actual=null;
			var expected=Function.GetName(targetExpected);
			
			target.RegisterFixture(targetExpected);
			xUnit.js.Attributes.Model.Fixture=targetFixture;

			Assert.Equal(expected,actual);			
		}

		[Fact]
		function ReturnsFixture(){
			var expected=xUnit.js.Attributes.Model.Fixture;

			var actual=new xUnit.js.Attributes.Engine().RegisterFixture(function(){});

			Assert.Type(expected,actual);
		}

	}
		
	[Fixture]
	function RegisterFact(){
		[Fact]
		function ThrowsIfTargetMethodIsOmitted(){
			var expected="xUnit.js.Attributes.Engine.RegisterFact: 'targetMethod' must be a valid Function pointer.";		
			var target=new xUnit.js.Attributes.Engine();
			var actual=Record.Exception(function(){
				target.RegisterFact();
			});

			Assert.Equal(expected,actual);
		}

		[Fact]
		function ThrowsIfTargetMethodIsNull(){
			var expected="xUnit.js.Attributes.Engine.RegisterFact: 'targetMethod' must be a valid Function pointer.";		
			var target=new xUnit.js.Attributes.Engine();
			
			var actual=Record.Exception(function(){
				target.RegisterFact(null);
			});

			Assert.Equal(expected,actual);
		}

		[Fact]
		function ThrowsIfTargetMethodIsUndefined(){
			var expected="xUnit.js.Attributes.Engine.RegisterFact: 'targetMethod' must be a valid Function pointer.";		
			var target=new xUnit.js.Attributes.Engine();
			
			var actual=Record.Exception(function(){
				target.RegisterFact(undefined);
			});

			Assert.Equal(expected,actual);
		}

		[Fact]
		function ThrowsIfTargetMethodIsNotAFunction(){
			var expected="xUnit.js.Attributes.Engine.RegisterFact: 'targetMethod' must be a valid Function pointer.";		
			var target=new xUnit.js.Attributes.Engine();
			
			var actual=Record.Exception(function(){
				target.RegisterFact({});
			});

			Assert.Equal(expected,actual);
		}
	
		[Fact]
		function ReturnsFact(){
			var expected=xUnit.js.Model.Fact;
			var target=new xUnit.js.Attributes.Engine();

			var actual=target.RegisterFact(function(){});

			Assert.Type(expected,actual);
		}
	}	
}
