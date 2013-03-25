Function.RegisterNamespace("xUnit.js.Console.EnvironmentStrategy");

xUnit.js.Console.EnvironmentStrategy.JsdbStrategy=function(globalScope){
    
    // IEnvironmentStrategy Members
    this.Execute=function(command,parameters,voidOutput){
        var result=system.execute(command,parameters);
        if(!voidOutput)return result;
    };

    this.Exit=function(errorCode){
        system.exitCode=errorCode;
        system.exit();
    };

    this.GetParameters=function(){
        var args={
            named:{},
            unnamed:[]
        };
        var params=system.arguments;
        for(var i=0;i<params.length;i++){
            var param=String.Trim(params[i]);
            if(String.StartsWith(param,'/')&&String.Contains(param,':')){
                param=String.TrimStart(param,'/').split(':');
                args.named[param[0].toLowerCase()]=param[1];
            }else args.unnamed.push(param);
        }
        return args;
    };
    
    this.GetWorkingDirectory=function(){
        return system.cwd;
    };

    this.Write=function(message1,message2,messageN){
        for(var i=0;i<arguments.length;i++){
            write(arguments[i]);
        }
    };
    
    this.WriteError=this.Write;
    
    // IStrategySpecification members
    this.IsSatisfiedBy=function(candidate){
        return typeof(system)!="undefined" && system.hasOwnProperty("release") && typeof(jsArguments)!="undefined";
    };
    
};

xUnit.js.Console.EnvironmentStrategy.JsdbStrategy.Implement(System.EnvironmentStrategy.IEnvironmentStrategy,'xUnit.js.Console.EnvironmentStrategy.JsdbStrategy');
xUnit.js.Console.EnvironmentStrategy.JsdbStrategy.Implement(System.Script.Strategy.IStrategySpecification,'xUnit.js.Console.EnvironmentStrategy.JsdbStrategy');

System.Environment.Strategies.Add(xUnit.js.Console.EnvironmentStrategy.JsdbStrategy);