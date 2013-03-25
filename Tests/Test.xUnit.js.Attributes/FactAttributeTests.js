Function.RegisterNamespace("Test.xUnit.js.Attributes");

[Fixture]
Test.xUnit.js.Attributes.FactAttribute=function(){
	[Fixture]
	function FactAttribute(){
		[Fact]
		function CallsBaseOnAttribute(){
			var targetBase=xUnit.js.Attributes.FactAttribute.prototype.base;
			xUnit.js.Attributes.FactAttribute.prototype.base=function(){
				actual=true;
				this.Target=function(){};
			}
			var targetRegisterFact=xUnit.js.Attributes.Engine.Instance.RegisterFact;
			xUnit.js.Attributes.Engine.Instance.RegisterFact=function(){};
			var actual=false;

			new xUnit.js.Attributes.FactAttribute();
			xUnit.js.Attributes.FactAttribute.prototype.base=targetBase;
			xUnit.js.Attributes.Engine.Instance.RegisterFact=targetRegisterFact;
			
			Assert.True(actual);
		}

		[Fact]
		function ThrowsIfTargetIsUndefined(){
			var expected="xUnit.js.Attributes.FactAttribute.ctor: unable to locate attribute target.";
			var targetBase=xUnit.js.Attributes.FactAttribute.prototype.base;
			xUnit.js.Attributes.FactAttribute.prototype.base=function(){
				delete this.Target;
			};

			var actual=Record.Exception(function(){
				new xUnit.js.Attributes.FactAttribute();
			});
			xUnit.js.Attributes.FactAttribute.prototype.base=targetBase;

			Assert.Equal(expected,actual);
		}

		[Fact]
		function ThrowsIfTargetIsNull(){
			var expected="xUnit.js.Attributes.FactAttribute.ctor: unable to locate attribute target.";
			var targetBase=xUnit.js.Attributes.FactAttribute.prototype.base;
			xUnit.js.Attributes.FactAttribute.prototype.base=function(){
				this.Target=null;
			};

			var actual=Record.Exception(function(){
				new xUnit.js.Attributes.FactAttribute();
			});
			xUnit.js.Attributes.FactAttribute.prototype.base=targetBase;

			Assert.Equal(expected,actual);
		}

		[Fact]
		function ThrowsIfTargetIsNotAFunction(){
			var expected="xUnit.js.Attributes.FactAttribute.ctor: unable to locate attribute target.";
			var targetBase=xUnit.js.Attributes.FactAttribute.prototype.base;
			xUnit.js.Attributes.FactAttribute.prototype.base=function(){
				this.Target={};
			};

			var actual=Record.Exception(function(){
				new xUnit.js.Attributes.FactAttribute();
			});
			xUnit.js.Attributes.FactAttribute.prototype.base=targetBase;

			Assert.Equal(expected,actual);
		}

		[Fact]
		function CallsRegisterFact(){
			var targetBase=xUnit.js.Attributes.FactAttribute.prototype.base;
			xUnit.js.Attributes.FactAttribute.prototype.base=function(){
				this.Target=function(){};
			};
			var targetRegisterFact=xUnit.js.Attributes.Engine.Instance.RegisterFact;
			xUnit.js.Attributes.Engine.Instance.RegisterFact=function(){
				actual=true;
			};

			new xUnit.js.Attributes.FactAttribute();
			xUnit.js.Attributes.Engine.Instance.RegisterFact=targetRegisterFact;
			xUnit.js.Attributes.FactAttribute.prototype.base=targetBase;

			Assert.True(actual);
		}

		[Fact]
		function PassesTargetToRegisterFact(){
			var expected=function(){};
			var targetBase=xUnit.js.Attributes.FactAttribute.prototype.base;
			xUnit.js.Attributes.FactAttribute.prototype.base=function(){
				this.Target=expected;
			};
			var targetRegisterFact=xUnit.js.Attributes.Engine.Instance.RegisterFact;
			xUnit.js.Attributes.Engine.Instance.RegisterFact=function(target){
				actual=target;
			};

			new xUnit.js.Attributes.FactAttribute();
			xUnit.js.Attributes.Engine.Instance.RegisterFact=targetRegisterFact;
			xUnit.js.Attributes.FactAttribute.prototype.base=targetBase;

			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function SetsFactOnFactAttribute(){
			var expected=function(){};
			var targetBase=xUnit.js.Attributes.FactAttribute.prototype.base;
			xUnit.js.Attributes.FactAttribute.prototype.base=function(){
				this.Target=expected;
			};
			var targetRegisterFact=xUnit.js.Attributes.Engine.Instance.RegisterFact;
			xUnit.js.Attributes.Engine.Instance.RegisterFact=function(){
				return expected;
			};

			var actual=new xUnit.js.Attributes.FactAttribute().Fact;
			xUnit.js.Attributes.Engine.Instance.RegisterFact=targetRegisterFact;
			xUnit.js.Attributes.FactAttribute.prototype.base=targetBase;

			Assert.Equal(expected,actual);
		}

		[Fact]
		function SetsGetModelMethodOnTargetDecoration(){
			var target=function(){};
			var targetBase=xUnit.js.Attributes.FactAttribute.prototype.base;
			xUnit.js.Attributes.FactAttribute.prototype.base=function(){
				this.Target=target;
			};
			var targetRegisterFact=xUnit.js.Attributes.Engine.Instance.RegisterFact;
			xUnit.js.Attributes.Engine.Instance.RegisterFact=function(){
				return "fact";
			};

			new xUnit.js.Attributes.FactAttribute()
			var actual=target.GetModel;
			xUnit.js.Attributes.Engine.Instance.RegisterFact=targetRegisterFact;
			xUnit.js.Attributes.FactAttribute.prototype.base=targetBase;

			Assert.Type(Function,actual);
		}		

		[Fact]
		function GetModelMethodOnTargetDecorationReturnsFact(){
			var expected="expected";
			var target=function(){};
			var targetBase=xUnit.js.Attributes.FactAttribute.prototype.base;
			xUnit.js.Attributes.FactAttribute.prototype.base=function(){
				this.Target=target;
			};
			var targetRegisterFact=xUnit.js.Attributes.Engine.Instance.RegisterFact;
			xUnit.js.Attributes.Engine.Instance.RegisterFact=function(){
				return expected;
			};

			new xUnit.js.Attributes.FactAttribute();
			var actual=target.GetModel();
			xUnit.js.Attributes.Engine.Instance.RegisterFact=targetRegisterFact;
			xUnit.js.Attributes.FactAttribute.prototype.base=targetBase;

			Assert.Equal(expected,actual);
		}		
	}
}
