Function.RegisterNamespace("xUnit.js.Gui");

xUnit.js.Gui.Runner=new function(){
	// Private Members
	var _attributeParser;
	var _durations;
	var _engine;
	var _evts;
	var _factList;
	var _fileQueue;
	var _files;
	var _fileInput;
	var _fileList;
	var _formQueue;
	var _output;
	var _selectedOptions;
	var _traitsList;
	
	var _results={
		index:0,
		success:{},
		successCount:0,
		failure:{},
		failureCount:0,
		skipped:{},
		skippedCount:0
	};
	
	var _timers={
		filter:{timeout:500},
		run:{timeout:0}
	}
	
	// ctor
	function Runner(){
		_attributeParser=new System.Script.Attributes.AttributeParser();

		_durations=[];
		
		_evts=new System.Web.Event.EventManager();
		_evts.Add(window,"load",Window_Load);
		_evts.Add(window,"unload",Window_Unload);

		_engine=xUnit.js.Attributes.Engine.Instance;

		System.Script.ScriptLoader.Strategies.Remove(System.Script.ScriptLoadStrategy.Dom);
	}
	Runner.apply(this,arguments);
	
	// Private Methods
	function addNestedFacts(step,context){
		if(Object.IsType(xUnit.js.Model.Fixture,step)){
			Array.ForEach(step.GetFixtures(),addNestedFacts,null,{Items:context.Items,Map:context.Map});
			Array.ForEach(step.GetFacts(),collectItem,mappedItemPredicate,{Items:context.Items,Map:context.Map,Trait:context.Trait});
		}
		if(Object.IsType(xUnit.js.Model.Fact,step)){
			if(mappedItemPredicate(step,context))collectItem(step,{Items:context.Items});
		}
	}

	function addTrait(traitAttribute,context){
		if(!context.Traits[traitAttribute.Trait])context.Traits[traitAttribute.Trait]=[];
		addNestedFacts(context.Step,{Items:context.Traits[traitAttribute.Trait],Map:context.Map,Trait:traitAttribute.Trait});
	}

	function clearFile(file,context){
		removeFacts(file.Facts);
		_files[file.FilePath]=null;
		delete _files[file.FilePath];
		System.Web.Dom.Remove($(String.Format("file_{0}",file.FilePath)));
	}

	function clearFiles(){
		Object.ForEach(_files,clearFile);
		var root=_engine.Get();
		var fixtures=root.GetFixtures();
		while(fixtures.length)root.RemoveFixture(fixtures.pop());
	}
	
	function clearQueues(){
		_fileQueue=[];
		_formQueue=[];
	}

	function collectFacts(file,context){
		if(!context.Items)context.Items=[];
		var facts=null;
		if(context.Traits&&context.Traits.length){
			facts=Object.ForEach(file.Traits,collectTraits,traitedFactPredicate,{Filter:context.Filter,Traits:context.Traits}).Items;
		}else{
			facts=Array.ForEach(file.Facts||[],collectItem,filteredFactPredicate,{Filter:context.Filter}).Items;
		}
		if(facts&&facts.length)context.Items=context.Items.concat(facts);
	}

	function collectFiles(option,context){
		if(option.value==-1){
			context.Cancel=true;
			context.Items=Object.ForEach(_files,collectItem,null,{Items:[]}).Items;
		}else{
			collectItem(_files[option.value],context);
		}
	}
	
	function collectFileTraits(file,context){
		Object.ForEach(file.Traits,collectProperty,null,context);
	}

	function collectItem(item,context){
		if(!context.Items)context.Items=[];
		context.Items.push(item);
	}

	function collectProperty(trait,context){
		if(!context.Map)context.Map={};
		if(!context.Map[context.Name])collectItem(context.Name,context);
		context.Map[context.Name]=true;
	}

	function collectTraits(factArray,context){
		context.Items=Array.ForEach(factArray,collectItem,filteredFactPredicate,{Filter:context.Filter}).Items;
	}

	function collectTraitOptions(option,context){
		if(option.value==-1){
			context.Cancel=true;
			context.Items=Array.ForEach(context.Instance,collectItem,function(){option.value!=-1}).Items;
		}else{
			collectItem(option.text,context);
		}
	}

	function convertCollection(collection){
		var array=[];
		for(var i=0;i<collection.length;i++)array.push(collection[i]);
		return array;
	}

	function ensurePath(fact){
		if(!fact.Path)fact.Path=fact.GetPath().split('.').slice(1).join('.');
		return fact;
	}

	function factCompleted(fact){
		var option=$(String.Format("xunit:gui:run:facts:list:{0}",fact.Path));
		option.className=getStateClassName(fact);
		_results.success[fact.Path]=_results.failure[fact.Path]=_results.skipped[fact.Path]=null;
		switch(fact.State.Result){
			case xUnit.js.Model.Result.Failure:
				setText($("xunit:gui:run:facts:failure:count"),{Text:++_results.failureCount});
				_results.failure[fact.Path]=fact;
				outputFact(fact);
				break;
			case xUnit.js.Model.Result.Skipped:
				setText($("xunit:gui:run:facts:skipped:count"),{Text:++_results.skippedCount});
				_results.skipped[fact.Path]=fact;
				outputFact(fact);
				break;
			case xUnit.js.Model.Result.Success:
				setText($("xunit:gui:run:facts:success:count"),{Text:++_results.successCount});
				_results.success[fact.Path]=fact;
				break;
		}
		if(++_results.index<_selectedOptions.length){
			_timers.run.timer=setTimeout(runFact,0);
		}else{
			System.Web.Style.RemoveClass($("xunit:gui:menu:facts:run"),"Checked");
		}
	}

	function filteredFactPredicate(item,context){
		return !context.Filter||context.Filter.test(item.Path);
	}

	function filterFacts(expected,actual){
		var expectedMap={};
		for(var i=0;i<expected.length;i++)expectedMap[ensurePath(expected[i]).Path]=true;
		for(var i=0;i<actual.length;i++){
			if(expectedMap[ensurePath(actual[i]).Path])actual.splice(i--,1);
		}
		return actual;
	}

	function fireQueues(){
		loadQueuedFiles();
		loadQueuedForms();
	}
	
	function getFile(files,path){
		if(files){
			var names=[];
			for(var i=0;i<files.length;i++){
				// deprecated first
				if(typeof(files[i].getAsText)!="undefined")loadFileText(files[i].name,files[i].getAsText("utf-8"));
				else{
					if(window.FileReader){ //standard async model
						var index=0;
						var reader=new FileReader();
						reader.onload=function(evt){
							if(index>=files.length)return;
							loadFileText(files[index].name,evt.target.result);
							reader.readAsText(files[index++]);
						}
						reader.readAsText(files[index]);
						break;
					}else{ // IIS attempt
						names.push(files[i].name);
					}
				}
			}
			if(names.length){ // IIS attempt
				var uploadFrame=$("xunit:file:upload:frame");
				uploadFrame.onload=Function.GetDelegate(function(name){
					loadFileText(name,this.contentWindow.document.body.textContent);
				},uploadFrame,names.sort().join(', '));
				_fileInput.parentNode.submit();
			}
		}else{
			var uploadFrame=$("xunit:file:upload:frame");
			uploadFrame.onload=Function.GetDelegate(function(){
				loadFileText(String.TrimStart(_fileInput.value,"C:\\fakepath\\"),this.contentWindow.document.body.textContent);
			},uploadFrame);
			_fileInput.parentNode.submit();
// DEPRECATED - OLD IE WAY PRE-SECURITY
//			try{
//				path=System.IO.Path.GetFullPath(path);
//				if(!System.IO.File.Exists(path))return;
//				loadFileText(path,System.IO.File.GetFile(path));
//			}catch(e){
//				alert(String.Format("Unable to retrieve '{0}'. Please check your local file access permissions.",path));
//			}
		}
	}

	function getSelectedFactOptions(){
		var facts=convertCollection(_factList.options);
		return Array.ForEach(facts,collectItem,_factList.selectedIndex>-1&&optionSelectedPredicate||null,{Items:[]}).Items;
	}

	function getSelectedFacts(files,traits,filter){
		return Object.ForEach(files,collectFacts,null,{Filter:filter,Traits:traits,Items:[]}).Items;
	}

	function getSelectedFiles(){
		if(_fileList.selectedIndex<0)_fileList.selectedIndex=0;
		var files=Array.ForEach(convertCollection(_fileList.options),collectFiles,optionSelectedPredicate).Items;
		return files;
	}

	function getSelectedTraits(){
		var traitsList=$("xunit:gui:filters:traits:list");
		if(traitsList.selectedIndex<0)traitsList.selectedIndex=0;
		var traits=Array.ForEach(convertCollection(traitsList.options),collectTraitOptions,optionSelectedPredicate).Items;
		return traits;
	}

	function getStateClassName(fact){
		var results=xUnit.js.Model.Result;
		switch(fact.State.Result){
			case results.Failure:
				return "Failure";
			case results.Skipped:
				return "Skipped";
			case results.Success:
				return "Success";
		}		
	}

	function getTraits(fact,context){
		var step=fact;
		if(!context.Map)context.Map={};
		while(step){
			if(step.Method&&Object.IsType(Function,step.Method.GetDecoration)){
				traitAttributes=step.Method.GetDecoration().GetAttributes(xUnit.js.Attributes.TraitAttribute);
				Array.ForEach(traitAttributes,addTrait,null,{Map:context.Map,Step:step,Traits:context.Traits});
			}
			step=step.Parent;
		}
	}

	function loadFact(fact,context){
		var className='';
		var filters={
			Success:$("xunit:gui:run:facts:filters:success"),
			Failure:$("xunit:gui:run:facts:filters:failure"),
			Skipped:$("xunit:gui:run:facts:filters:skipped")
		};
		var checked=false;
		for(var x in filters){
			if(filters[x].checked){
				if(_results[x.toLowerCase()][fact.Path]){
					className=x;
					checked=false;
					break;
				}
				checked=true;
			}else{
				if(_results[x.toLowerCase()][fact.Path])className=x;
			}
		}
		if(checked)return;
		if(fact.State.Result!=xUnit.js.Model.Result.Success)outputFact(fact);
		var id=String.Format("xunit:gui:run:facts:list:{0}",fact.Path);
		System.Web.Dom.CreateElement(_factList,{id:id,className:className,innerHTML:fact.Path,title:fact.Path,value:fact.Path},"option");
	}	

	function loadFacts(facts){
		System.Web.Dom.ClearContent(_factList);
		System.Web.Dom.ClearContent(_output);
		facts.sort(propertySorter("Path"));
		Array.ForEach(facts,loadFact);
		_selectedOptions=getSelectedFactOptions();
	}

	function loadFile(path,context){
		var file=_files[path];
		var fileOption=System.Web.Dom.CreateElement(_fileList,{id:String.Format("file_{0}",file.FilePath),innerHTML:System.IO.Path.GetFileName(file.FilePath),title:file.FilePath,value:file.FilePath},"option");
	}

	function loadFiles(){
		while(_fileList.options.length>1)System.Web.Dom.Remove(_fileList.options[1]);
		var files=Object.ForEach(_files,collectProperty).Items.sort();
		Array.ForEach(files,loadFile);
		loadTraits();
		loadFilters();
	}
	
	function loadFileText(path,text){
		var scriptText=_attributeParser.Parse(text);
		var facts=_engine.Enumerate();
		System.Script.ScriptLoader.Load(scriptText);
		facts=filterFacts(facts,_engine.Enumerate());
		var traits=Array.ForEach(facts,getTraits,null,{Traits:{}}).Traits;
		_files[path]={
			Facts:facts,
			FilePath:path,
			Traits:traits,
			Text:scriptText
		};
		loadFiles();
	};

	function loadFilters(){
		// build freeform filter
		var filter=new RegExp($("xunit:gui:filters:search:input").value,"gi");
		
		// find selected files
		var files=getSelectedFiles();
		
		// find selected traits
		var traits=getSelectedTraits();

		// find facts of selected files, traits, and filter, matched by last run.
		var facts=getSelectedFacts(files,traits,filter);

		System.Web.Dom.SetText($("xunit:gui:run:facts:count"),String.Format("({0})",facts.length));
		
		loadFacts(facts);
	}

	function loadQueuedFiles(){
		if(_fileQueue.length){
			var index=0;
			var reader=new FileReader();
			reader.onload=function(evt){
				loadFileText(_fileQueue[index].name,evt.target.result);
				if(index+1<_fileQueue.length)reader.readAsText(_fileQueue[index++]);
			}
			reader.readAsText(_fileQueue[index]);
		}
	}

	function loadQueuedForms(){
		if(_formQueue.length){
			var index=0;
			$("xunit:file:upload:frame").onload=function(){
				loadFileText(_formQueue[index].getAttribute("FileNames"),this.contentWindow.document.body.textContent);
				if(index+1<_formQueue.length)_formQueue[index++].submit();
			};
			_formQueue[index].submit();
		}
	}
		
	function loadTrait(trait,context){
		System.Web.Dom.CreateElement(_traitsList,{innerHTML:trait,title:trait,value:trait},"option");
	}

	function loadTraits(){
		while(_traitsList.options.length>1)System.Web.Dom.Remove(_traitsList.options[1]);
		var files=getSelectedFiles();
		var traits=Array.ForEach(files,collectFileTraits,null,{Items:[]}).Items.sort();
		Array.ForEach(traits,loadTrait);
	}

	function mappedItemPredicate(fact,context){
		if(context.Map){
			if(!context.Map[context.Trait])context.Map[context.Trait]={};
			if(context.Map[context.Trait][fact.Path])return false;
			context.Map[context.Trait][fact.Path]=true;
			return true;
		}
		return true;
	}

	function matchFormPredicate(form,context){
		if(form.files){
			for(var i=0;i<form.files.length;i++)if(form.files[i].name==context.File.FilePath)return true;
			return false;
		}else{
			return form.elements[0].value==context.File.FilePath;
		}
	}

	function outputFact(fact,context){
		if(context)fact=_engine.Get(fact.value);
		if(fact&&fact.State&&fact.State.Message){
			var message=System.Web.Dom.CreateElement(_output,{className:getStateClassName(fact)})
			System.Web.Dom.AppendText(message,String.Format("{0}: {1}\r\r",fact.Path,fact.State.Message));
			if(context&&context.Instance.length==1){
				var method=System.Web.Dom.CreateElement(_output,{className:"Code"});
				System.Web.Dom.AppendText(method,fact.Method);
			}
		}
	}

	function optionSelectedPredicate(option,context){
		return !!option.selected;
	}

	function propertySorter(property){
		return function(a,b){
			if(a&&b){
				if(a[property]>b[property])return 1;
				if(b[property]>a[property])return -1;
			}
			return 0;
		}
	}

	function px(value){
		if(isNaN(value))return "auto";
		return String.Format("{0}px",value);
	}	

	function queueReloadFile(file){
		_fileQueue.push(file);
	}

	function queueReloadForm(names,form){
		form.setAttribute("FileNames",names);
		_formQueue.push(form);
	}

	function reloadFile(form,context){
		var fileInput=form.elements[0];
		var files=fileInput.files;
		if(files){
			var names=[];
			for(var i=0;i<files.length;i++){
				if(form.deletedMap&&form.deletedMap[files[i].name])continue;
				// deprecated first
				if(typeof(files[i].getAsText)!="undefined")loadFileText(files[i].name,files[i].getAsText("utf-8"));
				else{
					if(window.FileReader){ //standard async model
						queueReloadFile(files[i]);
					}else{ // IIS attempt
						names.push(files[i].name);
					}
				}
			}
			if(names.length){ // IIS attempt
				queueReloadForm(names,form);
			}
		}else{
			try{
				var path=System.IO.Path.GetFullPath(fileInput.value);
				if(!System.IO.File.Exists(path))return;
				loadFileText(path,System.IO.File.GetFile(path));
			}catch(e){
				alert(String.Format("Unable to retrieve '{0}'. Please check your local file access permissions.",path));
			}
		}
	}

	function reloadFiles(){
		clearFiles();
		clearQueues();
		Array.ForEach(convertCollection(document.forms),reloadFile);
		fireQueues();
	}

	function removeFact(fact,context){
		var fixture=_engine.Get(fact.Path.replace(new RegExp(String.Format(".{0}$",fact.Name)),''));
		fixture.RemoveFact(fact);
	}

	function removeFacts(facts){
		Array.ForEach(facts,removeFact);
	}

	function removeFile(file,context){
		clearFile(file,context);
		Array.ForEach(convertCollection(document.forms),System.Web.Dom.Remove,matchFormPredicate,{File:file});
	}
		
	function resizeLayout(resizing){
		var screenDims=[
			document.documentElement.clientWidth||document.documentElement.offsetWidth||document.body.offsetWidth,
			document.documentElement.clientHeight||document.documentElement.offsetHeight||document.body.offsetHeight
		];
		var components={
			menu:$("xunit:gui:menu"),
			filters:$("xunit:gui:filters"),
			run:$("xunit:gui:run"),
			freeform:$("xunit:gui:filters:search"),
			freeformLabel:$("xunit:gui:filters:search:label"),
			freeformInput:$("xunit:gui:filters:search:input"),
			files:$("xunit:gui:filters:files"),
			filesList:$("xunit:gui:filters:files:list"),
			traits:$("xunit:gui:filters:traits"),
			traitsList:$("xunit:gui:filters:traits:list"),
			runFilter:$("xunit:gui:run:facts:filters"),
			facts:$("xunit:gui:run:facts"),
			output:$("xunit:gui:run:output")
		}
		var magicOffsets={
			FF:[35,50,36,60,5,32],
			IEOld:[30,68,22,45,0,30],
			IE:[30,54,45,45,0,28],
			Opera:[35,50,36,60,5,31],
			WebKit:[35,50,36,60,5,31]
		}
		var offsets=null;
		for(var x in magicOffsets){
			if(System.Web.Style.HasClass(document.documentElement,x)){
				offsets=magicOffsets[x];
				break;
			}
		}
		var frameHeight=screenDims[1]-components.menu.offsetHeight-offsets[0];
		var runWidth=screenDims[0]-components.filters.offsetWidth-offsets[1];
		var filesHeight=Math.max(frameHeight-components.freeform.offsetHeight-components.traits.offsetHeight-offsets[2],100);
		var factsHeight=Math.max(frameHeight-components.runFilter.offsetHeight-components.output.offsetHeight-offsets[3],100);
		Object.Set(components.filters,{style:{height:px(frameHeight)}});
		Object.Set(components.freeformInput,{style:{width:px(components.filters.offsetWidth-components.freeformLabel.offsetWidth-offsets[5])}});
		Object.Set(components.run,{style:{height:px(frameHeight),width:px(runWidth)}});
		Object.Set(components.files,{style:{height:px(filesHeight)}});
		Object.Set(components.filesList,{style:{height:px(filesHeight),width:px(components.filters.offsetWidth-20)}});
//		Object.Set(components.traitsList,{style:{height:"auto"}});
//		Object.Set(components.traitsList,{style:{height:px(components.traits.offsetHeight),width:px(components.filters.offsetWidth-20)}});
		Object.Set(components.facts,{style:{height:px(factsHeight),width:px(runWidth)}});
		Object.Set(components.output,{style:{width:px(runWidth-offsets[4])}});
	}
	
	function runFact(item,context){
		if(_timers.run.timer)clearTimeout(_timers.run.timer);
		if(_globalStop)return;
		if(!_selectedOptions[_results.index])return;
		_engine.Run(_selectedOptions[_results.index].value||_selectedOptions[_results.index].Path);
	}
	
	function setBrowserClass(){
		var className='';
		var userAgent=typeof(navigator)!="undefined"&&navigator.userAgent;
		if(String.Contains(userAgent,"AppleWebKit")){
			className="WebKit";
			if(String.Contains(userAgent,"Chrome"))className=String.Format("{0} Chrome",className);
			if(String.Contains(userAgent,"Safari"))className=String.Format("{0} Safari",className);
		}
		if(String.Contains(userAgent,"Firefox"))className="FF";
		if(String.Contains(userAgent,"Opera"))className="Opera";
		var msIE="MSIE ";
		if(String.Contains(userAgent,msIE)){
			className="IE";
			var index=userAgent.indexOf(msIE)+msIE.length;
			var version=parseInt(userAgent.substring(index));
			if(!isNaN(version)){
				className=String.Format("{0} IE{1}",className,version);
				if(version<7)className=String.Format("{0} IEOld",className);
			}			
		}
		System.Web.Style.AddClass(document.documentElement,className);
	}

	function setFileInput(){
		var form=System.Web.Dom.CreateElement($("xunit:gui:menu"),{className:"UploadForm",enctype:"multipart/form-data",method:"post",action:xUnit.js.Gui.UploadUri,enctype:"multipart/form-data",target:"UploadFrame"},"form");
		System.Web.Style.RemoveClass(_fileInput,"FileInput");
		_fileInput=System.Web.Dom.CreateElement(form,{className:"FileInput",multiple:"multiple",name:"FileInput",type:"file"},"input");
		_evts.Add(_fileInput,"blur",FileInput_Blur);
		_evts.Add(_fileInput,"click",FileInput_Click);
		_evts.Add(_fileInput,"focus",FileInput_Focus);
		_evts.Add(_fileInput,"mouseover",FileInput_MouseOver);
		_evts.Add(_fileInput,"mouseout",FileInput_MouseOut);
		setTimeout(Function.GetDelegate(System.Web.Dom.Focus,System.Web.Dom,_fileInput,false),1);
	}

	function setText(elt,context){
		System.Web.Dom.SetText(elt,context.Text);
	}
	
	function stopRun(){
		System.Web.Style.RemoveClass($("xunit:gui:menu:facts:run"),"Checked");
		_globalStop=true;
	}

	function traitedFactPredicate(item,context){
		for(var i=0;i<context.Traits.length;i++){
			if(context.Name.toLowerCase()==context.Traits[i].toLowerCase())return true;
		}
		return false;
	}

	function $(key){
		return document.getElementById(key);
	}
	
	// Events
	function setEvents(){
		_evts.Add(window,"resize",Window_Resize);

		_evts.Add(document,"keyup",Document_KeyDown);

		_evts.Add($("xunit:gui:menu:file:add"),"click",FileAdd_Click);
		_evts.Add($("xunit:gui:menu:file:remove"),"click",FileRemove_Click);
		_evts.Add($("xunit:gui:menu:facts:reload"),"click",FactReload_Click);
		_evts.Add($("xunit:gui:menu:facts:run"),"click",FactRun_Click);
		_evts.Add($("xunit:gui:menu:facts:stop"),"click",FactStop_Click);

		_evts.Add($("xunit:gui:run:facts:filters:success"),"click",Button_Toggle);
		_evts.Add($("xunit:gui:run:facts:filters:failure"),"click",Button_Toggle);
		_evts.Add($("xunit:gui:run:facts:filters:skipped"),"click",Button_Toggle);

		_evts.Add($("xunit:gui:filters:search:input"),"keyup",Filter_KeyUp);
		_evts.Add(_factList,"change",FactsList_Change);
		_evts.Add(_fileList,"change",FileList_Change);
		_evts.Add(_traitsList,"change",TraitsList_Change);
		
		_engine.Events.Add("AfterRun",Component_AfterRun);
		_engine.Events.Add("BeforeRun",Component_BeforeRun);
	}

	function Button_Toggle(e){
		var target=e.target||e.srcElement;
		target.checked=!target.checked;
		System.Web.Style[target.checked?"AddClass":"RemoveClass"](target,"Checked");
		loadFilters();
	}	

 	function Component_BeforeRun(context){
		if(_globalStop)context.Cancel=true;
		_durations.push(new Date());
	}

	function Component_AfterRun(context){
		if(Object.IsType(xUnit.js.Model.Fact,context.Component)){
			factCompleted(context.Component,new Date()-_durations.pop());
		}
	}
	
	function Document_KeyDown(e){
		var key=e.which||e.keyCode;
		switch(key){
			case 19:
				FactStop_Click(e);
				_evts.Kill(e);
				break;
			case 65:
				if(e.shiftKey&&e.ctrlKey)FileAdd_Click(e);
				_evts.Kill(e);
				break;
			case 69:
				if(e.shiftKey&&e.ctrlKey)FactReload_Click(e);
				_evts.Kill(e);
				break;
			case 88:
				if(e.shiftKey&&e.ctrlKey)FactRun_Click(e);
				_evts.Kill(e);
				break;
			case 83:
				if(e.shiftKey&&e.ctrlKey)FactStop_Click(e);
				_evts.Kill(e);
				break;
			case 90:
				if(e.shiftKey&&e.ctrlKey)FileRemove_Click(e);
				_evts.Kill(e);
				break;
			default:
				break;
		}
	}

	function FactReload_Click(e){
		reloadFiles();
		_evts.Kill(e);
	}

	function FactRun_Click(e){
		_globalStop=false;
		_results.index=_results.successCount=_results.failureCount=_results.skippedCount=0;
		var labels=[
			$("xunit:gui:run:facts:success:count"),
			$("xunit:gui:run:facts:failure:count"),
			$("xunit:gui:run:facts:skipped:count")			
		];
		Array.ForEach(labels,setText,null,{Text:0});
		System.Web.Dom.ClearContent(_output);
		System.Web.Style.AddClass($("xunit:gui:menu:facts:run"),"Checked");
		runFact();
		_evts.Kill(e);
	}

	function FactStop_Click(e){
		stopRun();
		_evts.Kill(e);
	}

	function FactsList_Change(e){
		System.Web.Dom.ClearContent(_output);
		_selectedOptions=getSelectedFactOptions();
		Array.ForEach(_selectedOptions,outputFact);
	}

	function FileAdd_Click(e){
		if(_fileInput.click&&!System.Web.Style.HasClass(document.documentElement,"FF"))_fileInput.click();
		else alert("Keyboard file input access is not available in this host environment.");
		_evts.Kill(e);
	}

	function FileInput_Blur(e){
		System.Web.Style.RemoveClass($("xunit:gui:menu:file:add"),"Focused");
	}

	function FileInput_Click(e){
		stopRun();
		var val=_fileInput.value;
		step();
		function step(){
			if(_fileInput&&_fileInput.value!=val){
				getFile(_fileInput.files,_fileInput.value);
				setFileInput();
			}else setTimeout(step,50);
		}
	}

	function FileInput_Focus(e){
		System.Web.Style.AddClass($("xunit:gui:menu:file:add"),"Focused");
	}

	function FileInput_MouseOut(e){
		System.Web.Style.RemoveClass($("xunit:gui:menu:file:add"),"Hover");
	}

	function FileInput_MouseOver(e){
		System.Web.Style.AddClass($("xunit:gui:menu:file:add"),"Hover");
	}

	function FileRemove_Click(e){
		var files=getSelectedFiles();
		Array.ForEach(files,removeFile);		
		loadTraits();
		loadFilters();
		_evts.Kill(e);
	}

	function Filter_KeyUp(e){
		if(_timers.filter.timer)clearTimeout(_timers.filter.timer);
		_timers.filter.timer=setTimeout(loadFilters,_timers.filter.timeout);
	}

	function FileList_Change(e){
		loadTraits();
		loadFilters();
	}

	function TraitsList_Change(e){
		loadFilters();
	}

	function Window_Load(e){
		_files={};
		_fileList=$("xunit:gui:filters:files:list");
		_factList=$("xunit:gui:run:facts:list");
		_traitsList=$("xunit:gui:filters:traits:list");
		_output=$("xunit:gui:run:output:outputlist");

		setBrowserClass();
		setFileInput();
		setEvents();
		resizeLayout(false);
	}
	
	function Window_Resize(e){
		resizeLayout(true);
	}

	function Window_Unload(e){
		_evts.Dispose();
		for(var x in _timers)if(_timers[x].timer)clearTimeout(_timers[x].timer);		
		_attributeParser=_durations=_engine=_evts=_factList=_files=_fileInput=_fileList=_output=_selectedOptions=_traitsList=null;
		_results.success=_results.failure=_results.skipped=null;
	}
};
