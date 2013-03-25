Function.RegisterNamespace("xUnit.js.Console.IO.DirectoryStrategy");

xUnit.js.Console.IO.DirectoryStrategy.Jsdb=function(){
    this.Delete=function(path){
        return system.remove(path);
    };

    this.Exists=function(path){
        var attributes=system.attributes(path);
        if(attributes)attributes=attributes.attributes;
        return String.Contains(attributes||'','directory',true);
    };

    this.GetFiles=function(path){
		var files=system.files(System.IO.Path.Combine(path,'*.*'));
		for(var i=0;i<files.length;i++)files[i]=System.IO.Path.Combine(path,files[i]);
		return files;
    };
    
    this.GetDirectories=function(path){
		var directories=system.folders(System.IO.Path.Combine(path,'*'));
		for(var i=0;i<directories.length;i++)directories[i]=System.IO.Path.Combine(path,directories[i]);
		return directories;
    };

    this.IsSatisfiedBy=function(candidate){
        return typeof(system)!="undefined" && system.hasOwnProperty("release") && typeof(jsArguments)!="undefined";
    };
};

xUnit.js.Console.IO.DirectoryStrategy.Jsdb.Implement(System.IO.DirectoryStrategy.IDirectoryStrategy,'xUnit.js.Console.IO.DirectoryStrategy.Jsdb');
xUnit.js.Console.IO.DirectoryStrategy.Jsdb.Implement(System.Script.Strategy.IStrategySpecification,'xUnit.js.Console.IO.DirectoryStrategy.Jsdb');

System.IO.Directory.Strategies.Add(xUnit.js.Console.IO.DirectoryStrategy.Jsdb);