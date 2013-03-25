Function.RegisterNamespace("xUnit.js.Console.IO.FileStrategy");

xUnit.js.Console.IO.FileStrategy.Stream=function(){
    // Private Methods
    function decode(input){
        if(input.charCodeAt(1)==0xBB&&input.charCodeAt(2)==0xBF){
            return decodeUTF8(input);
        }
        return input;
    }
    
    // IFileStrategy Members
    this.DeleteFile=function(path){
        return system.remove(path);
    };
    
    this.Exists=function(path){
        return system.exists(path);
    };

    this.GetFile=function(path){
        var fileText=null;
        try{
            var file=new Stream(path);
            if(file){
                fileText=file.readText();
 		        fileText=decode(fileText);
            }
        }catch(e){}
        return fileText;
    };
        
    this.SaveFile=function(path,text){
		var file=new Stream(path,"wt+");
		if(file){
		    file.write(text);
		}
    };

    // IStrategySpecification Members
    this.IsSatisfiedBy=function(candidate){
        return typeof(Stream)!='undefined';
    };
};

xUnit.js.Console.IO.FileStrategy.Stream.Implement(System.IO.FileStrategy.IFileStrategy,'xUnit.js.Console.IO.FileStrategy.Stream');
xUnit.js.Console.IO.FileStrategy.Stream.Implement(System.Script.Strategy.IStrategySpecification,'xUnit.js.Console.IO.FileStrategy.Stream');

System.IO.File.Strategies.Add(xUnit.js.Console.IO.FileStrategy.Stream);