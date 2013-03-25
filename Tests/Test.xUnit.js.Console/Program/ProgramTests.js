Function.RegisterNamespace("Test.xUnit.js.Console");

[Fixture]
Test.xUnit.js.Console.Program=function(){
	[Fixture]
	function Program(){
		[Fact]
		function InstantiatesNewConsoleRunner(){
			var targetRunner=xUnit.js.Console.Runner;
			xUnit.js.Console.Runner=function(){
				actual=true;
				this.Run=function(){};
			}
			var actual=false;
			
			new xUnit.js.Console.Program();
			xUnit.js.Console.Runner=targetRunner;
			
			Assert.True(actual);
		}

		[Fact]
		function SetsProgramApplicationToNewRunner(){
			var targetRunner=xUnit.js.Console.Runner;
			xUnit.js.Console.Runner=function(){
				expected=this;
				this.Run=function(){};
			}
			var actual=null;
			var expected=null;
			
			var actual=new xUnit.js.Console.Program().Application;
			xUnit.js.Console.Runner=targetRunner;
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function CallsRunOnApplicationRunner(){
			var targetRunner=xUnit.js.Console.Runner;
			xUnit.js.Console.Runner=function(){
				this.Run=function(){
					actual=true;				
				};
			}
			var actual=false;
			
			try{
				new xUnit.js.Console.Program();
			}catch(e){
				throw e;
			}finally{
				xUnit.js.Console.Runner=targetRunner;
			}

			Assert.True(actual);
		}
		
		[Fact]
		function ThrowsErrorIfRunnerConstructorThrows(){
			var targetRunner=xUnit.js.Console.Runner;
			xUnit.js.Console.Runner=function(){
				throw new Error();
			}

			var actual=Record.Exception(function(){
				new xUnit.js.Console.Program();			
			});
			xUnit.js.Console.Runner=targetRunner;
			
			Assert.NotNull(actual);
		}

		[Fact]
		function RethrowsErrorFromRunnerConstructor(){
			var expected=new Error("expected");
			var targetRunner=xUnit.js.Console.Runner;
			xUnit.js.Console.Runner=function(){
				throw expected;
			}

			var actual=Record.Exception(function(){
				new xUnit.js.Console.Program();			
			});
			xUnit.js.Console.Runner=targetRunner;
			
			Assert.Equal(expected,actual);
		}
	}
}