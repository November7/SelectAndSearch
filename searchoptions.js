(function()
{
	var background = browser.extension.getBackgroundPage();


	document.getElementById("showOptions").addEventListener("click", function () {
		document.getElementById("optionsContainer").style.display = "block"; 
	});

	document.getElementById("searchAll").addEventListener("click", function () {
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
	});

	

	document.getElementById("saveOptions").addEventListener("click", function() {
		//console.log("saving...");
		background.searchEngines = [];
		var sE = document.getElementById("searchEngines");
		for(var i=1;i<sE.rows.length;i++)
		{
			//console.log(sE.rows[i]);
			var obj = {
				id: 		i, 
				name: 		sE.rows[i].cells[0].children[0].value, 
				url: 		sE.rows[i].cells[1].children[0].value, 
				active: 	sE.rows[i].cells[2].children[0].checked,
				useSearch: 	sE.rows[i].cells[3].children[0].checked
			};
			//console.log(obj);
			background.searchEngines.push(obj);
			
		}
		background.saveSearchEngines();

	});


	
	var str = "<table id='searchEngines'><tr><td style='width:70px'>Nazwa</td><td style='width:270px'>adres silnika wyszukiwania</td><td>Pokaż w menu</td><td>Użyj w wyszukiwarce</td></tr>";
	for (var i = 0; i < background.searchEngines.length ; i++)
	{
		str +=  "<tr><td><input type='text' value='"
		    +   background.searchEngines[i].name
		    +   "'/></td><td><input type='text' value='"
		    +   background.searchEngines[i].url 
		    + "'></td><td><input type='checkbox'"
		    +   (background.searchEngines[i].active?"checked ":"")
		    + "></td><td><input type='checkbox'"
		    +   (background.searchEngines[i].useSearch?"checked ":"")
		    + "></td></tr>";
	}
	str += "</table>";
	document.getElementById("searchEnginesContainer").innerHTML = str;
	
	

	//  ms-browser-extension://OpenSearch_ktnqkx724ter0/searchoptions.html
})();
