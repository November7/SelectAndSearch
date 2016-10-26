/****************************************************************/


/****************************************************************/

var background = browser.extension.getBackgroundPage();

document.getElementById("saveOptions").addEventListener("click", function() {
	while(background.searchEngines.pop());
	var sE = document.getElementById("searchEngines");
	for(var i = 1 ; i < sE.rows.length ; i++)
	{		
		background.addSearchEngine( i,
									sE.rows[i].cells[0].children[0].value,
									sE.rows[i].cells[1].children[0].value,
									sE.rows[i].cells[2].children[0].checked,
									sE.rows[i].cells[3].children[0].checked,
									(sE.rows[i].cells[4].children[0].value=="S"?0:1));
		
	}	
	background.saveOptions();	
});	


(function()
{
	var str = "<table id='searchEngines'><tr><td colspan=2 style='width:70px'>Nazwa</td><td style='width:270px'>adres silnika wyszukiwania</td><td>Pokaż w menu</td><td>Użyj w wyszukiwarce</td></tr>";
			
	for (var i = 0; i < background.searchEngines.length ; i++)
	{
		str +=  "<tr><td><input type='text' value='"
		+   background.searchEngines[i].name
		+   "'/></td><td>"
		+	(background.searchEngines[i].type==0?"S":"G")
		+	"</td><td><input type='text' value='"
		+   background.searchEngines[i].url 
		+ "'></td><td><input type='checkbox'"
		+   (background.searchEngines[i].active?"checked ":"")
		+ "></td><td><input type='checkbox'"
		+   (background.searchEngines[i].useSearch?"checked ":"")
		+ "></td></tr>";
	}
	str += "</table>";
	document.getElementById("searchEnginesContainer").innerHTML = str;

})();
	
/*****************************************************************************/


function showPage(target)
{
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


/**/



	
//  ms-browser-extension://OpenSearch_ktnqkx724ter0/searchoptions.html

