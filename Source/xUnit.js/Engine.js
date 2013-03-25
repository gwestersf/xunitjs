Function.RegisterNamespace("xUnit.js");

xUnit.js.Engine=function(){

	// Private members
	var _events;
	var _pathMap;
	var _rootFixture;

	// Public members
	this.Events;

	// ctor
	function Engine(){
		_pathMap={};
		ensureRootFixture();
		this.Events=_events=new System.Event.EventManager("BeforeRun","AfterRun");
	}
	Engine.apply(this,arguments);

	this.Enumerate=function(){
		var list=[];
		enumerateFixture(_rootFixture,list);
		return list;
	};
	
	this.Get=function(path){
		if(path!=undefined&&!Object.IsType(Function,path.toString))throw new Error("xUnit.js.Engine.Get: 'path' must be convertible to String.");
		return resolveTargets(path);
	};
	
	this.RegisterFixture=function(fixture,path){
		if(!Object.IsType(xUnit.js.Model.Fixture,fixture))throw new Error("xUnit.js.Engine.RegisterFixture: 'fixture' must be an instance of 'xUnit.js.Model.Fixture'.");
		fixture.Events.Add("AfterRun",Fixture_AfterRun);
		fixture.Events.Add("BeforeRun",Fixture_BeforeRun);
		var parentFixture=resolveFixture(path);
		parentFixture.RegisterFixture(fixture);
		updateFixtureMap(path,fixture);
	};

	this.RegisterFact=function(fact,path){
		if(!Object.IsType(xUnit.js.Model.Fact,fact))throw new Error("xUnit.js.Engine.RegisterFact: 'fact' must be an instance of 'xUnit.js.Model.Fact'.");
		fact.Events.Add("AfterRun",Fact_AfterRun);
		fact.Events.Add("BeforeRun",Fact_BeforeRun);
		var parentFixture=resolveFixture(path);
		parentFixture.RegisterFact(fact);
	};

	// IRunnable members
	this.Run=function(path){
		if(path!=undefined&&!Object.IsType(Function,path.toString))throw new Error("xUnit.js.Engine.Run: 'path' must be convertible to String.");
		var targets=resolveTargets(path);
		if(!Object.IsType(Array,targets))targets=[targets];
		Array.ForEach(targets,runDelegate);
	};
	
	// Private methods
	function enumerateFixture(fixture,list){
		if(!Object.IsType(xUnit.js.Model.Fixture,fixture))throw new Error("xUnit.js.Engine.enumerateFixture: 'fixture' must be an instance of 'xUnit.js.Model.Fixture'.");
		var fixtures=fixture.GetFixtures();
		for(var i=0;i<fixtures.length;i++)enumerateFixture(fixtures[i],list);
		var facts=fixture.GetFacts();
		for(var i=0;i<facts.length;i++)list.push(facts[i]);
	}	

	function ensureRootFixture(){
		if(_rootFixture)return;
		_rootFixture=new xUnit.js.Model.Fixture("[Root]");
		_rootFixture.Events.Add("AfterRun",Fixture_AfterRun);
		_rootFixture.Events.Add("BeforeRun",Fixture_BeforeRun);
	}
	
	function findMatches(targetPath,component){
		var targets=[];
		var fixtures=component.GetFixtures();
		for(var i=0;i<fixtures.length;i++){
			if(String.StartsWith(fixtures[i].GetPath(),targetPath)){
				targets.push(fixtures[i]);
				continue;
			}
			targets=targets.concat(findMatches(targetPath,fixtures[i]));
		}
		var facts=component.GetFacts();
		for(var i=0;i<facts.length;i++){
			if(String.StartsWith(facts[i].GetPath(),targetPath)){
				targets.push(facts[i]);
			}
		}
		return targets;
	}

	function normalizePath(path){
		var fullPath=[_rootFixture.Name];
		if(path){
			path=path.toString();
			if(path.length>0)fullPath.push(path);
		}
		return fullPath.join('.');
	}
		
	function resolveFixture(path){
		if(path!=undefined){
			if(!Object.IsType(Function,path.toString))throw new Error("xUnit.js.Engine.resolveFixture: 'path' must be convertible to String.");
			path=path.toString();
			if(_pathMap.hasOwnProperty(path)){
				return _pathMap[path];
			}
		}
		return _rootFixture;
	}

	function resolveTargets(path){
		var fixture=resolveFixture(path);
		if(fixture!=_rootFixture)return fixture;
		
		var fullPath=normalizePath(path);
		if(String.Equals(fullPath,fixture.Name))return _rootFixture;
		
		var matches=findMatches(fullPath,_rootFixture);
		if(matches.length){
			if(matches.length==1&&String.Equals(matches[0].GetPath(),fullPath))return matches[0];
			return matches;
		}
		throw new Error(String.Format("xUnit.js.Engine.resolveTargets: 'path' '{0}' does not resolve to any registered targets.",path));
	}

	function updateFixtureMap(path,fixture){
		var targetPath=String.TrimStart([path,fixture.Name].join('.'),'.');
		if(_pathMap.hasOwnProperty(targetPath)){
			if(_pathMap[targetPath]!=fixture){
				if(typeof(console)!="undefined")console.log(String.Format("xUnit.js.Engine.updateFixtureMap: reloading Fixture '{0}'.",targetPath));
			}
		}
		_pathMap[targetPath]=fixture;
	}

	// Predicates
	function nameComparer(fixture,context){
		return Object.Equals(context.Expected,fixture.Name);
	}
	
	function lengthComparer(a,b){
		return b.Name.length-a.Name.length;
	}

	function runDelegate(runnable,context){
		runnable.Run();
	}
	
	// Events
	function Fact_AfterRun(context){
		_events.Fire("AfterRun",context);
	}

	function Fact_BeforeRun(context){
		_events.Fire("BeforeRun",context);
	}

	function Fixture_AfterRun(context){
		if(!Object.IsType(xUnit.js.Model.Fixture,context.Component))return;
		_events.Fire("AfterRun",context);
	}

	function Fixture_BeforeRun(context){
		if(!Object.IsType(xUnit.js.Model.Fixture,context.Component))return;
		_events.Fire("BeforeRun",context);
	}
};

xUnit.js.Engine.Implement(xUnit.js.IRunnable);