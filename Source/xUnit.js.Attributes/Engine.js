Function.RegisterNamespace("xUnit.js.Attributes");

xUnit.js.Attributes.Engine=function(){
	// Private members
	var _currentPath;
	var _events;
	var _skipped;
	
	// ctor
	function Engine(){
		this.base();
		_currentPath=[];
		_skipped=[];
	}
	Engine.apply(this,arguments);
	
	// Public methods
	this.Enumerate=function(target,trait,negativeTrait){
		if(target!=undefined&&!Object.IsType(Function,target.toString))throw new Error("xUnit.js.Attributes.Engine.Enumerate: 'target' must be convertible to String.");
		if(trait!=undefined&&!Object.IsType(Function,trait.toString))throw new Error("xUnit.js.Attributes.Engine.Enumerate: 'trait' must be convertible to String.");
		if(negativeTrait!=undefined&&!Object.IsType(Function,negativeTrait.toString))throw new Error("xUnit.js.Attributes.Engine.Enumerate: 'negativeTrait' must be convertible to String.");
		target=(target||'').toString();
		trait=(trait||'').toString();
		negativeTrait=(negativeTrait||'').toString();
		var traits=null;
		var targets=null;
		if(trait.length>0){
			targets=getTargets(this,target);
			traits=Array.ForEach(targets,findTraits,null,{Expand:true,Trait:trait,Traits:[]}).Traits;
		}
		if(negativeTrait.length>0){
			if(traits!=null){
				traits=Array.ForEach(traits,addTrait,matchNegativeTrait,{Trait:negativeTrait,Traits:[]}).Traits;
			}else{
				if(!targets)targets=getTargets(this,target);
				traits=Array.ForEach(targets,findTraits,null,{Expand:true,IsNegativeMatch:true,Trait:negativeTrait,Traits:[]}).Traits;
			}
		}
		if(traits)return traits;
		if(target.length>0)return getTargets(this,target);
		return this.base.Enumerate();
	};
	
	this.InstantiateFixture=function(fixture){
		_currentPath.push(fixture.Name);
		instantiateFixture(fixture.Method);
		_currentPath.pop();
	}
	
	this.RegisterFixture=function(targetMethod){
		if(!Object.IsType(Function,targetMethod))throw new Error("xUnit.js.Attributes.Engine.RegisterFixture: 'targetMethod' must be a valid Function pointer.");
		var name=getName(targetMethod);
		var fixture=new xUnit.js.Attributes.Model.Fixture(name,null,targetMethod);
		this.base.RegisterFixture(fixture,_currentPath.join('.'));
		return fixture;
	};

	this.RegisterFact=function(targetMethod){
		if(!Object.IsType(Function,targetMethod))throw new Error("xUnit.js.Attributes.Engine.RegisterFact: 'targetMethod' must be a valid Function pointer.");
		var fact=new xUnit.js.Model.Fact(targetMethod,getName(targetMethod));
		this.base.RegisterFact(fact,_currentPath.join('.'));
		return fact;
	};
	
	this.Run=function(target,trait,negativeTrait){
		markSkippedComponents(this);
		if(trait!=undefined||negativeTrait!=undefined){
			Array.ForEach(this.Enumerate(target,trait,negativeTrait),runTrait);
		}else{
			if(target!=undefined&&!Object.IsType(Function,target.toString))throw new Error("xUnit.js.Attributes.Engine.Run: 'target' must be convertible to String.");
			target=(target||'').toString();
			if(target.length>0){
				var targets=target.split(',');
				for(var i=0;i<targets.length;i++){
					var currentTarget=String.Trim(targets[i]);
					if(currentTarget.length>0)this.base.Run(currentTarget);
				}
			}else{
				this.base.Run();
			}
		}
	};
	
	this.Skip=function(targetMethod,reason){
		if(!Object.IsType(Function,targetMethod))throw new Error("xUnit.js.Attributes.Engine.Skip: 'targetMethod' must be a valid Function pointer.");
		var name=getName(targetMethod);
		var path=_currentPath.slice(0);
		path.push(name);
		_skipped.push({
			Path:path.join('.'),
			Reason:reason
		});
	};
	
	// Privates
	function getName(targetMethod){
		var decoration=null;
		var target=targetMethod;
		if(Object.IsType(Function,target.GetDecoration)){
			decoration=target.GetDecoration();
			if(Object.IsType(Function,decoration&&decoration.GetMethod))target=decoration.GetMethod();
		}
		return String.Trim(decoration&&decoration.Name||Function.GetName(target));
	}
	
	function getTargets(engine,target){
		var targets=target.split(',');
		var targetComponents=[];
		for(var i=0;i<targets.length;i++){
			targetComponents=targetComponents.concat(engine.Get(targets[i]));
		}
		return targetComponents;			
	}
	
	function instantiateFixture(target){
		try{
			target();
		}catch(e){
			throw new Error(String.Format("xUnit.js.Attributes.Engine.instantiate: unable to instantiate the targeted fixture '{0}'. Error: '{1}'",Function.GetName(target),e));
		}
	}
	
	function markSkippedComponents(engine){
		Array.ForEach(_skipped,markSkipped,null,{Engine:engine});
	}
	
	//Predicates
	function addFixtures(fixture,context){
		Array.ForEach(fixture.GetFixtures(),addFixtures,null,{Traits:context.Traits});			
		Array.ForEach(fixture.GetFacts(),addTrait,null,{Traits:context.Traits});			
	}

	function addModel(model,context){
		if(Object.IsType(xUnit.js.Model.Fixture,model)){
			addFixtures(model,context);
		}else{
			addTrait(model,context);
		}
	}

	function addTrait(fact,context){
		if(Object.IsType(Array,context&&context.Traits))context.Traits.push(fact);
	}

	function findTraits(model,context){
		var traitContext={IsNegativeMatch:context.IsNegativeMatch,Trait:context.Trait,Traits:context.Traits};
		if(matchTrait(model,context)){
			if(!context.IsNegativeMatch){
				addModel(model,context);
			}
		}else{
			if(Object.IsType(xUnit.js.Model.Fixture,model)){
				Array.ForEach(model.GetFixtures(),findTraits,null,traitContext);
				Array.ForEach(model.GetFacts(),findTraits,null,traitContext);
			}else{
				if(context.IsNegativeMatch){
					addModel(model,context);
				}
			}
		}
		return context.Traits;
	}
		
	function markSkipped(skip,context){
		var components=context.Engine.Get(skip.Path);
		if(!Object.IsType(Array,components))components=[components];
		Array.ForEach(components,skipComponent,null,{Reason:skip.Reason});
	}

	function matchNegativeTrait(model,context){
		while(model){
			if(matchTrait(model,context))return false;
			model=model.Parent;
		}
		return true;
	}

	function matchTrait(model,context){
		var traitAttributes=null;
		if(Object.IsType(xUnit.js.Attributes.Model.Fixture,model)||Object.IsType(xUnit.js.Model.Fact,model)){
			traitAttributes=model.Method.GetDecoration().GetAttributes(xUnit.js.Attributes.TraitAttribute);
			var traits=context.Trait.split(',');
			for(var i=0;i<traitAttributes.length;i++){
				for(var j=0;j<traits.length;j++){
					if(String.Equals(String.Trim(traits[j]),traitAttributes[i].Trait))return true;
				}
			}
		}
		return false;
	}
	
	function runTrait(fact,context){
		fact.Run();
	}

	function skipComponent(component,context){
		if(component)component.Skip(context.Reason);
	}
};

xUnit.js.Attributes.Engine.Inherit(xUnit.js.Engine,'xUnit.js.Attributes.Engine');

xUnit.js.Attributes.Engine.Instance=new function(){
	return new xUnit.js.Attributes.Engine();
};