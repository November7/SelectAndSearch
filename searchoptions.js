var background = browser.extension.getBackgroundPage();

document.getElementById("saveOptions").addEventListener("click", function() {
	while(background.searchEngines.pop());
	var sEC = document.getElementById("searchEnginesContainer");		
	for(var i = 1 ; i < sEC.childNodes.length; i++)	{					
		background.addSearchEngine(i,sEC.childNodes[i]);		
	}		
	background.saveOptions();	
});	

document.getElementById("addNewSearchEngine").addEventListener("click", function() {
	var name = document.getElementById("newSearchEngineName");
	var url = document.getElementById("newSearchEngineUrl");
	if(name.value != undefined && url.value != undefined && name.value.length>0 && url.value.length > 0) {
		
		addRow(document.getElementById("searchEnginesContainer"),[
			"<input type='text' value='" + name.value + "'/>",
			"<input type='text' value='" + url.value + "'/>",
			"<input type='checkbox'/>",
			"<input type='checkbox'/>"]);
		name.value="";
		url.value="";
	}
});

function addRow(container,ceils,header) {
	var row = document.createElement("div");
	row.className = "row";
	var ceil;
	for(var i in ceils)	{
		ceil = document.createElement("div");
		ceil.innerHTML = ceils[i];
		row.appendChild(ceil);
	}
	if(header == undefined || header == false) {
		var btn = document.createElement("div");
		btn.innerHTML = "delete";
		btn.addEventListener("click", function() {
			if(background.delConfirm || confirm("sure?")) container.removeChild(this.parentNode);
		});
		row.appendChild(btn);	
	}	
	container.appendChild(row);
}

(function() {
	var sEC = document.getElementById("searchEnginesContainer");

	addRow(sEC,["Nazwa","adres silnika","Pokaż w menu","Użyj w wyszukiwarce",""],true);
	
	for (var i = 0; i < background.searchEngines.length ; i++) {
		addRow(sEC,[
			"<input type='text' value='" + background.searchEngines[i].name + "'/>",
			"<input type='text' value='" + background.searchEngines[i].url 	+ "'/>",
			"<input type='checkbox'"	 + (background.searchEngines[i].active?"checked ":"") + "/>",
			"<input type='checkbox'" 	 + (background.searchEngines[i].useSearch?"checked ":"") + "/>"]);
	}		
})();
	
/*****************************************************************************/

function showPage(target) {
	if(target == undefined || target == null) return;
	var pages = document.getElementsByClassName("page");
	for(var i=0; i < pages.length ; i++) {
		pages[i].style.display = "none";
	}
	var tget = document.getElementById(target)
	if(tget) tget.style.display = "block";
}

(function () {
	var menuItems = document.getElementsByClassName("menuItem");
	for(var i=0; i < menuItems.length ; i++) {
		menuItems[i].addEventListener("click", function () {
			showPage(this.getAttribute("data-target"));		
		})
	}
})();