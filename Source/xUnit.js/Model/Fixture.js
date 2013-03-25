Function.RegisterNamespace("xUnit.js.Model");

xUnit.js.Model.Fixture=function(){
	
	// Private members
	var _events;
	var _facts;
	var _fixtures;
	
	// Public members
	this.Events;
	this.Name;
	this.Parent;

	// ctor
	function Fixture(name,parent){
		_facts=[];
		_fixtures=[];
		this.Events=_events=new System.Event.EventManager("BeforeRun","AfterRun");
		this.Name=name||"[Anonymous]";
		this.Parent=parent||null;
	}
	Fixture.apply(this,arguments);

	this.GetPath=function(){
		var path=[];
		var step=this;
		while(step){
			path.unshift(step.Name);
			step=step.Parent;
		}
		return path.join('.');
	};

	// ICompositeFixture members
	this.Clear=function(){
		_fixtures.length=0;
		_facts.length=0;
	};
	
	this.GetFacts=function(){
		return _facts.slice(0);
	};

	this.GetFixtures=function(){
		return _fixtures.slice(0);
	};
	
	this.RegisterFixture=function(fixture){
		if(!Object.IsType(xUnit.js.Model.Fixture,fixture))throw new Error("xUnit.js.Model.Fixture.RegisterFixture: 'fixture' must be an instance of 'xUnit.js.Model.Fixture'.");
		fixture.Parent=this;
		_fixtures.push(fixture);
	};

	this.RegisterFact=function(fact){
		if(!Object.IsType(xUnit.js.Model.Fact,fact))throw new Error("xUnit.js.Model.Fixture.RegisterFact: 'fact' must be an instance of 'xUnit.js.Model.Fact'.");
		fact.Parent=this;
		_facts.push(fact);
	};

	this.RemoveFixture=function(fixture){
		if(!Object.IsType(xUnit.js.Model.Fixture,fixture))throw new Error("xUnit.js.Model.Fixture.RemoveFixture: 'fixture' must be an instance of 'xUnit.js.Model.Fixture'.");
		if(fixture.Parent!=this)throw new Error("xUnit.js.Model.Fixture.RemoveFixture: 'fixture' is not registered to this fixture.");
		fixture.Parent=null;
		Array.Remove(_fixtures,fixture);
	};
	
	this.RemoveFact=function(fact){
		if(!Object.IsType(xUnit.js.Model.Fact,fact))throw new Error("xUnit.js.Model.Fixture.RemoveFact: 'fact' must be an instance of 'xUnit.js.Model.Fact'.");
		if(fact.Parent!=this)throw new Error("xUnit.js.Model.Fixture.RemoveFact: 'fact' is not registered to this fixture.");
		fact.Parent=null;
		Array.Remove(_facts,fact);
	};

	// IRunnable members
	this.Run=function(){
		var context=new xUnit.js.Model.EventContext(this,xUnit.js.Model.Result.Unknown);
		_events.Fire("BeforeRun",context);
		if(context.Cancel){
			context.State=xUnit.js.Model.Result.Skipped;
		}else{
			Array.ForEach(_fixtures,runTarget);
			Array.ForEach(_facts,runTarget);
			context.State=xUnit.js.Model.Result.Success;
			_events.Fire("AfterRun",context);
		}
		return null;
	};
	
	// ISkippable members
	this.Skip=function(reason){
		Array.ForEach(_fixtures,skipHandler,null,{Reason:reason});
		Array.ForEach(_facts,skipHandler,null,{Reason:reason});
	};
	
	// Private methods
	function nameSorter(a,b){
		if(!a)return -1;
		if(!b)return 1;
		if(a.Name<b.Name)return -1;
		if(a.Name>b.Name)return 1;
		return 0;
	}

	function runTarget(target,arrayContext){
		target.Run();
	}
	
	function skipHandler(skippable,context){
		skippable.Skip(context.Reason);
	}
};

xUnit.js.Model.Fixture.Implement(xUnit.js.Model.ICompositeFixture,"xUnit.js.Model.Fixture");
xUnit.js.Model.Fixture.Implement(xUnit.js.Model.IRunnable,"xUnit.js.Model.Fixture");
xUnit.js.Model.Fixture.Implement(xUnit.js.Model.ISkippable,"xUnit.js.Model.Fixture");