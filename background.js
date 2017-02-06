var searchEngines 	= [];
var searchMenu		= [];
var target = browser.tabs;
var openInNewTab = true;
var fileVer = "1.2";
var menuIdPrefix = "openSMI"; //openSearchMenuItem//

function loadDefault()
{
	// id 1 & -1 are reserved //
	searchEngines = [
		{
			id: 		2,
			name: 		"Bing", 
			url: 		"http://www.bing.com/search?q="		
		},
		{
			id: 		3, 
			name: 		"Google", 
			url: 		"https://google.com/search?q="			
		},
		{
			id: 		4,		
			name: 		"DuckDuckGo", 
			url: 		"https://duckduckgo.com/?q="		
		},		
		{
			id:			-2,
			name:		browser.i18n.getMessage("labelMenuAllGroup"),
			members:	"2,3,4"
		}
	]
}

function removeEngines()
{
	searchEngines = [];
	searchMenu = [];
}

function addSearchEngine(id, name, param)
{
	var obj = {id: id, name: name};

	if(id<0)
		obj.members = param;
	else
		obj.url = param;

	searchEngines.push(obj);
}

function addSearchMenu(id)
{
	searchMenu.push(id);
}

function saveOptions()
{	
	browser.storage.local.set({
		se: searchEngines,
		sm: searchMenu,
		fv: fileVer
	});
	updateMenu();
}

browser.storage.local.get(function (item)
{		
	for(var i in item.se)
		searchEngines.push(item.se[i]);
	
	for(var i in item.sm)
		searchMenu.push(item.sm[i]);

	if(searchEngines == undefined || searchEngines.length == 0 || item.fv != fileVer) {
		loadDefault();
	}	
	updateMenu();
});

function getEngine(id)
{
	for(var i=0;i<searchEngines.length;i++) {
		if(searchEngines[i].id == id) return searchEngines[i];
	}
	return {id:0};
}

function createMenu(p)
{
	var gid = menuIdPrefix + "-" + p.contexts[0];
	if( p.parentId ) gid = p.parentId;
	var id = gid + ":" + p.id;

	if( p.id == 0 ) {
		browser.contextMenus.create({	type:		"separator", 
										parentId: 	p.parentId, 
										contexts: 	p.contexts
									});
	}
	else if( p.id == -1 ) {
		browser.contextMenus.create({	title: 		p.title, 
										id: 		gid, 
										contexts: 	p.contexts 
									});
	}
	else if( p.id > 0 ) {
		browser.contextMenus.create({	title: 		p.title,
										id: 		id,
										parentId: 	p.parentId,
										contexts: 	p.contexts 
									}); 
	}
	else {
		browser.contextMenus.create({	title: 		p.title,
										id: 		id,
										parentId:	p.parentId,
										contexts: 	p.contexts
									}); 
		browser.contextMenus.create({	title:		browser.i18n.getMessage("labelSearchAllMenu"),
										id:			gid + "-G:" + p.id,
										parentId: 	id,
										contexts:	p.contexts
									}); 		
		browser.contextMenus.create({	type:		"separator",
										parentId:	id,
										contexts:	p.contexts										 
									}); 
		var members = getEngine(p.id).members.split(",");
		for(var i = 0 ; i < members.length ; i++) {
			var obj = getEngine(members[i]);
			createMenu ({	title: 		obj.name,							
							id:			obj.id,
							parentId:	id,
							contexts:	p.contexts
						})
		}
		
	}
}

function updateMenu()
{
	browser.contextMenus.removeAll();
	var contexts = ["selection","link"];
	var titles = [browser.i18n.getMessage("labelSearchTextMenu"),browser.i18n.getMessage("labelSearchLinkMenu")];
	var parent = menuIdPrefix;

	switch(searchMenu.length) {
	case 0: 
		return;
	case 1: 
		parent = undefined;
		break;
	default:
		for(var i = 0 ; i < contexts.length ; i++) {
			createMenu ({	title: 		titles[i], 
							contexts: 	[contexts[i]], 
							id: 		-1
						});
			titles[i]="";
		}
	}

	for (var i = 0 ; i < searchMenu.length ; i++) {
		var obj = getEngine(searchMenu[i]);
		for(var j = 0 ; j < contexts.length ; j++) {
			var parentId;
			if(parent) parentId = parent + "-" + contexts[j];
			createMenu({	title:		titles[j] + obj.name, 
							contexts: 	[contexts[j]], 
							id: 		obj.id, 
							parentId: 	parentId
					   });
		}		
	}
}

function searchText(id, selText) 
{
	if(selText == undefined || selText == "") return;
	var url = [];
	if( id > 0) {
			url.push(getEngine(id).url + encodeURIComponent(selText));
		}
	else {
		getEngine(id).members.split(",").forEach(function (item, index) {
			url.push(getEngine(item).url + encodeURIComponent(selText));
		});
	}
	for(var i in url)
	{
		target.create({ url: url[i]});
	}
}

browser.contextMenus.onClicked.addListener(function (info, tab) {

	/*if (openInNewTab) {
		target = browser.tabs;
	}*/
	
	if(info.mediaType == "image") {		
		//target.create({ url: "https://www.google.com/searchbyimage?&image_url="+info.srcUrl});
	}
	else {		
		var id = info.menuItemId.substr(info.menuItemId.lastIndexOf(":")+1); //get real item id		
		if(info.selectionText == undefined) {
			browser.tabs.sendMessage(tab.id, {method: "getSelText"}, function(response) {searchText(id,response.data);}); 
		}
		else {
			searchText(id, info.selectionText);
		} 		
	}	
});


/** Experimental !! */
//browser.contextMenus.create({ "title": browser.i18n.getMessage("labelSearchImageMenu"), "id": menuIdPrefix + ":img", "contexts": ["image"] });
/** */