Function.RegisterNamespace("Test.xUnit.js");

[Fixture]
Test.xUnit.js.Engine=function(){
	[Fixture]
	function Engine(){
		[Fact]
		function InitializesEventManager(){
			var target=null;
			
			target=new xUnit.js.Engine();
			
			Assert.NotNull(target.Events);
		}
		
		[Fact]
		function ExposesAfterRunEvent(){
			var target=new xUnit.js.Engine();
			
			var actual=Record.Exception(function(){
				target.Events.Add("AfterRun",function(){});
			});
			
			Assert.Null(actual);
		}

		[Fact]
		function ExposesBeforeRunEvent(){
			var target=new xUnit.js.Engine();
			
			var actual=Record.Exception(function(){
				target.Events.Add("BeforeRun",function(){});
			});
			
			Assert.Null(actual);
		}
	}
	
	[Fixture]
	function Enumerate(){
		[Fact]
		function ReturnsArray(){
			var target=new xUnit.js.Engine();
			
			var actual=target.Enumerate();
			
			Assert.True(Object.IsType(Array,actual));		
		}
		
		[Fact]
		function ReturnsArrayOfFacts(){
			var target=new xUnit.js.Engine();
			var expected=[
				new xUnit.js.Model.Fact(function(){}),
				new xUnit.js.Model.Fact(function(){})
			];
			target.RegisterFact(expected[0]);
			target.RegisterFact(expected[1]);
			
			var actual=target.Enumerate();
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function ReturnsFactsFromNestedFixture(){
			var target=new xUnit.js.Engine();
			var targetFixture=new xUnit.js.Model.Fixture();
			var expected=[
				new xUnit.js.Model.Fact(function(){}),
				new xUnit.js.Model.Fact(function(){})
			];
			target.RegisterFixture(targetFixture);
			targetFixture.RegisterFact(expected[0]);
			targetFixture.RegisterFact(expected[1]);
			
			var actual=target.Enumerate();
			
			Assert.Equal(expected,actual);
		}
	}
	
	[Fixture]
	function Get(){
		[Fact]
		function ReturnsRootFixtureIfPathIsOmitted(){
			var expected=[new xUnit.js.Model.Fact(function(){})];
			var target=new xUnit.js.Engine();
			target.RegisterFact(expected[0]);

			var actual=target.Get().GetFacts();
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function ReturnsRootFixtureIfPathIsUndefined(){
			var expected=[new xUnit.js.Model.Fact(function(){})];
			var target=new xUnit.js.Engine();
			target.RegisterFact(expected[0]);

			var actual=target.Get(undefined).GetFacts();
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function ReturnsRootFixtureIfPathIsNull(){
			var expected=[new xUnit.js.Model.Fact(function(){})];
			var target=new xUnit.js.Engine();
			target.RegisterFact(expected[0]);

			var actual=target.Get(null).GetFacts();
			
			Assert.Equal(expected,actual);
		}		
		
		[Fact]
		function ThrowsIfPathIsNotConvertibleToString(){
			var expected="xUnit.js.Engine.Get: 'path' must be convertible to String.";		
			var target=new xUnit.js.Engine();

			var actual=Record.Exception(function(){
				target.Get({toString:null});
			});

			Assert.Equal(expected,actual);		
		}
		
		[Fact]
		function CallsPathToStringMethod(){
			var target={toString:function(){
				actual=true;
				return '';
			}};
			var actual=false;
			
			new xUnit.js.Engine().Get(target);
			
			Assert.True(actual);
		}
		
		[Fact]
		function ThrowsIfUnableToResolveTarget(){
			var expected="xUnit.js.Engine.resolveTargets: 'path' 'targetPath' does not resolve to any registered targets.";
			
			var actual=Record.Exception(function(){
				new xUnit.js.Engine().Get("targetPath");
			});
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function ThrowsIfGetFixturesMethodHasBeenTamperedWith(){
			var target=new xUnit.js.Engine();
			var targetName="target";
			var targetFixture=new xUnit.js.Model.Fixture(targetName);
			targetFixture.GetFixtures=2; // Chosen by fair dice roll. Guaranteed to be random.
			target.RegisterFixture(targetFixture);
			
			var actual=Record.Exception(function(){
				target.Get([targetName,targetName].join('.'));
			});
			
			Assert.NotNull(actual);
		}
		
		[Fact]
		function CallsGetFixturesMethodOnNestedFixture(){
			var target=new xUnit.js.Engine();
			var targetName="targetName";
			var targetFixture=new xUnit.js.Model.Fixture(targetName);
			targetFixture.RegisterFixture(new xUnit.js.Model.Fixture(targetName));
			var targetGetFixtures=targetFixture.GetFixtures;
			target.RegisterFixture(targetFixture);
			targetFixture.GetFixtures=function(){
				actual=true;
				return targetGetFixtures();
			}
			var actual=false;
			
			target.Get([targetName,targetName].join('.'));
			
			Assert.True(actual);
		}

		[Fact]
		function CallsGetFactsMethodOnRoot(){
			var target=new xUnit.js.Engine();
			var targetName="targetName";
			var targetRoot=target.Get();
			var targetGetFacts=targetRoot.GetFacts;
			target.RegisterFact(new xUnit.js.Model.Fact(function(){},targetName));
			targetRoot.GetFacts=function(){
				actual=true;
				return targetGetFacts();
			}
			var actual=false;

			target.Get(targetName);
			
			Assert.True(actual);
		}

		[Fact]
		function CallsGetFactsMethodOnNestedFixture(){
			var target=new xUnit.js.Engine();
			var targetName="targetName";
			var targetFixture=new xUnit.js.Model.Fixture(targetName);
			targetFixture.RegisterFact(new xUnit.js.Model.Fact(function(){},targetName));
			var targetGetFacts=targetFixture.GetFacts;
			target.RegisterFixture(targetFixture);
			targetFixture.GetFacts=function(){
				actual=true;
				return targetGetFacts();
			}
			var actual=false;
			
			target.Get([targetName,targetName].join('.'));
			
			Assert.True(actual);
		}		
	}	
	
	[Fixture]
	function RegisterFixture(){
		[Fact]
		function ThrowsIfFixtureIsOmitted(){
			var target=new xUnit.js.Engine();
			var expected="xUnit.js.Engine.RegisterFixture: 'fixture' must be an instance of 'xUnit.js.Model.Fixture'.";
			
			var actual=Record.Exception(function(){
				target.RegisterFixture();
			});

			Assert.Equal(expected,actual);
		}

		[Fact]
		function ThrowsIfFixtureIsUndefined(){
			var target=new xUnit.js.Engine();
			var expected="xUnit.js.Engine.RegisterFixture: 'fixture' must be an instance of 'xUnit.js.Model.Fixture'.";
			
			var actual=Record.Exception(function(){
				target.RegisterFixture(undefined);
			});

			Assert.Equal(expected,actual);
		}

		[Fact]
		function ThrowsIfFixtureIsNull(){
			var target=new xUnit.js.Engine();
			var expected="xUnit.js.Engine.RegisterFixture: 'fixture' must be an instance of 'xUnit.js.Model.Fixture'.";
			
			var actual=Record.Exception(function(){
				target.RegisterFixture(null);
			});

			Assert.Equal(expected,actual);
		}

		[Fact]
		function ThrowsIfFixtureIsInvalid(){
			var target=new xUnit.js.Engine();
			var expected="xUnit.js.Engine.RegisterFixture: 'fixture' must be an instance of 'xUnit.js.Model.Fixture'.";
			
			var actual=Record.Exception(function(){
				target.RegisterFixture(new Object());
			});
			
			Assert.NotNull(actual);
			Assert.Equal(expected,actual.toString());
		}

		[Fact]
		function RegistersFixtureOnRootFixture(){
			var target=new xUnit.js.Engine();
			var targetName="targetName";
			var expected=new xUnit.js.Model.Fixture(targetName);
			target.RegisterFixture(expected);

			var actual=target.Get().GetFixtures()[0];
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function RegistersFixtureOnNestedFixture(){
			var target=new xUnit.js.Engine();
			var targetName="targetName";
			var targetFixture=new xUnit.js.Model.Fixture(targetName);
			var expected=new xUnit.js.Model.Fixture();
			target.RegisterFixture(targetFixture);
			targetFixture.RegisterFixture(expected);

			var actual=target.Get(targetName).GetFixtures()[0];
			
			Assert.Equal(expected,actual);
		}
	}

	[Fixture]
	function RegisterFact(){
		[Fact]
		function ThrowsIfFactIsOmitted(){
			var target=new xUnit.js.Engine();
			var expected="xUnit.js.Engine.RegisterFact: 'fact' must be an instance of 'xUnit.js.Model.Fact'.";
			
			var actual=Record.Exception(function(){
				target.RegisterFact();
			});
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function ThrowsIfFactIsUndefined(){
			var target=new xUnit.js.Engine();
			var expected="xUnit.js.Engine.RegisterFact: 'fact' must be an instance of 'xUnit.js.Model.Fact'.";
			
			var actual=Record.Exception(function(){
				target.RegisterFact(undefined);
			});
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function ThrowsIfFactIsNull(){
			var target=new xUnit.js.Engine();
			var expected="xUnit.js.Engine.RegisterFact: 'fact' must be an instance of 'xUnit.js.Model.Fact'.";
			
			var actual=Record.Exception(function(){
				target.RegisterFact(null);
			});
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function ThrowsIfFixtureInvalid(){
			var target=new xUnit.js.Engine();
			var expected="xUnit.js.Engine.RegisterFact: 'fact' must be an instance of 'xUnit.js.Model.Fact'.";
			
			var actual=Record.Exception(function(){
				target.RegisterFact(new Object())
			});
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function AddsAfterRunEvent(){
			var target=new xUnit.js.Engine();
			var fact=new xUnit.js.Model.Fact(function(){});

			target.RegisterFact(fact);
			var actual=fact.Events.Get("AfterRun");
			
			Assert.True(actual.length>=1,"No events registered.");
		}

		[Fact]
		function FiresAfterRunEvent(){
			var target=new xUnit.js.Engine();
			var expected=new xUnit.js.Model.Fact(function(){});
			var actual=null;
			target.RegisterFact(expected);
			target.Events.Add("AfterRun",function(context){
				if(Object.IsType(xUnit.js.Model.Fact,context.Component)){
					actual=context.Component;
				}
			});
			
			target.Run();
			
			Assert.Equal(expected,actual);			
		}

		[Fact]
		function AddsBeforeRunEvent(){
			var target=new xUnit.js.Engine();
			var fact=new xUnit.js.Model.Fact(function(){});

			target.RegisterFact(fact);
			var actual=fact.Events.Get("BeforeRun");
			
			Assert.True(actual.length>=1,"No events registered.");
		}

		[Fact]
		function FiresBeforeRunEvent(){
			var target=new xUnit.js.Engine();
			var expected=new xUnit.js.Model.Fact(function(){});
			var actual=null;
			target.RegisterFact(expected);
			target.Events.Add("BeforeRun",function(context){
				actual=context.Component;
			});
			
			target.Run();
			
			Assert.Equal(expected,actual);			
		}

		[Fact]
		function RegistersFixtureOnRootFixture(){
			var target=new xUnit.js.Engine();
			var expected=[new xUnit.js.Model.Fixture()];
			
			target.RegisterFixture(expected[0]);
			var actual=target.Get().GetFixtures();
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function RegistersFactOnRootFixture(){
			var target=new xUnit.js.Engine();
			var expected=[new xUnit.js.Model.Fact(function(){})];
			
			target.RegisterFact(expected[0]);
			var actual=target.Enumerate();
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function RegistersFactOnNestedFixture(){
			var target=new xUnit.js.Engine();
			var targetFixture=new xUnit.js.Model.Fixture();
			var expected=[new xUnit.js.Model.Fact(function(){})];
			target.RegisterFixture(targetFixture);

			targetFixture.RegisterFact(expected[0]);
			var actual=target.Enumerate();
			
			Assert.Equal(expected,actual);
		}
	}
	
	[Fixture]
	function Run(){
		[Fact]
		function RunsAllFacts(){
			var expected=2;
			var actual=0;
			var target=new xUnit.js.Engine();
			var targetMethod=function(){
				actual++;
			}
			target.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			target.RegisterFixture(new xUnit.js.Model.Fixture());
			var nestedFact=new xUnit.js.Model.Fact(targetMethod);
			target.RegisterFact(nestedFact);
			
			target.Run();
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function RunsTargetedFixture(){
			var expected=1;
			var actual=0;
			var target=new xUnit.js.Engine();
			var targetMethod=function targetMethod(){
				actual++;
			}
			target.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			var targetFixture=new xUnit.js.Model.Fixture();
			target.RegisterFixture(targetFixture);
			var nestedFact=new xUnit.js.Model.Fact(targetMethod);
			targetFixture.RegisterFact(nestedFact);
			
			target.Run(Function.GetName(targetMethod));
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function RunsNestedTargetedFixture(){
			var expected=1;
			var actual=0;
			var target=new xUnit.js.Engine();
			var targetMethod=function targetMethod(){
				actual++;
			}
			target.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			var targetFixture=new xUnit.js.Model.Fixture("target1");
			targetFixture.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			var targetNestedFixture=new xUnit.js.Model.Fixture("target2");
			targetNestedFixture.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			targetFixture.RegisterFixture(targetNestedFixture);
			target.RegisterFixture(targetFixture);
			
			target.Run(String.Format("{0}.{1}",targetFixture.Name,targetNestedFixture.Name));
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function RunsPartialTargetedFixture(){
			var expected=2;
			var actual=0;
			var target=new xUnit.js.Engine();
			var targetMethod=function targetMethod(){
				actual++;
			}
			target.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			var targetFixture=new xUnit.js.Model.Fixture("targetRoot.target1");
			targetFixture.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			var targetNestedFixture=new xUnit.js.Model.Fixture("target2");
			targetNestedFixture.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			targetFixture.RegisterFixture(targetNestedFixture);
			target.RegisterFixture(targetFixture);
			
			target.Run("targetRoot");
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function RunsPartialNamespacedTargetedFixture(){
			var expected=2;
			var actual=0;
			var target=new xUnit.js.Engine();
			var targetMethod=function targetMethod(){
				actual++;
			}
			target.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			target.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			var targetFixture=new xUnit.js.Model.Fixture("targetRoot.targetNamespace.target1");
			targetFixture.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			var targetNestedFixture=new xUnit.js.Model.Fixture("target2");
			targetNestedFixture.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			targetFixture.RegisterFixture(targetNestedFixture);
			target.RegisterFixture(targetFixture);
			
			target.Run("targetRoot.targetNamespace");
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function RunsPartialNestedNamespacedTargetedFixture(){
			var expected=1;
			var actual=0;
			var target=new xUnit.js.Engine();
			var targetMethod=function targetMethod(){
				actual++;
			}
			target.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			var targetFixture=new xUnit.js.Model.Fixture("targetRoot.targetNamespace.target1");
			targetFixture.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			var targetNestedFixture=new xUnit.js.Model.Fixture("targetNamespace2.target2");
			targetNestedFixture.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			targetFixture.RegisterFixture(targetNestedFixture);
			target.RegisterFixture(targetFixture);
			
			target.Run("targetRoot.targetNamespace.target1.targetNamespace2");
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function RunsTargetedFact(){
			var expected=1;
			var actual=0;
			var target=new xUnit.js.Engine();
			var targetMethod=function targetMethod(){
				actual++;
			}
			target.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			var targetFixture=new xUnit.js.Model.Fixture("target1");
			targetFixture.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			target.RegisterFixture(targetFixture);
			
			target.Run(String.Format("{0}.{1}",targetFixture.Name,Function.GetName(targetMethod)));
			
			Assert.Equal(expected,actual);
		}		

		[Fact]
		function RunsNestedTargetedFact(){
			var expected=1;
			var actual=0;
			var target=new xUnit.js.Engine();
			var targetMethod=function targetMethod(){
				actual++;
			}
			target.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			var targetFixture=new xUnit.js.Model.Fixture("target1");
			targetFixture.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			var targetNestedFixture=new xUnit.js.Model.Fixture("target2");
			targetNestedFixture.RegisterFact(new xUnit.js.Model.Fact(targetMethod));
			targetFixture.RegisterFixture(targetNestedFixture);
			target.RegisterFixture(targetFixture);
			
			target.Run(String.Format("{0}.{1}.{2}",targetFixture.Name,targetNestedFixture.Name,Function.GetName(targetMethod)));
			
			Assert.Equal(expected,actual);
		}		
	}
}