Function.RegisterNamespace("Test.xUnit.js.Model");

[Fixture]
Test.xUnit.js.Model.Fixture=function(){
	[Fixture]
	function FixtureTest(){
		[Fact]
		function InitializesEvents(){
			var actual=new xUnit.js.Model.Fixture();
			
			Assert.NotNull(actual.Events);
		}
		
		[Fact]
		function SetsNameFromParameter(){
			var expected="FixtureNameOverride";
			
			var actual=new xUnit.js.Model.Fixture(expected);
			
			Assert.Equal(expected,actual.Name);
		}
		
		[Fact]
		function SetsNameToAnonymousIfNoParameterIsPassed(){
			var expected="[Anonymous]";
			
			var actual=new xUnit.js.Model.Fixture();
			
			Assert.Equal(expected,actual.Name);
		}
	}
}