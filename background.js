var searchEngines 	= [];
var searchMenu		= [];
var target = browser.tabs;
var openInNewTab = true;
var fileVer = "1.2";
var menuIdPrefix = "openSMI"; //openSearchMenuItem

//

function loadDefault()
{
	searchEngines = [
		{
			id: 		1, 
			name: 		"Google", 
			url: 		"https://google.com/search?q="			
		},
		{
			id: 		2,
			name: 		"Bing", 
			url: 		"http://www.bing.com/search?q="		
		},
		{
			id: 		3,
			name: 		"Yahoo", 
			url: 		"https://search.yahoo.com/search?p=", 			
		},
		{
			id: 		4,		
			name: 		"Filmweb", 
			url: 		"http://www.filmweb.pl/search?q="		
		},
		{
			id: 		-1,
			name:		"Films",
			members:	"1,4"
		},
		{
			id:			-2,
			name:		"Global",
			members:	"1,2,3"
		}
	]
}

function removeEngines()
{
	searchEngines = [];
	searchMenu = [];
}

function addSearchEngine(id,name,param)
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
	console.log("Saving...");
	//alert(fileVer);
	browser.storage.local.set({
		se: searchEngines,
		sm: searchMenu,
		fv: fileVer
	});
	console.log(searchEngines);
	updateMenu();
}

browser.storage.local.get(function (item)
{		
	for(var i in item.se)
		searchEngines.push(item.se[i]);
	
	for(var i in item.sm)
		searchMenu.push(item.sm[i]);

	if(searchEngines == undefined || searchEngines.length == 0 || item.fv != fileVer)
	{
		loadDefault();
	}	
	updateMenu();
});

function getEngine(id)
{
	for(var i=0;i<searchEngines.length;i++)
	{
		if(searchEngines[i].id == id) return searchEngines[i];
	}
}


function createMenu(title, id, contexts, parentId) 
{
	var gid = menuIdPrefix+":"+id; 
	if(parentId) gid = parentId+":"+id; 
	if(id<0) {
		
		browser.contextMenus.create({ "title": title, "id": gid, "contexts": contexts, parentId: parentId}); 
		browser.contextMenus.create({ "title": browser.i18n.getMessage("menuItemUseAll"), "id": menuIdPrefix+"G:"+id, "contexts": contexts, parentId: gid }); 		
		browser.contextMenus.create({ "type": "separator", "contexts": contexts, parentId: gid }); 
		var members = getEngine(id).members.split(",");
		for(var i=0;i<members.length;i++) {
			var obj = getEngine(members[i]);
			createMenu(obj.name,obj.id,contexts, gid);	
		}

	}		
	else if(id > 0) {
		browser.contextMenus.create({ "title": title, "id": gid, "contexts": contexts, parentId: parentId }); //openSeachEngine - Menu
	}
	/*
	else {
		browser.contextMenus.create({"type":"separator", "parentId": parentId, "contexts": contexts});
	}*/
}

function updateMenu()
{
	browser.contextMenus.removeAll();
	var contexts = ["selection"];
	/** Experimental !! */
	browser.contextMenus.create({ "title": browser.i18n.getMessage("menuItemSearchGoogleImage"), "id": menuIdPrefix + ":img", "contexts": ["image"] });
	
	/** */

	if(searchMenu.length == 1) {
		var obj = getEngine(searchMenu[0]);
		createMenu(browser.i18n.getMessage("menuItemSearchWith") + " " + obj.name, obj.id, contexts);
	}
	else if( searchMenu.length > 1) {
		browser.contextMenus.create({"title": browser.i18n.getMessage("menuItemSearchWith"),"id": menuIdPrefix, "contexts": contexts });
		for (var i = 0 ; i < searchMenu.length ; i++)
		{
			if(searchMenu[i]) {
				var obj = getEngine(searchMenu[i]);
				createMenu(obj.name, obj.id, contexts, menuIdPrefix);
			}
			else browser.contextMenus.create({"type":"separator", "parentId": menuIdPrefix, "contexts": contexts});
	}
}
	else return;
}

browser.contextMenus.onClicked.addListener(function (info, tab) {
	//todo: search selected text in links ....
	
	var url = [];
	
	if (openInNewTab)
	{
		target = browser.tabs;
	}
	
	if(info.mediaType === "image") //temp...
	{
		url.push("https://www.google.com/searchbyimage?&image_url="+info.srcUrl);
	}
	else
	{		
		
		var id = info.menuItemId.substr(info.menuItemId.lastIndexOf(":")+1); //get real item id
		
		if( id > 0) {
			url.push(getEngine(id).url + encodeURIComponent(info.selectionText));
		}
		else {
			getEngine(id).members.split(",").forEach(function (item, index) {
				url.push(getEngine(item).url + encodeURIComponent(info.selectionText));
			});
		}
	}
	
	for(var i in url)
	{
		target.create({ url: url[i]});
	}
});