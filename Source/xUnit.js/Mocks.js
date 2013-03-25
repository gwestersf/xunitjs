Function.RegisterNamespace("xUnit.js");

xUnit.js.Mocks=new function(){
	// Public methods
	this.GetMock=function(target,member,mockery){
		if(!target)throw new Error("xUnit.js.Mock.GetMock: 'target' must be a valid Object.");
		if(!Object.IsType(String,member)||member.length==0)throw new Error("xUnit.js.Mock.GetMock: 'member' must be a valid String.");
		var mockeries={};
		mockeries[member]=mockery;
		return this.GetMocks(target,mockeries);		
	};

	this.GetMocks=function(target,mockeries){
		if(!target)throw new Error("xUnit.js.Mock.GetMocks: 'target' must be a valid Object.");
		if(!Object.IsType(Object,mockeries))throw new Error("xUnit.js.Mock.GetMock: 'mockeries' must be a valid Object containing member to mock mappings.");
		return function Mockery(during,argument1,argument2,argumentN){
			if(!Object.IsType(Function,during))throw new Error("xUnit.js.Mock.Mockery: 'during' must be a valid Function pointer.");
			var mockTargets=Object.Copy({},target,mockeries);
			try{
				for(var member in mockeries){
					var mockery=mockeries[member];
					var mocked=mockTargets[member];
					if(mockery)mockery.Mocked=Object.IsType(Function,mocked)?Function.GetDelegate(mocked,target):mocked;
					target[member]=mockery;
				}
				return during.apply(target,Array.prototype.slice.call(arguments,1));
			}catch(e){
				throw e;
			}finally{
				for(var member in mockeries){
					var mockery=mockeries[member];
					if(mockery)delete mockery.Mocked;
					target[member]=mockTargets[member];
				}
			}
		};
	};
};