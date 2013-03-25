Function.RegisterNamespace('xUnit.js.Console');

xUnit.js.Console.Program=function(){
	this.Application;

	// Application Entry Point
	function Program(){
		this.Application=new xUnit.js.Console.Runner();
		this.Application.Run();
	}
	Program.apply(this,arguments);

};
xUnit.js.Console.Program=new xUnit.js.Console.Program();