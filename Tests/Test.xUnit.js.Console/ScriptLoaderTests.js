Function.RegisterNamespace("Test.xUnit.js.Console");

[Fixture]
Test.xUnit.js.Console.ScriptLoader=function(){
	[Fixture]
	function ScriptLoader(){
		[Fact]
		function InstantiatesAttributeParser(){
			var targetAttributeParser=System.Script.Attributes.AttributeParser;
			System.Script.Attributes.AttributeParser=function(){
				actual=true;
			}
			var actual=false;
		
			new xUnit.js.Console.ScriptLoader().GetScriptList([]);
			System.Script.Attributes.AttributeParser=targetAttributeParser;
			
			Assert.True(actual);
		}
	}
	
	[Fixture]
	function GetScriptList(){
		[Fact]
		function CallsObjectIsTypeForScriptList(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=1)return targetIsType(targetExpected,targetActual);
				actual=true;
				return true;
			}
			var actual=false;
			
			new xUnit.js.Console.ScriptLoader().GetScriptList([]);
			Object.IsType=targetIsType;
		
			Assert.True(actual);
		}

		[Fact]
		function PassesArrayToObjectIsTypeAsExpectedForScriptList(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=1)return targetIsType(targetExpected,targetActual);
				actual=targetExpected;
				return true;
			}
			var actual=null;
			var expected=Array;

			new xUnit.js.Console.ScriptLoader().GetScriptList([]);
			Object.IsType=targetIsType;

			Assert.Equal(expected,actual);
		}

		[Fact]
		function PassesArrayInstanceToObjectIsTypeAsActualForScriptList(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=1)return targetIsType(targetExpected,targetActual);
				actual=targetActual;
				return true;
			}
			var actual=null;
			var expected=new Array();
			
			new xUnit.js.Console.ScriptLoader().GetScriptList(expected);
			Object.IsType=targetIsType;
		
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function ThrowsIfObjectIsTypeReturnsFalseForScriptList(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=2)return targetIsType(targetExpected,targetActual);
				return false;
			}
			var expected="xUnit.js.Console.ScriptLoader.GetScriptList: 'pathList' must be an array of valid file or Directory paths.";

			var actual=Record.Exception(function(){
				new xUnit.js.Console.ScriptLoader().GetScriptList();
			});
			Object.IsType=targetIsType;
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function CallsObjectIsTypeForExtensions(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=2)return targetIsType(targetExpected,targetActual);
				actual=true;
				return true;
			}
			var actual=false;
			
			new xUnit.js.Console.ScriptLoader().GetScriptList([],[]);
			Object.IsType=targetIsType;
		
			Assert.True(actual);
		}

		[Fact]
		function PassesArrayToObjectIsTypeAsExpectedForExtensions(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=2)return targetIsType(targetExpected,targetActual);
				actual=targetExpected;
				return true;
			}
			var actual=null;
			var expected=Array;

			new xUnit.js.Console.ScriptLoader().GetScriptList([],[]);
			Object.IsType=targetIsType;

			Assert.Equal(expected,actual);
		}

		[Fact]
		function PassesArrayInstanceToObjectIsTypeAsActualForExtensions(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=2)return targetIsType(targetExpected,targetActual);
				actual=targetActual;
				return true;
			}
			var actual=null;
			var expected=new Array();
			
			new xUnit.js.Console.ScriptLoader().GetScriptList([],expected);
			Object.IsType=targetIsType;
		
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function CallsArrayForEachToAddDirectories(){
			var targetForEach=Array.ForEach;
			var targetCalls=0;
			Array.ForEach=function(targetPath,targetHandler,targetPredicate){
				if(++targetCalls!=1)return targetForEach(targetPath,targetHandler,targetPredicate);
				actual=true;
			}
			var actual=false;
			
			new xUnit.js.Console.ScriptLoader().GetScriptList([]);			
			Array.ForEach=targetForEach;
			
			Assert.True(actual);
		}

		[Fact]
		function PassesPathListToArrayForEachToAddDirectories(){
			var targetForEach=Array.ForEach;
			var targetCalls=0;
			Array.ForEach=function(targetPathList,targetHandler,targetPredicate){
				if(++targetCalls!=1)return targetForEach(targetPathList,targetHandler,targetPredicate);
				actual=targetPathList;
			}
			var actual=null;
			var expected=[];
			
			new xUnit.js.Console.ScriptLoader().GetScriptList(expected);
			Array.ForEach=targetForEach;
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function DirectoryPredicateCallsDirectoryExists(){
			var targetExists=System.IO.Directory.Exists;
			System.IO.Directory.Exists=function(path){
				actual=true;
				return true;
			}
			var targetForEach=Array.ForEach;
			var targetCalls=0;
			Array.ForEach=function(targetPathList,targetHandler,targetPredicate){
				if(++targetCalls!=1)return targetForEach(targetPathList,targetHandler,targetPredicate);
				targetPredicate(targetPathList);
			}
			var actual=false;
			
			new xUnit.js.Console.ScriptLoader().GetScriptList([]);			
			Array.ForEach=targetForEach;
			System.IO.Directory.Exists=targetExists;

			Assert.True(actual);
		}

		[Fact]
		function DirectoryHandlerCallsGetDirectories(){
			var targetExists=System.IO.Directory.Exists;
			System.IO.Directory.Exists=function(path){
				return true;
			}
			var targetGetFiles=System.IO.Directory.GetFiles;
			System.IO.Directory.GetFiles=function(){
				return [];
			}
			var targetGetDirectories=System.IO.Directory.GetDirectories;
			System.IO.Directory.GetDirectories=function(){
				actual=true;
				return [];
			}
			var actual=false;

			new xUnit.js.Console.ScriptLoader().GetScriptList(['target']);
			System.IO.Directory.Exists=targetExists;
			System.IO.Directory.GetDirectories=targetGetDirectories;
			System.IO.Directory.GetFiles=targetGetFiles;

			Assert.True(actual);
		}

		[Fact]
		function DirectoryHandlerPassesPathToGetDirectories(){
			var targetExists=System.IO.Directory.Exists;
			System.IO.Directory.Exists=function(path){
				return true;
			}
			var targetGetFiles=System.IO.Directory.GetFiles;
			System.IO.Directory.GetFiles=function(){
				return [];
			}
			var targetGetDirectories=System.IO.Directory.GetDirectories;
			System.IO.Directory.GetDirectories=function(path){
				actual=path;
				return [];
			}
			var actual=false;
			var expected='target';

			new xUnit.js.Console.ScriptLoader().GetScriptList([expected]);
			System.IO.Directory.Exists=targetExists;
			System.IO.Directory.GetDirectories=targetGetDirectories;
			System.IO.Directory.GetFiles=targetGetFiles;

			Assert.Equal(expected,actual);
		}

		[Fact]
		function DirectoryHandlerCallsArrayForEachForNestedDirectories(){
			var targetForEach=Array.ForEach;
			var targetCalls=0;
			Array.ForEach=function(array,handler,predicate){
				if(++targetCalls!=2)return targetForEach(array,handler,predicate);
				actual=true;
			}
			var targetExists=System.IO.Directory.Exists;
			System.IO.Directory.Exists=function(path){
				return true;
			}
			var targetGetFiles=System.IO.Directory.GetFiles;
			System.IO.Directory.GetFiles=function(){
				return [];
			}
			var targetGetDirectories=System.IO.Directory.GetDirectories;
			System.IO.Directory.GetDirectories=function(path){
				actual=path;
				return [];
			}
			var actual=false;

			new xUnit.js.Console.ScriptLoader().GetScriptList(['target']);
			System.IO.Directory.Exists=targetExists;
			System.IO.Directory.GetDirectories=targetGetDirectories;
			System.IO.Directory.GetFiles=targetGetFiles;

			Assert.True(actual);
		}

		[Fact]
		function DirectoryHandlerCallsArrayForEachWithNestedDirectories(){
			var targetForEach=Array.ForEach;
			var targetCalls=0;
			Array.ForEach=function(array,handler,predicate){
				if(++targetCalls!=2)return targetForEach(array,handler,predicate);
				actual=array;
			}
			var targetExists=System.IO.Directory.Exists;
			System.IO.Directory.Exists=function(path){
				return true;
			}
			var targetGetFiles=System.IO.Directory.GetFiles;
			System.IO.Directory.GetFiles=function(){
				return [];
			}
			var targetGetDirectories=System.IO.Directory.GetDirectories;
			System.IO.Directory.GetDirectories=function(path){
				return expected;
			}
			var actual=false;
			var expected=[];

			new xUnit.js.Console.ScriptLoader().GetScriptList(['target']);
			System.IO.Directory.Exists=targetExists;
			System.IO.Directory.GetDirectories=targetGetDirectories;
			System.IO.Directory.GetFiles=targetGetFiles;

			Assert.Same(expected,actual);
		}

		[Fact]
		function DirectoryHandlerCallsGetFiles(){
			var targetExists=System.IO.Directory.Exists;
			System.IO.Directory.Exists=function(path){
				return true;
			}
			var targetGetFiles=System.IO.Directory.GetFiles;
			System.IO.Directory.GetFiles=function(){
				actual=true;
				return [];
			}
			var targetGetDirectories=System.IO.Directory.GetDirectories;
			System.IO.Directory.GetDirectories=function(){
				return [];
			}
			var actual=false;

			new xUnit.js.Console.ScriptLoader().GetScriptList(['target']);
			System.IO.Directory.Exists=targetExists;
			System.IO.Directory.GetDirectories=targetGetDirectories;
			System.IO.Directory.GetFiles=targetGetFiles;

			Assert.True(actual);
		}

		[Fact]
		function DirectoryHandlerPassesPathToGetFiles(){
			var targetExists=System.IO.Directory.Exists;
			System.IO.Directory.Exists=function(path){
				return true;
			}
			var targetGetFiles=System.IO.Directory.GetFiles;
			System.IO.Directory.GetFiles=function(path){
				actual=path;
				return [];
			}
			var targetGetDirectories=System.IO.Directory.GetDirectories;
			System.IO.Directory.GetDirectories=function(path){
				return [];
			}
			var actual=null;
			var expected='target';

			new xUnit.js.Console.ScriptLoader().GetScriptList([expected]);
			System.IO.Directory.Exists=targetExists;
			System.IO.Directory.GetDirectories=targetGetDirectories;
			System.IO.Directory.GetFiles=targetGetFiles;

			Assert.Equal(expected,actual);
		}

		[Fact]
		function PassesPathListToArrayForEachToAddFiles(){
			var targetForEach=Array.ForEach;
			var targetCalls=0;
			Array.ForEach=function(targetPathList,targetHandler,targetPredicate){
				if(++targetCalls!=2)return targetForEach(targetPathList,targetHandler,targetPredicate);
				actual=targetPathList;
			}
			var actual=null;
			var expected=[];
			
			new xUnit.js.Console.ScriptLoader().GetScriptList(expected);
			Array.ForEach=targetForEach;
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function DirectoryHandlerCallsArrayForEachForFiles(){
			var targetForEach=Array.ForEach;
			var targetCalls=0;
			Array.ForEach=function(array,handler,predicate){
				if(++targetCalls!=3)return targetForEach(array,handler,predicate);
				actual=true;
			}
			var targetExists=System.IO.Directory.Exists;
			System.IO.Directory.Exists=function(path){
				return true;
			}
			var targetGetFiles=System.IO.Directory.GetFiles;
			System.IO.Directory.GetFiles=function(){
				return [];
			}
			var targetGetDirectories=System.IO.Directory.GetDirectories;
			System.IO.Directory.GetDirectories=function(path){
				return [];
			}
			var actual=false;

			new xUnit.js.Console.ScriptLoader().GetScriptList(['target']);
			System.IO.Directory.Exists=targetExists;
			System.IO.Directory.GetDirectories=targetGetDirectories;
			System.IO.Directory.GetFiles=targetGetFiles;

			Assert.True(actual);
		}

		[Fact]
		function DirectoryHandlerCallsArrayForEachWithFiles(){
			var targetForEach=Array.ForEach;
			var targetCalls=0;
			Array.ForEach=function(array,handler,predicate){
				if(++targetCalls!=3)return targetForEach(array,handler,predicate);
				actual=array;
			}
			var targetExists=System.IO.Directory.Exists;
			System.IO.Directory.Exists=function(path){
				return true;
			}
			var targetGetFiles=System.IO.Directory.GetFiles;
			System.IO.Directory.GetFiles=function(){
				return expected;
			}
			var targetGetDirectories=System.IO.Directory.GetDirectories;
			System.IO.Directory.GetDirectories=function(path){
				return [];
			}
			var actual=null;
			var expected=[];

			new xUnit.js.Console.ScriptLoader().GetScriptList(['target']);
			System.IO.Directory.Exists=targetExists;
			System.IO.Directory.GetDirectories=targetGetDirectories;
			System.IO.Directory.GetFiles=targetGetFiles;

			Assert.Same(expected,actual);
		}

		[Fact]
		function FilePredicateCallsStringEndsWith(){
			var targetExists=System.IO.Directory.Exists;
			System.IO.Directory.Exists=function(path){
				return false;
			}
			var targetGetDirectories=System.IO.Directory.GetDirectories;
			System.IO.Directory.GetDirectories=function(path){
				return [];
			}
			var targetGetFiles=System.IO.Directory.GetFiles;
			System.IO.Directory.GetFiles=function(path){
				return [];
			}
			var targetEndsWith=String.EndsWith;			
			String.EndsWith=function(){
				actual=true;
				return true;
			}
			var actual=false;
						
			new xUnit.js.Console.ScriptLoader().GetScriptList(["target"]);
			String.EndsWith=targetEndsWith;
			System.IO.Directory.Exists=targetExists;
			System.IO.Directory.GetDirectories=targetGetDirectories;

			Assert.True(actual);
		}

		[Fact]
		function FilePredicateCallsDirectoryPredicate(){
			var targetExists=System.IO.Directory.Exists;
			var targetCalls=0;
			System.IO.Directory.Exists=function(path){
				if(++targetCalls!=2)return true;
				actual=true;
				return false;
			}
			var targetGetDirectories=System.IO.Directory.GetDirectories;
			System.IO.Directory.GetDirectories=function(path){
				return [];
			}
			var targetGetFiles=System.IO.Directory.GetFiles;
			System.IO.Directory.GetFiles=function(path){
				return [];
			}
			var targetEndsWith=String.EndsWith;			
			String.EndsWith=function(){
				return true;
			}
			var actual=false;
			
			new xUnit.js.Console.ScriptLoader().GetScriptList(["target"]);
			String.EndsWith=targetEndsWith;
			System.IO.Directory.Exists=targetExists;
			System.IO.Directory.GetDirectories=targetGetDirectories;

			Assert.True(actual);
		}

		
		[Fact]
		function FileHandlerAddsPathToScriptListIfFilePredicateReturnsTrue(){
			var targetExists=System.IO.Directory.Exists;
			System.IO.Directory.Exists=function(path){
				return false;
			}
			var targetGetDirectories=System.IO.Directory.GetDirectories;
			System.IO.Directory.GetDirectories=function(path){
				return [];
			}
			var targetGetFiles=System.IO.Directory.GetFiles;
			System.IO.Directory.GetFiles=function(path){
				return [];
			}
			var targetEndsWith=String.EndsWith;			
			String.EndsWith=function(){
				return true;
			}
			var expected=["expected"];
			
			var actual=new xUnit.js.Console.ScriptLoader().GetScriptList(expected);
			String.EndsWith=targetEndsWith;
			System.IO.Directory.Exists=targetExists;
			System.IO.Directory.GetDirectories=targetGetDirectories;

			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function ReturnsAnArray(){
			var actual=new xUnit.js.Console.ScriptLoader().GetScriptList([]);
			
			Assert.Type(Array,actual);
		}
	}
	
	[Fixture]
	function LoadScripts(){
		[Fact]
		function CallsObjectIsType(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=1)return targetIsType(targetExpected,targetActual);
				actual=true;
				return true;
			}			
			var actual=false;
			
			new xUnit.js.Console.ScriptLoader().LoadScripts([]);
			
			Assert.True(actual);
		}
		
		[Fact]
		function PassesArrayToObjectIsTypeAsExpected(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=2)return targetIsType(targetExpected,targetActual);
				actual=targetExpected;
				return true;
			}			
			var actual=null;
			var expected=Array;
			
			new xUnit.js.Console.ScriptLoader().LoadScripts([]);
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function PassesScriptListToObjectIsTypeAsActual(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=1)return targetIsType(targetExpected,targetActual);
				actual=targetActual;
				return true;
			}			
			var actual=null;
			var expected=[];
			
			new xUnit.js.Console.ScriptLoader().LoadScripts(expected);
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function ThrowsIfObjectIsTypeReturnsFalse(){
			var targetIsType=Object.IsType;
			var targetCalls=0;
			Object.IsType=function(targetExpected,targetActual){
				if(++targetCalls!=2)return targetIsType(targetExpected,targetActual);
				return false;
			}
			var expected="xUnit.js.Console.ScriptLoader.LoadScripts: 'scriptList' must be an array of valid file paths.";
			
			var actual=Record.Exception(function(){
				new xUnit.js.Console.ScriptLoader().LoadScripts([]);
			});
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function CallsArrayForEach(){
			var targetForEach=Array.ForEach;
			Array.ForEach=function(){
				actual=true;
			}
			var actual=false;
			
			new xUnit.js.Console.ScriptLoader().LoadScripts(["target"]);
			Array.ForEach=targetForEach;
			
			Assert.True(actual);
		}

		[Fact]
		function PassesScriptListToArrayForEach(){
			var targetForEach=Array.ForEach;
			Array.ForEach=function(array){
				actual=array;
			}
			var actual=null;
			var expected=["target"];
			
			new xUnit.js.Console.ScriptLoader().LoadScripts(expected);
			Array.ForEach=targetForEach;
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function PassesScriptHandlerToArrayForEach(){
			var targetForEach=Array.ForEach;
			Array.ForEach=function(array,handler){
				actual=handler;
			}
			var actual=null;
			
			new xUnit.js.Console.ScriptLoader().LoadScripts(["target"]);
			Array.ForEach=targetForEach;
			
			Assert.Type(Function,actual);
		}
		
		[Fact]
		function ScriptHandlerCallsGetFullPath(){
			var targetForEach=Array.ForEach;
			Array.ForEach=function(array,handler){
				handler();
			}
			var targetGetFullPath=System.IO.Path.GetFullPath;
			System.IO.Path.GetFullPath=function(){
				actual=true;
				return '';
			}
			var targetGetFile=System.IO.File.GetFile;
			System.IO.File.GetFile=function(){
				return '';
			}
			var actual=false;
			
			new xUnit.js.Console.ScriptLoader().LoadScripts(["target"]);
			Array.ForEach=targetForEach;
			System.IO.Path.GetFullPath=targetGetFullPath;
			System.IO.File.GetFile=targetGetFile;
			
			Assert.True(actual);
		}

		[Fact]
		function ScriptHandlerPassesPathToGetFullPath(){
			var targetForEach=Array.ForEach;
			Array.ForEach=function(array,handler){
				handler(array[0]);
			}
			var targetGetFullPath=System.IO.Path.GetFullPath;
			System.IO.Path.GetFullPath=function(path){
				actual=path;
				return '';
			}
			var targetGetFile=System.IO.File.GetFile;
			System.IO.File.GetFile=function(){
				return '';
			}
			var actual=null;
			var expected="expected";
			
			new xUnit.js.Console.ScriptLoader().LoadScripts([expected]);
			Array.ForEach=targetForEach;
			System.IO.Path.GetFullPath=targetGetFullPath;
			System.IO.File.GetFile=targetGetFile;
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function ScriptHandlerCallsGetFile(){
			var targetForEach=Array.ForEach;
			Array.ForEach=function(array,handler){
				handler();
			}
			var targetGetFullPath=System.IO.Path.GetFullPath;
			System.IO.Path.GetFullPath=function(){
				return '';
			}
			var targetExists=System.IO.File.Exists;
			System.IO.File.Exists=function(){
				return true;
			}
			var targetGetFile=System.IO.File.GetFile;
			System.IO.File.GetFile=function(){
				actual=true;
				return '';
			}
			var actual=false;
			
			new xUnit.js.Console.ScriptLoader().LoadScripts(["target"]);
			Array.ForEach=targetForEach;
			System.IO.File.Exists=targetExists;
			System.IO.Path.GetFullPath=targetGetFullPath;
			System.IO.File.GetFile=targetGetFile;

			Assert.True(actual);
		}

		[Fact]
		function ScriptHandlerPassesFullPathToGetFile(){
			var targetForEach=Array.ForEach;
			Array.ForEach=function(array,handler){
				handler(array[0]);
			}
			var targetGetFullPath=System.IO.Path.GetFullPath;
			System.IO.Path.GetFullPath=function(){
				return expected;
			}
			var targetExists=System.IO.File.Exists;
			System.IO.File.Exists=function(){
				return true;
			}
			var targetGetFile=System.IO.File.GetFile;
			System.IO.File.GetFile=function(path){
				actual=path;
				return '';
			}
			var actual=null;
			var expected="expected";
			
			new xUnit.js.Console.ScriptLoader().LoadScripts(["target"]);
			Array.ForEach=targetForEach;
			System.IO.Path.Exists=targetExists;
			System.IO.Path.GetFullPath=targetGetFullPath;
			System.IO.File.GetFile=targetGetFile;
			
			Assert.Equal(expected,actual);
		}
		
		[Fact]
		function HandlerCallsAttributeParserParseMethod(){
			var targetForEach=Array.ForEach;
			Array.ForEach=function(array,handler){
				handler(array[0]);
			}
			var targetExists=System.IO.File.Exists;
			System.IO.File.Exists=function(){
				return true;
			}
			var targetGetFile=System.IO.File.GetFile;
			System.IO.File.GetFile=function(){
				return '';
			}
			var targetParser=System.Script.Attributes.AttributeParser;
			System.Script.Attributes.AttributeParser=function(){
				this.Parse=function(){
					actual=true;				
					return '';
				}
			}
			var actual=false;

			new xUnit.js.Console.ScriptLoader().LoadScripts(["target"]);
			Array.ForEach=targetForEach;
			System.IO.Path.Exists=targetExists;
			System.IO.File.GetFile=targetGetFile;
			System.Script.Attributes.AttributeParser=targetParser;
			
			Assert.True(actual);
		}

		[Fact]
		function HandlerPassesGetFileResultToAttributeParserParseMethod(){
			var targetForEach=Array.ForEach;
			Array.ForEach=function(array,handler){
				handler(array[0]);
			}
			var targetExists=System.IO.File.Exists;
			System.IO.File.Exists=function(){
				return true;
			}
			var targetGetFile=System.IO.File.GetFile;
			System.IO.File.GetFile=function(){
				return expected;
			}
			var targetParser=System.Script.Attributes.AttributeParser;
			System.Script.Attributes.AttributeParser=function(){
				this.Parse=function(scriptText){
					actual=scriptText;  
					return '';
				}
			}
			var actual=null;
			var expected="var expected;";
			
			new xUnit.js.Console.ScriptLoader().LoadScripts(["target"]);
			Array.ForEach=targetForEach;
			System.IO.Path.Exists=targetExists;
			System.IO.File.GetFile=targetGetFile;
			System.Script.Attributes.AttributeParser=targetParser;
			
			Assert.Equal(expected,actual);
		}

		[Fact]
		function HandlerCallsScriptLoaderLoadMethod(){
			var targetForEach=Array.ForEach;
			Array.ForEach=function(array,handler){
				handler(array[0]);
			}
			var targetExists=System.IO.File.Exists;
			System.IO.File.Exists=function(){
				return true;
			}
			var targetGetFile=System.IO.File.GetFile;
			System.IO.File.GetFile=function(){
				return '';
			}
			var targetScriptLoad=System.Script.ScriptLoader.Load;
			System.Script.ScriptLoader.Load=function(){
				actual=true;				
			}
			var actual=false;

			new xUnit.js.Console.ScriptLoader().LoadScripts(["target"]);
			Array.ForEach=targetForEach;
			System.IO.Path.Exists=targetExists;
			System.IO.File.GetFile=targetGetFile;
			System.Script.ScriptLoader.Load=targetScriptLoad;
			
			Assert.True(actual);
		}

		[Fact]
		function HandlerPassesResultOfParseMethodToScriptLoaderLoadMethod(){
			var targetForEach=Array.ForEach;
			Array.ForEach=function(array,handler){
				handler(array[0]);
			}
			var targetExists=System.IO.File.Exists;
			System.IO.File.Exists=function(){
				return true;
			}
			var targetGetFile=System.IO.File.GetFile;
			System.IO.File.GetFile=function(){
				return '';
			}
			var targetParser=System.Script.Attributes.AttributeParser;
			System.Script.Attributes.AttributeParser=function(){
				this.Parse=function(){
					return expected;
				}
			}
			var targetScriptLoad=System.Script.ScriptLoader.Load;
			System.Script.ScriptLoader.Load=function(scriptText){
				actual=scriptText;
			}
			var actual=null;
			var expected="var expected;";

			new xUnit.js.Console.ScriptLoader().LoadScripts(["target"]);
			Array.ForEach=targetForEach;
			System.IO.Path.Exists=targetExists;
			System.IO.File.GetFile=targetGetFile;
			System.Script.Attributes.AttributeParser=targetParser;
			System.Script.ScriptLoader.Load=targetScriptLoad;
			
			Assert.Equal(expected,actual);
		}
	}
}