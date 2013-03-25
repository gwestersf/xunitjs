Function.RegisterNamespace("Test.xUnit.js.Attributes");

[Fixture]
Test.xUnit.js.Attributes.FixtureAttribute=function(){
	[Fixture]
	function FixtureAttribute(){
		[Fact]
		function CallsBaseOnAttribute(){
			var targetBase=xUnit.js.Attributes.FixtureAttribute.prototype.base;
			xUnit.js.Attributes.FixtureAttribute.prototype.base=function(){
				actual=true;
				this.Target=function(){};
			}
			var targetRegisterFixture=xUnit.js.Attributes.Engine.Instance.RegisterFixture;
			xUnit.js.Attributes.Engine.Instance.RegisterFixture=function(target){
				return {Name:"name",Method:target};
			};
			var actual=false;

			new xUnit.js.Attributes.FixtureAttribute();
			xUnit.js.Attributes.FixtureAttribute.prototype.base=targetBase;
			xUnit.js.Attributes.Engine.Instance.RegisterFixture=targetRegisterFixture;
			
			Assert.True(actual);
		}

		[Fact]
		function ThrowsIfTargetIsUndefined(){
			var expected="xUnit.js.Attributes.FixtureAttribute.ctor: unable to locate attribute target.";
			var targetBase=xUnit.js.Attributes.FixtureAttribute.prototype.base;
			xUnit.js.Attributes.FixtureAttribute.prototype.base=function(){
				delete this.Target;
			};

			var actual=Record.Exception(function(){
				new xUnit.js.Attributes.FixtureAttribute();
			});
			xUnit.js.Attributes.FixtureAttribute.prototype.base=targetBase;

			Assert.Equal(expected,actual);
		}

		[Fact]
		function ThrowsIfTargetIsNull(){
			var expected="xUnit.js.Attributes.FixtureAttribute.ctor: unable to locate attribute target.";
			var targetBase=xUnit.js.Attributes.FixtureAttribute.prototype.base;
			xUnit.js.Attributes.FixtureAttribute.prototype.base=function(){
				this.Target=null;
			};

			var actual=Record.Exception(function(){
				new xUnit.js.Attributes.FixtureAttribute();
			});
			xUnit.js.Attributes.FixtureAttribute.prototype.base=targetBase;

			Assert.Equal(expected,actual);
		}

		[Fact]
		function ThrowsIfTargetIsNotAFunction(){
			var expected="xUnit.js.Attributes.FixtureAttribute.ctor: unable to locate attribute target.";
			var targetBase=xUnit.js.Attributes.FixtureAttribute.prototype.base;
			xUnit.js.Attributes.FixtureAttribute.prototype.base=function(){
				this.Target={};
			};

			var actual=Record.Exception(function(){
				new xUnit.js.Attributes.FixtureAttribute();
			});
			xUnit.js.Attributes.FixtureAttribute.prototype.base=targetBase;

			Assert.Equal(expected,actual);
		}

		[Fact]
		function CallsRegisterFixture(){
			var targetBase=xUnit.js.Attributes.FixtureAttribute.prototype.base;
			xUnit.js.Attributes.FixtureAttribute.prototype.base=function(){
				this.Target=function(){};
			};
			var targetRegisterFixture=xUnit.js.Attributes.Engine.Instance.RegisterFixture;
			xUnit.js.Attributes.Engine.Instance.RegisterFixture=function(target){
				actual=true;
				return {Name:"name",Method:target};
			};

			new xUnit.js.Attributes.FixtureAttribute();
			xUnit.js.Attributes.Engine.Instance.RegisterFixture=targetRegisterFixture;
			xUnit.js.Attributes.FixtureAttribute.prototype.base=targetBase;

			Assert.True(actual);
		}

		[Fact]
		function PassesTargetToRegisterFixture(){
			var expected=function(){};
			var targetBase=xUnit.js.Attributes.FixtureAttribute.prototype.base;
			xUnit.js.Attributes.FixtureAttribute.prototype.base=function(){
				this.Target=expected;
			};
			var targetRegisterFixture=xUnit.js.Attributes.Engine.Instance.RegisterFixture;
			xUnit.js.Attributes.Engine.Instance.RegisterFixture=function(target){
				actual=target;
				return {Name:"name",Method:target};
			};

			new xUnit.js.Attributes.FixtureAttribute();
			xUnit.js.Attributes.Engine.Instance.RegisterFixture=targetRegisterFixture;
			xUnit.js.Attributes.FixtureAttribute.prototype.base=targetBase;

			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function SetsFixtureOnFixtureAttribute(){
			var expected={Name:"name",Method:function(){}};
			var targetBase=xUnit.js.Attributes.FixtureAttribute.prototype.base;
			xUnit.js.Attributes.FixtureAttribute.prototype.base=function(){
				this.Target=expected.Method;
			};
			var targetRegisterFixture=xUnit.js.Attributes.Engine.Instance.RegisterFixture;
			xUnit.js.Attributes.Engine.Instance.RegisterFixture=function(){
				return expected;
			};

			var actual=new xUnit.js.Attributes.FixtureAttribute().Fixture;
			xUnit.js.Attributes.Engine.Instance.RegisterFixture=targetRegisterFixture;
			xUnit.js.Attributes.FixtureAttribute.prototype.base=targetBase;

			Assert.Equal(expected,actual);
		}

		[Fact]
		function SetsGetModelMethodOnTargetDecoration(){
			var target=function(){};
			var targetBase=xUnit.js.Attributes.FixtureAttribute.prototype.base;
			xUnit.js.Attributes.FixtureAttribute.prototype.base=function(){
				this.Target=target;
			};
			var targetRegisterFixture=xUnit.js.Attributes.Engine.Instance.RegisterFixture;
			xUnit.js.Attributes.Engine.Instance.RegisterFixture=function(){
				return {Name:"name",Method:target};
			};

			new xUnit.js.Attributes.FixtureAttribute()
			var actual=target.GetModel;
			xUnit.js.Attributes.Engine.Instance.RegisterFixture=targetRegisterFixture;
			xUnit.js.Attributes.FixtureAttribute.prototype.base=targetBase;

			Assert.Type(Function,actual);
		}		

		[Fact]
		function GetModelMethodOnTargetDecorationReturnsFixture(){
			var target=function(){};
			var expected={Name:"name",Method:target};
			var targetBase=xUnit.js.Attributes.FixtureAttribute.prototype.base;
			xUnit.js.Attributes.FixtureAttribute.prototype.base=function(){
				this.Target=target;
			};
			var targetRegisterFixture=xUnit.js.Attributes.Engine.Instance.RegisterFixture;
			xUnit.js.Attributes.Engine.Instance.RegisterFixture=function(){
				return expected;
			};

			new xUnit.js.Attributes.FixtureAttribute();
			var actual=target.GetModel();
			xUnit.js.Attributes.Engine.Instance.RegisterFixture=targetRegisterFixture;
			xUnit.js.Attributes.FixtureAttribute.prototype.base=targetBase;

			Assert.Equal(expected,actual);
		}		
	}
}
