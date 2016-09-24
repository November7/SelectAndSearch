
(function()
{

	searchEngines = [];
	

    /****/

	target = browser.windows;
	openInNewTab = true;
    /****/
	var defaultSearchEngines = [
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

	

	
	browser.storage.local.get(function (item)
	{
		searchEngines = item.list;	    
		console.log("Loading search engines:");
		console.log(searchEngines);
		if(searchEngines == undefined || searchEngines.length == 0)
		{
			searchEngines = defaultSearchEngines;
		}
		updateMenu();
	});		
	

	saveSearchEngines = function()
	{
		console.log("Saving search engines:");
		console.log(searchEngines);		
		browser.storage.local.set({list: searchEngines});	
		//return searchEngines;
	}	
    
	function updateMenu()
	{
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
	        browser.contextMenus.create({ "title": "Szukaj w " + activeEngines[0].name, "id": "sCM"+activeEngines[0].id, "contexts": contexts });
	    }
	    else
	    {
	    	browser.contextMenus.create({ "title": "Szukaj w ... ", "id": "parent", "contexts": contexts });
	        for (var i = 0 ; i < activeEngines.length ; i++)
	        {
	            browser.contextMenus.create({ "title": activeEngines[i].name, "id": "sCM"+activeEngines[i].id, "parentId": "parent", "contexts": contexts });
	        }
	    }
	}


	browser.contextMenus.onClicked.addListener(function(info, tab) {

		var id = info.menuItemId.substr(3); //sCM
	    var url;

	    for (var i = 0 ; i < searchEngines.length ; i++)
	    {
	        if (searchEngines[i].id == id)
	        {
	            url = searchEngines[i].url + encodeURIComponent(info.selectionText);
	            break;
	        }	            
	    }	    
	   
	    if (openInNewTab)
	    {
	        target = browser.tabs;
	    }
	    target.create({ url: url});
		
	});

	/**/

})();