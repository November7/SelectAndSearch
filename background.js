var searchEngines = [];	
var target = browser.windows;
var openInNewTab = true;

function loadDefault()
{
	searchEngines = [
	{
		id: 		1, 
		type:		0,
		active: 	true,
		useSearch: 	true,
		name: 		"Google", 
		url: 		"https://google.com/search?q="			
	},
	{
		id: 		2,
		type:		0,
		active: 	false,
		useSearch: 	true,
		name: 		"Filmweb", 
		url: 		"http://www.filmweb.pl/search?q="			
	},
	{
		id: 		3, 
		type:		0,
		active: 	false,
		useSearch: 	true,
		name: 		"Yahoo", 
		url: 		"https://search.yahoo.com/search?p=", 			
	},
	{
		id: 		4,
		type:		0,		
		active: 	false,
		useSearch: 	true,
		name: 		"Bing", 
		url: 		"http://www.bing.com/search?q="
		
	}];	
}

function addSearchEngine(id,name,url,active,useSearch,type)
{
	searchEngines.push({id: id, 
						name: name,
						url: url,
						active: active,
						useSearch: useSearch,
						type: type});
}

function saveOptions()
{
//	console.log("Saving...");
	browser.storage.local.set({list: searchEngines});
//	console.log(searchEngines);
	updateMenu();
}

function updateMenu()
{
	browser.contextMenus.removeAll();
	var contexts = ["selection"];
	var activeEngines = [];
	for (var i = 0 ; i < searchEngines.length ; i++)
	{
		if(searchEngines[i].active) 
			activeEngines.push({id: searchEngines[i].id, name: searchEngines[i].name, url: searchEngines[i].url});
	}

	if (!activeEngines.length) return;
	else if (activeEngines.length == 1)
	{            
		browser.contextMenus.create({ "title": browser.i18n.getMessage("menuItemSearchWith") + " " + activeEngines[0].name, "id": "sCM"+activeEngines[0].id, "contexts": contexts });
	}
	else
	{
		//,
		browser.contextMenus.create({"title": browser.i18n.getMessage("menuItemSearchWith"),
									 "id": "parent", 
									 "contexts": contexts 
									});
									
		browser.contextMenus.create({"title": browser.i18n.getMessage("menuItemUseAll"),
									 "id": "sCM0",
									 "parentId": "parent",
									 "contexts": contexts 
									});
									
		browser.contextMenus.create({"type":"separator", 
									 "parentId": "parent",
									 "contexts": contexts 
									});
									
		for (var i = 0 ; i < activeEngines.length ; i++)
		{
			browser.contextMenus.create({"title": activeEngines[i].name,
										 "id": "sCM"+activeEngines[i].id, 
										 "parentId": "parent", 
										 "contexts": contexts 
										});
		}
	}	
	browser.contextMenus.create({ "title": browser.i18n.getMessage("menuItemSearchGoogleImage"), "id": "parent2", "contexts": ["image"] });
}


browser.storage.local.get(function (item)
{		
	for(var i in item.list)
		searchEngines.push(item.list[i]);
	
	if(searchEngines == undefined || searchEngines.length == 0)
	{
		loadDefault();
	}
	
	updateMenu();
});


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
		var id = info.menuItemId.substr(3); //sCM		

		for (var i = 0 ; i < searchEngines.length ; i++)
		{
			if ((searchEngines[i].id == id || id == 0) && searchEngines[i].active)
			{
				url.push(searchEngines[i].url + encodeURIComponent(info.selectionText));
				if(id != 0) break;
			}
		}		
	}
	
	for(var i in url)
	{
		//console.log(url[i]);
		target.create({ url: url[i]});
	}
});