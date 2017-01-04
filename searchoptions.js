/****************************************************************/


/****************************************************************/

var background = browser.extension.getBackgroundPage();


/*****************************************************************

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

/**************************************************************************** */

function addSearchEngine(eng)
{
	$('#engs-cnt').append("<div class='draggable-item-list' data-uid='" + eng.id +	"'><p class='title'>" + eng.name + "</p>"													
							
							+ "<i class='material-icons ico-white ico btn-delete'>close</i>"
							+ "<i class='material-icons ico-white ico btn-edit'>mode_edit</i>"
							
							+ "<div class='edit-engs'><form>"
							+ "Name: <input class='eng-in' type='text' value='" + eng.name + "'/><br/>"
							+ "Url: <input class='eng-in' type='text' value='" + eng.url + "'/>"
							+ "<br/><input value='save' type='button' /><input value='Default' type='reset'/>"
							+ "</form>"
							+ "</div></div>");
	$('div.draggable-item-list .btn-edit').click(function () {		
	$(this).parent().find('div.edit-engs').toggle(300);
});
$('div.draggable-item-list .btn-delete').click(function () {		
	if(confirm("u sure?"))$(this).parent().remove();
});
$('div.draggable-item-list .reset').click(function () {
	$(this).parent().find('form')[0].reset();
});
}


for (var i = 0; i < background.searchEngines.length ; i++)
{
	addSearchEngine(background.searchEngines[i]);
}



$('.add-eng-btn').click(function () {		
	//zabezpieczyć przed pustymi i nieprawidłowymi
	addSearchEngine({id:22,name: $('.eng-name').val(), url: $('.eng-url').val()});
	//wyczyscic formularz...
});


$('#engs-cnt').append("<div class='draggable-item-list separator'>SEPARATOR<i class='material-icons ico-white ico btn-delete'>close</i></div>");

for (var i = 0; i < background.searchGroups.length ; i++)
{
	$('#engs-cnt').append("<div class='draggable-item-list' data-uid='"
							+ background.searchGroups[i].id
							+ "'>" + background.searchGroups[i].name
							+ "</div>");
}

	
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

//////////////////////////////////

$(".droppable-list").sortable({
  revert: 150,
  placeholder: "placeholder",
  receive: function (event, ui) {
    var item = $(this).data().uiSortable.currentItem;
	if(removeDuplicate($(this),item))  item.remove();
	$('.droppable-list .btn-delete').click(function () {		
		$(this).parent().remove();
	});
  },
  over: function ( event, ui ) 	{
	  var item = $(this).data().uiSortable.currentItem;
	 
	if(removeDuplicate($(this),item)) 
	{
		item.addClass("protect");
		$(".placeholder").hide();
	}
  }
});

function removeDuplicate(container, item)
{
  var duplicte = 0;
  container.children().each(function() {
    if(item.attr('data-uid') !== undefined && $(this).attr('data-uid') == item.attr('data-uid')) duplicte++;
  });
  if(duplicte > 1) return 1; //item.remove();
  else return 0;
}

var __mouseStart = $.ui.draggable.prototype._mouseStart;
$.ui.draggable.prototype._mouseStart = function (e, overrideHandle, nop) {
    this._trigger("prestart", e, this._uiHash());
    __mouseStart.apply(this, [e, overrideHandle, nop]);
};

$( ".draggable-item-list" ).draggable({
	prestart: function()
	{

		//przeciąganie ma zamykać tylko element przeciągany
		$('div.edit-engs').hide();
	},
  connectToSortable: ".droppable-list",
  helper: "clone",
  revert: "false",
  revertDuration: 0
  
});
