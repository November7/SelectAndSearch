/****************************************************************/


/****************************************************************/

var background = browser.extension.getBackgroundPage();

document.getElementById("searchForm").onsubmit = function () {
	var searchKey = document.getElementById("searchkey").value;
	if (searchKey != "")
	{
		if (background.openInNewTab)
		{
			background.target = browser.tabs;
		}
		for (var i = 0 ; i < background.searchEngines.length ; i++)
		{
			if(background.searchEngines[i].useSearch) background.target.create({ url: background.searchEngines[i].url + searchKey })
		}
	}
}

document.getElementById("optionsLink").onclick = function() {
	browser.tabs.create({'url': "/searchoptions.html" } )
}