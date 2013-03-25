Function.RegisterNamespace("Test.xUnit.js.Attributes");

[Fixture]
Test.xUnit.js.Attributes.SkipAttribute=function(){
	[Fixture]
	function SkipAttribute(){
		[Fact]
		function CallsBaseOnAttribute(){
			var targetBase=xUnit.js.Attributes.SkipAttribute.prototype.base;
			xUnit.js.Attributes.SkipAttribute.prototype.base=function(){
				actual=true;
			}
			var targetIsType=Object.IsType;
			Object.IsType=function(){
				return true;
			}
			xUnit.js.Attributes.SkipAttribute.prototype.Target=function(){};
			var targetSkip=xUnit.js.Attributes.Engine.Instance.Skip;
			xUnit.js.Attributes.Engine.Instance.Skip=function(){};
			var actual=false;

			new xUnit.js.Attributes.SkipAttribute();
			delete xUnit.js.Attributes.SkipAttribute.prototype.Target;
			xUnit.js.Attributes.SkipAttribute.prototype.base=targetBase;
			xUnit.js.Attributes.Engine.Instance.Skip=targetSkip;
			Object.IsType=targetIsType;
			
			Assert.True(actual);
		}
		
		[Fact]
		function ThrowsIfTargetIsNotAValidFunction(){
			var expected="xUnit.js.Attributes.SkipAttribute.ctor: unable to locate attribute target.";
			
			var actual=Record.Exception(function(){
				new xUnit.js.Attributes.SkipAttribute();
			});
			
			Assert.Equal(expected,actual);		
		}

		[Fact]
		function DoesNotThrowIfTargetIsAValidFunction(){
			var expected="xUnit.js.Attributes.SkipAttribute.ctor: unable to locate attribute target.";
			
			var actual=Record.Exception(function(){
				new System.Script.Attributes.DecoratedFunction(function(){},'',xUnit.js.Attributes.SkipAttribute);
			});
			
			Assert.Null(actual);
		}
		
		[Fact]
		function SetsReasonOnAttribute(){
			var expected="expected";			
			var target=new System.Script.Attributes.DecoratedFunction(function(){},'',xUnit.js.Attributes.SkipAttribute(expected));
		
			var actual=target.GetDecoration().GetAttributes()[0].Reason;
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function CallsSkipOnAttributeEngineInstance(){
			var targetSkip=xUnit.js.Attributes.Engine.Instance.Skip;
			xUnit.js.Attributes.Engine.Instance.Skip=function(){
				actual=true;
			}
			var actual=false;
			
			new System.Script.Attributes.DecoratedFunction(function(){},'',xUnit.js.Attributes.SkipAttribute());
			xUnit.js.Attributes.Engine.Instance.Skip=targetSkip;
			
			Assert.True(actual);
		}
		
		[Fact]
		function PassesTargetToEngineSkip(){
			var targetSkip=xUnit.js.Attributes.Engine.Instance.Skip;
			xUnit.js.Attributes.Engine.Instance.Skip=function(target){
				actual=target;
			}
			var actual=null;
			
			var expected=new System.Script.Attributes.DecoratedFunction(function(){},'',xUnit.js.Attributes.SkipAttribute());
			xUnit.js.Attributes.Engine.Instance.Skip=targetSkip;
			
			Assert.Equal(expected,actual);		
		}

		[Fact]
		function PassesReasonToEngineSkip(){
			var targetSkip=xUnit.js.Attributes.Engine.Instance.Skip;
			xUnit.js.Attributes.Engine.Instance.Skip=function(target,reason){
				actual=reason;
			}
			var actual=null;
			var expected="expected";
			
			new System.Script.Attributes.DecoratedFunction(function(){},'',xUnit.js.Attributes.SkipAttribute(expected));
			xUnit.js.Attributes.Engine.Instance.Skip=targetSkip;
			
			Assert.Equal(expected,actual);		
		}
		
		[Fact]
		function CallsSystemDelayedConstructor(){
			var targetDelayed=System.Script.DelayedConstructor;
			System.Script.DelayedConstructor=function(){
				actual=true;
			}
			var actual=false;
			
			new System.Script.Attributes.DecoratedFunction(function(){},'',xUnit.js.Attributes.SkipAttribute());
			System.Script.DelayedConstructor=targetDelayed;
			
			Assert.True(actual);
		}
		
		[Fact]
		function ReturnsDelayedConstructor(){
			var targetDelayed=System.Script.DelayedConstructor;
			System.Script.DelayedConstructor=function(){
				return expected;
			}
			var actual=null;
			var expected="expected";
			
			var actual=new System.Script.Attributes.DecoratedFunction(function(){},'',xUnit.js.Attributes.SkipAttribute()).GetDecoration().GetAttributes()[0];
			System.Script.DelayedConstructor=targetDelayed;
			
			Assert.Equal(expected,actual);		
		}
		
		[Fact]
		function PassesScopeToDelayedConstructorForNewObject(){
			var targetDelayed=System.Script.DelayedConstructor;
			System.Script.DelayedConstructor=function(scope){
				actual=scope;
			}
			var actual=null;

			var expected=new System.Script.Attributes.DecoratedFunction(function(){},'',new xUnit.js.Attributes.SkipAttribute()).GetDecoration().GetAttributes()[0];
			System.Script.DelayedConstructor=targetDelayed;
			
			Assert.Equal(expected,actual);		
		}
		
		[Fact]
		function PassesConstructorToDelayedConstructorForNewObject(){
			var targetDelayed=System.Script.DelayedConstructor;
			System.Script.DelayedConstructor=function(scope,callee){
				actual=callee;
			}
			var actual=null;
			var expected=xUnit.js.Attributes.SkipAttribute;
			
			new System.Script.Attributes.DecoratedFunction(function(){},'',new xUnit.js.Attributes.SkipAttribute());
			System.Script.DelayedConstructor=targetDelayed;
			
			Assert.Equal(expected,actual);		
		}

		[Fact]
		function PassesInternalConstructorToDelayedConstructorForNewObject(){
			var targetDelayed=System.Script.DelayedConstructor;
			System.Script.DelayedConstructor=function(scope,callee,callback){
				actual=callback;
			}
			var actual=null;
			
			new System.Script.Attributes.DecoratedFunction(function(){},'',new xUnit.js.Attributes.SkipAttribute());
			System.Script.DelayedConstructor=targetDelayed;
			
			Assert.Type(Function,actual);		
		}


		[Fact]
		function PassesArgumentsToDelayedConstructorForNewObject(){
			var targetDelayed=System.Script.DelayedConstructor;
			System.Script.DelayedConstructor=function(scope,callee,callback,args){
				actual=Array.prototype.slice.call(args,0);
			}
			var actual=null;
			var expected=["expected1","expected2","expected3"];
			
			new System.Script.Attributes.DecoratedFunction(function(){},'',new xUnit.js.Attributes.SkipAttribute(expected[0],expected[1],expected[2]));
			System.Script.DelayedConstructor=targetDelayed;
			
			Assert.Equal(expected,actual);		
		}

		[Fact]
		function PassesAttributeNamespaceToDelayedConstructorForDelayedConstruction(){
			var targetDelayed=System.Script.DelayedConstructor;
			System.Script.DelayedConstructor=function(scope){
				actual=scope;
			}
			var actual=null;
			var expected=xUnit.js.Attributes;
			
			new System.Script.Attributes.DecoratedFunction(function(){},'',xUnit.js.Attributes.SkipAttribute("delayed")).GetDecoration().GetAttributes()[0];
			System.Script.DelayedConstructor=targetDelayed;
			
			Assert.Equal(expected,actual);		
		}

		[Fact]
		function PassesConstructorToDelayedConstructorForDelayedConstruction(){
			var targetDelayed=System.Script.DelayedConstructor;
			System.Script.DelayedConstructor=function(scope,callee){
				actual=callee;
			}
			var actual=null;
			var expected=xUnit.js.Attributes.SkipAttribute;
			
			new System.Script.Attributes.DecoratedFunction(function(){},'',xUnit.js.Attributes.SkipAttribute("delayed"));
			System.Script.DelayedConstructor=targetDelayed;
			
			Assert.Equal(expected,actual);		
		}

		[Fact]
		function PassesInternalConstructorToDelayedConstructorForDelayedConstruction(){
			var targetDelayed=System.Script.DelayedConstructor;
			System.Script.DelayedConstructor=function(scope,callee,callback){
				actual=callback;
			}
			var actual=null;
			
			new System.Script.Attributes.DecoratedFunction(function(){},'',xUnit.js.Attributes.SkipAttribute("delayed"));
			System.Script.DelayedConstructor=targetDelayed;
			
			Assert.Type(Function,actual);		
		}


		[Fact]
		function PassesArgumentsToDelayedConstructorForDelayedConstruction(){
			var targetDelayed=System.Script.DelayedConstructor;
			System.Script.DelayedConstructor=function(scope,callee,callback,args){
				actual=Array.prototype.slice.call(args,0);
			}
			var actual=null;
			var expected=["expected1","expected2","expected3"];
			
			new System.Script.Attributes.DecoratedFunction(function(){},'',xUnit.js.Attributes.SkipAttribute(expected[0],expected[1],expected[2]));
			System.Script.DelayedConstructor=targetDelayed;
			
			Assert.Equal(expected,actual);		
		}
	}
}
