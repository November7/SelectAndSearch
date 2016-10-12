var searchEngines = [];	
var target = browser.windows;
var openInNewTab = true;

function loadDefault()
{
	searchEngines = [
	{
		id: 		1, 
		active: 	true,
		useSearch: 	true,
		name: 		"Google", 
		url: 		"https://google.com/search?q="			
	},
	{
		id: 		2, 
		active: 	false,
		useSearch: 	true,
		name: 		"Filmweb", 
		url: 		"http://www.filmweb.pl/search?q="			
	},
	{
		id: 		3, 
		active: 	false,
		useSearch: 	true,
		name: 		"Yahoo", 
		url: 		"https://search.yahoo.com/search?p=", 			
	},
	{
		id: 		4, 
		active: 	false,
		useSearch: 	true,
		name: 		"Bing", 
		url: 		"http://www.bing.com/search?q="
		
	}];	
}

function addSearchEngine(id,name,url,active,useSearch)
{
	searchEngines.push({id: id, 
						name: name,
						url: url,
						active: active,
						useSearch: useSearch});
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
	var contexts = ["selection","image"];
	var activeEngines = [];
	for (var i = 0 ; i < searchEngines.length ; i++)
	{
		if(searchEngines[i].active) 
			activeEngines.push({id: searchEngines[i].id, name: searchEngines[i].name, url: searchEngines[i].url});
	}

	if (!activeEngines.length) return;
	else if (activeEngines.length == 1)
	{            
		browser.contextMenus.create({ "title": "Szukaj w " + activeEngines[0].name, "id": "sCM"+activeEngines[0].id, "contexts": contexts });
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
}


browser.storage.local.get(function (item)
{		
	for(var i in item.list)
		searchEngines.push(item.list[i]);
	
//	console.log("Loading...");
//	console.log(searchEngines);
	if(searchEngines == undefined || searchEngines.length == 0)
	{
		loadDefault();
//		console.log("Loading defaults");
//		console.log(searchEngines);
	}
	
	updateMenu();
});
/*
browser.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getSelection")
      sendResponse({data: window.getSelection().toString()});
    else
      sendResponse({}); // snub them.
});*/

browser.contextMenus.onClicked.addListener(function (info, tab) {
	//todo: search selected text in links ....
	
	
	console.log(info);
	
	if (openInNewTab)
	{
		target = browser.tabs;
	}
	
	if(info.mediaType === "image") //temp...
	{
		var url = "https://www.google.com/searchbyimage?&image_url="+info.srcUrl;
		target.create({ url: url});
	}
	else
	{		
		var id = info.menuItemId.substr(3); //sCM
		var url = [];

		for (var i = 0 ; i < searchEngines.length ; i++)
		{
			if ((searchEngines[i].id == id || id == 0) && searchEngines[i].active)
			{
				url.push(searchEngines[i].url + encodeURIComponent(info.selectionText));
				if(id != 0) break;
			}
		}		
		
		for(var i in url)
		{
			target.create({ url: url[i]});
		}
	}
});