Function.RegisterNamespace("Test.xUnit.js.Console");

[Fixture]
Test.xUnit.js.Console.Runner=function(){
	[Fixture]
	function Runner(){
		[Fact]
		function InstantiatesConsoleScriptLoader(){
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(){}
				}
			};
			var targetLoader=xUnit.js.Console.ScriptLoader;
			xUnit.js.Console.ScriptLoader=function(){
				actual=true;
			}
			var actual=false;

			new xUnit.js.Console.Runner();
			xUnit.js.Console.ScriptLoader=targetLoader;
			xUnit.js.Attributes.Engine.Instance=targetInstance;
					
			Assert.True(actual);
		}

		[Fact]
		function AddsAfterRunEventOnAttributeEngine(){
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			var targetCalls=0;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(type,handler){
						if(++targetCalls==1)actual=type;
					}
				}
			};
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			var actual=null;
			var expected="AfterRun";
			
			new xUnit.js.Console.Runner();
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			System.Environment=targetEnvironment;
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function AddsBeforeRunEventOnAttributeEngine(){
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			var targetCalls=0;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(type,handler){
						if(++targetCalls==2)actual=type;
					}
				}
			};
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();			
			var actual=null;
			var expected="BeforeRun";
			
			new xUnit.js.Console.Runner();
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			System.Environment=targetEnvironment;
			
			Assert.Equal(expected,actual);
		}
	}
	
	[Fixture]
	function Run(){
		[Fact]
		function CallsEnvironmentGetParameters(){
			var targetLoader=xUnit.js.Console.ScriptLoader;
			xUnit.js.Console.ScriptLoader=function(){
				this.GetScriptList=function(){return []};
				this.LoadScripts=function(){};
			}
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			System.Environment.GetParameters=function(){
				actual=true;
				return {named:{},unnamed:['']};
			}
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(){}
				},
				Run:function(){
				   // no-op
				}
			}
			var target=new xUnit.js.Console.Runner();
			var actual=false;
			
			target.Run();
			System.Environment=targetEnvironment;
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			xUnit.js.Console.ScriptLoader=targetLoader;
			
			Assert.True(actual);
		}
				
		[Fact]
		function CallsEnvironmentGetWorkingDirectory(){
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(){}
				},
				Run:function(){
					// no-op
				}				
			};
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			System.Environment.GetWorkingDirectory=function(){
				actual=true;
				return '';
			}
			var actual=false;
			var target=new xUnit.js.Console.Runner();

			target.Run();
			System.Environment=targetEnvironment;
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			
			Assert.True(actual);
		}

		[Fact]
		function CallsPathSetRoot(){
			var targetSetRoot=System.IO.Path.SetRoot;
			System.IO.Path.SetRoot=function(){
				actual=true;
			}
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(){}
				},
				Run:function(){
					// no-op
				}				
			};
			var actual=false;
			var target=new xUnit.js.Console.Runner();

			target.Run();
			System.Environment=targetEnvironment;
			System.IO.Path.SetRoot=targetSetRoot;
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			
			Assert.True(actual);
		}

		[Fact]
		function PassesWorkingDirectoryToPathSetRoot(){
			var targetSetRoot=System.IO.Path.SetRoot;
			System.IO.Path.SetRoot=function(path){
				actual=path;
			}
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			System.Environment.GetWorkingDirectory=function(){
				return expected;
			}
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(){}
				},
				Run:function(){
					// no-op
				}				
			};
			var actual=null;
			var expected="expected";
			var target=new xUnit.js.Console.Runner();

			target.Run();
			System.Environment=targetEnvironment;
			System.IO.Path.SetRoot=targetSetRoot;
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function CallsGetScriptList(){
			var targetLoader=xUnit.js.Console.ScriptLoader;
			xUnit.js.Console.ScriptLoader=function(){
				this.GetScriptList=function(){
					actual=true;
					return [];
				};
				this.LoadScripts=function(){};
			}
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(){}
				},
				Run:function(){
					// no-op
				}				
			};
			var actual=false;
			var target=new xUnit.js.Console.Runner();

			target.Run();
			System.Environment=targetEnvironment;
			xUnit.js.Console.ScriptLoader=targetLoader;
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			
			Assert.True(actual);
		}

		[Fact]
		function PassesUnnamedParametersToGetScriptList(){
			var targetLoader=xUnit.js.Console.ScriptLoader;
			xUnit.js.Console.ScriptLoader=function(){
				this.GetScriptList=function(scriptList){
					actual=scriptList;
					return [];
				};
				this.LoadScripts=function(){};
			}
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			System.Environment.GetParameters=function(){
				return {
					named:{},
					unnamed:expected
				}
			}
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(){}
				},
				Run:function(){
					// no-op
				}				
			};
			var actual=null;
			var expected=["expected"];
			var target=new xUnit.js.Console.Runner();

			target.Run();
			System.Environment=targetEnvironment;
			xUnit.js.Console.ScriptLoader=targetLoader;
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function PassesNamedExtensionsToGetScriptList(){
			var targetLoader=xUnit.js.Console.ScriptLoader;
			xUnit.js.Console.ScriptLoader=function(){
				this.GetScriptList=function(scriptList,extensions){
					actual=extensions;
					return [];
				};
				this.LoadScripts=function(){};
			}
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			System.Environment.GetParameters=function(){
				return {
					named:{extensions:expected},
					unnamed:['']
				}
			}
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(){}
				},
				Run:function(){
					// no-op
				}				
			};
			var actual=null;
			var expected="expected";
			var target=new xUnit.js.Console.Runner();

			target.Run();
			System.Environment=targetEnvironment;
			xUnit.js.Console.ScriptLoader=targetLoader;
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function CallsLoadScripts(){
			var targetLoader=xUnit.js.Console.ScriptLoader;
			xUnit.js.Console.ScriptLoader=function(){
				this.GetScriptList=function(){
					return [];
				};
				this.LoadScripts=function(){
					actual=true;
				};
			}
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(){}
				},
				Run:function(){
					// no-op
				}				
			};
			var actual=false;
			var target=new xUnit.js.Console.Runner();

			target.Run();
			System.Environment=targetEnvironment;
			xUnit.js.Console.ScriptLoader=targetLoader;
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			
			Assert.True(actual);
		}

		[Fact]
		function PassesResultOfGetScriptListToLoadScripts(){
			var targetLoader=xUnit.js.Console.ScriptLoader;
			xUnit.js.Console.ScriptLoader=function(){
				this.GetScriptList=function(){
					return expected;
				};
				this.LoadScripts=function(scriptList){
					actual=scriptList;
				};
			}
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			System.Environment.GetParameters=function(){
				return {
					named:{},
					unnamed:['']
				}
			}
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(){}
				},
				Run:function(){
					// no-op
				}				
			};
			var actual=null;
			var expected=[];
			var target=new xUnit.js.Console.Runner();

			target.Run();
			System.Environment=targetEnvironment;
			xUnit.js.Console.ScriptLoader=targetLoader;
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function CallsEnumerateOnAttributeEngineInstance(){
			var targetLoader=xUnit.js.Console.ScriptLoader;
			xUnit.js.Console.ScriptLoader=function(){
				this.GetScriptList=function(){
					return [];
				};
				this.LoadScripts=function(){};
			}
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			System.Environment.GetParameters=function(){
				return {named:{action:'enumerate'},unnamed:['']};
			};
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(){}
				},
				Enumerate:function(){
					actual=true;
					return [];
				}				
			};
			var actual=false;
			var target=new xUnit.js.Console.Runner();

			target.Run();
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			System.Environment=targetEnvironment;
			xUnit.js.Console.ScriptLoader=targetLoader;
			
			Assert.True(actual);
		}

		[Fact]
		function PassesTargetToEnumerateOnAttributeEngineInstance(){
			var targetLoader=xUnit.js.Console.ScriptLoader;
			xUnit.js.Console.ScriptLoader=function(){
				this.GetScriptList=function(){
					return [];
				};
				this.LoadScripts=function(){};
			}
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			System.Environment.GetParameters=function(){
				return {named:{action:'enumerate',target:expected},unnamed:['']};
			};
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(){}
				},
				Enumerate:function(target){
					actual=target;
					return [];
				}			 
			};
			var actual=null;
			var expected="expected";
			var target=new xUnit.js.Console.Runner();

			target.Run();
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			System.Environment=targetEnvironment;
			xUnit.js.Console.ScriptLoader=targetLoader;
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function CallsRunOnAttributeEngineInstance(){
			var targetLoader=xUnit.js.Console.ScriptLoader;
			xUnit.js.Console.ScriptLoader=function(){
				this.GetScriptList=function(){
					return [];
				};
				this.LoadScripts=function(){};
			}
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(){}
				},
				Run:function(){
					actual=true;
				}				
			};
			var actual=false;
			var target=new xUnit.js.Console.Runner();

			target.Run();
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			System.Environment=targetEnvironment;
			xUnit.js.Console.ScriptLoader=targetLoader;
			
			Assert.True(actual);
		}

		[Fact]
		function PassesTargetToRunOnAttributeEngineInstance(){
			var targetLoader=xUnit.js.Console.ScriptLoader;
			xUnit.js.Console.ScriptLoader=function(){
				this.GetScriptList=function(){
					return [];
				};
				this.LoadScripts=function(){};
			}
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			System.Environment.GetParameters=function(){
				return {named:{target:expected},unnamed:['']};
			};
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(){}
				},
				Run:function(runTarget){
					actual=runTarget;
				}
			};
			var actual=null;
			var expected="expected";
			var target=new xUnit.js.Console.Runner();

			target.Run();
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			System.Environment=targetEnvironment;
			xUnit.js.Console.ScriptLoader=targetLoader;
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function AfterRunHandlerCallsObjectIsType(){
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			var targetCalls=0;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(type,handler){
						if(++targetCalls==1){
							var targetIsType=Object.IsType;
							Object.IsType=function(){
								actual=true;
								return true;
							}
							handler({Component:{State:{Result:''}}});
							Object.IsType=targetIsType;
						}
					}
				},
				Run:function(){}
			};
			var actual=false;			
			
			new xUnit.js.Console.Runner();
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			System.Environment=targetEnvironment;
			
			Assert.True(actual);
		}

		[Fact]
		function AfterRunHandlerPassesFactConstructorToObjectIsType(){
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			var targetCalls=0;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(type,handler){
						if(++targetCalls==1){
							var targetIsType=Object.IsType;
							Object.IsType=function(type){
								actual=type;
								Object.IsType=targetIsType;
								return true;
							}
							handler({Component:{State:{Result:''}}});
						}
					}
				},
				Run:function(){}
			};
			var actual=null;
			var expected=xUnit.js.Model.Fact;
			
			new xUnit.js.Console.Runner();
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			System.Environment=targetEnvironment;
			
			Assert.Same(expected,actual);
		}

		[Fact]
		function AfterRunHandlerPassesContextComponentToObjectIsType(){
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			var targetCalls=0;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(type,handler){
						if(++targetCalls==1){
							var targetIsType=Object.IsType;
							Object.IsType=function(type,component){
								actual=component;
								Object.IsType=targetIsType;							
								return true;
							}
							handler({Component:expected});
						}
					}
				},
				Run:function(){}
			};
			var actual=null;
			var expected={State:{Result:''}};
			
			new xUnit.js.Console.Runner();
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			System.Environment=targetEnvironment;
			
			Assert.Same(expected,actual);
		}
		 
		[Fact]
		function CallsUsageIfNoUnnamedParametersArePasssed(){
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(){}
				}
			};
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			System.Environment.GetParameters=function(){return {named:{},unnamed:[]}};
			System.Environment.Write=function(message){
				actual=message;
			}
			var actual=null;
			var expected=[
				"",
				"xUnit.js Console Runner v0.8.3.8",
				"",
				"Usage:",
				"<environment> xUnit.js.Console.js [/action:<action>] [/extensions:<extensions>] [/dependency:<dependency>] [/output:<output>] [/target:<name>] [/-target:<name>] [/trait:<name>] [/-trait:<name>] <path>[ <path>...] ",
				"",
				"<environment> The environment in which the tests are to be run.",
				"",
				"              Supported environments include:",
				"",
				"                - Microsoft Script Engine (cscript.exe, Windows only)",
				"                - Google's V8 developer console (D8 executable)",
				"                - Mozilla's SpiderMonkey console (js executable)",
				"                - Mozilla's Rhino console (js.jar)",
				"",
				"<action>      The action to perform. Optional. Valid actions are ",
				"              [Enumerate|RunTests]. If omitted, defaults to 'RunTests'.",
				"",
				"<target>      The name of a fact, fixture, or partial namespace to run. ",
				"              Optional. If omitted, runs all facts and fixtures found and ",
				"              registered at <path>.",
				"",
				"<trait>       The name, or comma separated list of names, of traits to run. ",
				"              Optional. If omitted, runs all facts and fixtures found and ",
				"              registered at <path>. If specified, runs only targets designated ",
				"              with the matching trait attribute, e.g. '[Trait(\"trait\")]'.",
				"",
				"<-trait>      The name, or comma separated list of names, of traits to skip. ",
				"              Optional. If omitted, runs all facts and fixtures found and ",
				"              registered at <path>. If specified, runs only targets not ",
				"              designated with a matching trait attribute.",
				"",
				"<extensions>  A comma separated list of file extensions to include while ",
				"              searching <path> for files to load. If omitted, defaults to '.js'.",
				"",
				"<output>      The desired output type. Optional. Valid outputs are ",
				"              [Text|Xml|Json]. If omitted, defaults to 'Text'.",
				"",
				"<dependency>  The path to a script file or directory containing dependencies to ",
				"              load before beginning the test run. These filse will load before ",
				"              any of the files in <path>, and before any output is written.",
				"",
				"<path>        The path to a script file or directory containing files to load",
				"              and parse for tests. Additional paths may be separated by a space.",
				"",
				"",
				"Examples:",
				"",
				"  cscript xUnit.js.Console.js /action:Enumerate xUnit.js/Tests",
				"",
				"  d8 - xUnit.js.Console.js -- /target:Test.xUnit.js.Console xUnit.js/Tests",
				"",
				"  js xUnit.js.Console.js xUnit.js/Tests/xUnit.js.Console/Runner.js",
				"",
				"  java -jar js.jar xUnit.js.Console.js /output:Xml xUnit.js/Tests",
				"",
				""
			].join('\n');
			var target=new xUnit.js.Console.Runner();

			target.Run();
			System.Environment=targetEnvironment;
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function CallsEnvironmentExitOnComplete(){
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			System.Environment.Exit=function(){
				actual=true;
			}
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			var targetCalls=0;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(){}
				},
				Run:function(){}
			};
			var actual=false;

			new xUnit.js.Console.Runner().Run();
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			System.Environment=targetEnvironment;
			
			Assert.True(actual);
		}

		[Fact]
		function PassesErrorCodeToEnvironmentExitOnCompleteForFailedFact(){
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			System.Environment.Exit=function(errorCode){
				actual=errorCode;
			}
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			var targetCalls=0;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(type,handler){
						if(++targetCalls==1){
							var targetFact=new xUnit.js.Model.Fact(function(){});
							targetFact.State={Result:xUnit.js.Model.Result.Failure};
							handler({Component:targetFact});
						}
					}
				},
				Run:function(){}
			};
			var actual=null;
			var expected=0xFAE1;

			new xUnit.js.Console.Runner().Run();
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			System.Environment=targetEnvironment;
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function PassesErrorCodeToEnvironmentExitOnCompleteForErroredFact(){
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			System.Environment.Exit=function(errorCode){
				actual=errorCode;
			}
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			var targetCalls=0;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(type,handler){
						if(++targetCalls==1){
							var targetFact=new xUnit.js.Model.Fact(function(){});
							targetFact.State={Result:xUnit.js.Model.Result.Error};
							handler({Component:targetFact});
						}
					}
				},
				Run:function(){}
			};
			var actual=null;
			var expected=0xBAD;

			new xUnit.js.Console.Runner().Run();
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			System.Environment=targetEnvironment;
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function PassesErrorCodeToEnvironmentExitOnCompleteForSuccessFact(){
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			System.Environment.Exit=function(errorCode){
				actual=errorCode;
			}
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			var targetCalls=0;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(type,handler){
						if(++targetCalls==1){
							var targetFact=new xUnit.js.Model.Fact(function(){});
							targetFact.State={Result:xUnit.js.Model.Result.Success};
							handler({Component:targetFact});
						}
					}
				},
				Run:function(){}
			};
			var actual=null;
			var expected=0;

			new xUnit.js.Console.Runner().Run();
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			System.Environment=targetEnvironment;
			
			Assert.Same(expected,actual);
		}

		[Fact]
		function PassesErrorCodeToEnvironmentExitOnCompleteForSkippedFact(){
			var targetEnvironment=System.Environment;
			System.Environment=new StubEnvironment();
			System.Environment.Exit=function(errorCode){
				actual=errorCode;
			}
			var targetInstance=xUnit.js.Attributes.Engine.Instance;
			var targetCalls=0;
			xUnit.js.Attributes.Engine.Instance={
				Events:{
					Add:function(type,handler){
						if(++targetCalls==1){
							var targetFact=new xUnit.js.Model.Fact(function(){});
							targetFact.State={Result:xUnit.js.Model.Result.Skipped};
							handler({Component:targetFact});
						}
					}
				},
				Run:function(){}
			};
			var actual=null;
			var expected=0;

			new xUnit.js.Console.Runner().Run();
			xUnit.js.Attributes.Engine.Instance=targetInstance;
			System.Environment=targetEnvironment;
			
			Assert.Same(expected,actual);
		}
	}
 
	// Stubs
	function StubEnvironment(){
		this.Exit=function(errorCode){};
		this.GetParameters=function(){return {named:{},unnamed:['']}};
		this.GetWorkingDirectory=function(){return ''};
		this.Write=function(message1,message2,messageN){};
		this.WriteError=function(message1,message2,messageN){};
	}
}