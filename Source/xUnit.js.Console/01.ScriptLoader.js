Function.RegisterNamespace("xUnit.js.Console");

xUnit.js.Console.ScriptLoader=function(){
	// Private members
	var _attributeParser;

	var _scriptList;
	var _extensions;
	var _defaultExtensions=['.js'];

	// ctor
	new function ScriptLoader(){
		_attributeParser=new System.Script.Attributes.AttributeParser();
	};
	
	// Public methods
	this.GetScriptList=function(pathList,extensions){
		if(!Object.IsType(Array,pathList))throw new Error("xUnit.js.Console.ScriptLoader.GetScriptList: 'pathList' must be an array of valid file or Directory paths.");
		_scriptList=[];
		_extensions=Object.IsType(Array,extensions)?extensions:_defaultExtensions;
		Array.ForEach(pathList,addDirectory,directoryPredicate);
		Array.ForEach(pathList,addScript,scriptPredicate);
		return _scriptList;
	};
	
	this.LoadScripts=function(scriptList){
		if(!Object.IsType(Array,scriptList))throw new Error("xUnit.js.Console.ScriptLoader.LoadScripts: 'scriptList' must be an array of valid file paths.");
		Array.ForEach(scriptList,loadScript);
	};

	// Private methods
	function addDirectory(path,context){
		var directories=System.IO.Directory.GetDirectories(path);
		if(directories)Array.ForEach(directories,addDirectory);
		var files=System.IO.Directory.GetFiles(path);
		if(files)Array.ForEach(files,addScript,scriptPredicate);
	}

	function addScript(path,context){
		_scriptList.push(path);
	}

	function loadScript(path,context){
		var filePath=System.IO.Path.GetFullPath(path);
		if(!System.IO.File.Exists(filePath))return;
		var root=System.IO.Path.GetRoot();
		System.IO.Path.SetRoot(System.IO.Path.GetPath(filePath));
		try{
			var scriptText=System.IO.File.GetFile(filePath);
			scriptText=_attributeParser.Parse(scriptText);
			System.Script.ScriptLoader.Load(scriptText);
		}catch(e){
			throw new Error(String.Format("Error loading script: '{0}'. Error: '{1}'.",filePath,e));
		}
		System.IO.Path.SetRoot(root);
	}
	
	// Predicates
	function directoryPredicate(path,context){
		return System.IO.Directory.Exists(path);
	}

	function scriptPredicate(path,context){
		for(var i=0;i<_extensions.length;i++){
			if(String.EndsWith(path,_extensions[i]))return !directoryPredicate(path,context);
		}
		return false;
	}
};