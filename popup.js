/****************************************************************/

var background = browser.extension.getBackgroundPage();

$("#searchGrp").hide();

background.searchEngines.forEach(function(item,index) {
	if(item.id <0) {
		$("#searchGrp").append($('<option>', {
			value: item.members,
			text: item.name
		} ));
		$("#searchGrp").show();
	}
});


$("#searchForm").submit(function () {
	var searchKey = $("#searchKey").val();
	var target = browser.tabs;
	if (searchKey != "")
	{
		$("#searchGrp").find(":selected").val().split(",").forEach(function(item,index) {
			
			target.create({ url: background.getEngine(item).url + encodeURIComponent(searchKey)});
		});
		window.close();
	}
});

$("#optionsLink").click(function() {
	browser.tabs.create({'url': "/searchoptions.html" } )
	window.close();
});

/****************************************************************/