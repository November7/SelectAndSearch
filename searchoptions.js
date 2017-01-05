/****************************************************************/
/****************************************************************/

var background = browser.extension.getBackgroundPage();

function addSearchEngine(eng)
{
	var item = $("<div class='draggable-item-list' data-uid='" + eng.id +	"'><p class='title'>" + eng.name + "</p>"							
				+ "<i class='material-icons ico-white ico btn-delete'>close</i>"
				+ "<i class='material-icons ico-white ico btn-edit'>mode_edit</i>"
				
				+ "<div class='edit-engs'><form>"
				+ "Name: <input class='eng-in' type='text' value='" + eng.name + "'/><br/>"
				+ "Url: <input class='eng-in' type='text' value='" + eng.url + "'/>"
				+ "<br/><input value='save' type='button' /><input value='Default' type='reset'/>"
				+ "</form>"
				+ "</div></div>");
	$('#engs-cnt').append(item);
							
	item.find('.btn-edit').click(function () {		
		$(this).parent().find('div.edit-engs').toggle(300);
	});

	item.find('.btn-delete').click(function () {		
		if(confirm("u sure?"))$(this).parent().remove();
	});

	///????
	item.find('.reset').click(function () {
		$(this).parent().find('form')[0].reset();
	});

	item.draggable({
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
}



// Przerobić dodawanie grup i silników na jedną uniwersalną funkcję!!!

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


