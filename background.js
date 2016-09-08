
(function()
{
	var background = browser.extension.getBackgroundPage();
	background.searchEngines = [];

    /****/

	background.target = browser.windows;
	background.openInNewTab = true;
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
		background.searchEngines = item.list;	    
		if(background.searchEngines.length == 0)
		{
			background.searchEngines = defaultSearchEngines;
		}
		updateMenu();
	});		
	

	background.saveSearchEngines = function()
	{
		console.log(this.searchEngines);		
		browser.storage.local.set({list: this.searchEngines});	
	}	
    
	function updateMenu()
	{
	    var contexts = ["selection"];
	    var activeEngines = [];
	    for (var i = 0 ; i < background.searchEngines.length ; i++)
	    {
	    	if(background.searchEngines[i].active) 
	    		activeEngines.push({id: background.searchEngines[i].id, name: background.searchEngines[i].name, url: background.searchEngines[i].url});
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

	    for (var i = 0 ; i < background.searchEngines.length ; i++)
	    {
	        if (background.searchEngines[i].id == id)
	        {
	            url = background.searchEngines[i].url + encodeURIComponent(info.selectionText);
	            break;
	        }	            
	    }	    
	   
	    if (background.openInNewTab)
	    {
	        background.target = browser.tabs;
	    }
	    background.target.create({ url: url});
		
	});

	/**/

})();