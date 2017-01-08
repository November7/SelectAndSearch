/****************************************************************/
/****************************************************************/

var background = browser.extension.getBackgroundPage();

function saveSearchEngines()
{
	background.searchEngines = [];
	$('#engs-cnt').find('.item').each(function() {
		background.searchEngines.push({
			id: $(this).attr('data-id'),
			name: $(this).find('.eng-name').val(),
			url: $(this).find('.eng-url').val()
		});
	});
	background.saveOptions();
}

function addSearchObj(obj,parent)
{
	var strItem = "<div class='draggable-item-list";
	if(obj.id != undefined) {
		strItem += " item' data-id='" + obj.id +"'>";
	}	
	else {
		strItem += " separator'>";
	}	
	strItem += 	"<p class='title'>" + obj.name + "</p><i class='material-icons ico-white ico btn-delete'>close</i>";
	if(obj.url != undefined) {
		strItem +="<i class='material-icons ico-white ico btn-edit'>mode_edit</i>"								
				+ "<div class='edit-engs'><form>"
				+ "Name: <input class='eng-in eng-name' type='text' value='" + obj.name + "'/><br/>"
				+ "Url: <input class='eng-in eng-url' type='text' value='" + obj.url + "'/>"
				+ "<br/><input class='btn-se-save' value='save' type='button' /><input value='Default' type='reset'/>"
				+ "</form></div>";
	}	
	strItem	+= "</div>";
	var item = $(strItem);
	$(parent).append(item);

	if(obj.url != undefined) {						
		item.find('.btn-edit').click(function () {		
			$(this).parent().find('div.edit-engs').toggle(300);
		});

		item.find('.btn-delete').click(function () {		
			if(confirm("u sure?"))$(this).parent().remove();
			saveSearchEngines();
		});

		item.find('.btn-se-save').click(function () {
			saveSearchEngines();
		});
		///????
		item.find('.reset').click(function () {
			$(this).parent().find('form')[0].reset();
		});

	}

	item.draggable({
		prestart: function()
		{
			$(this).find('div.edit-engs').hide();
		},
		connectToSortable: ".droppable-list",
		helper: "clone",
		revert: "false",
		revertDuration: 0
	
	});
}

for (var i = 0; i < background.searchEngines.length ; i++)
{
	addSearchObj(background.searchEngines[i],'#engs-cnt');
}

$('.add-eng-btn').click(function () {		
	//zabezpieczyć przed pustymi i nieprawidłowymi
	var gid = 1;
	for (var i = 0; i < background.searchEngines.length ; i++)
	{
		if(gid == background.searchEngines[i].id) gid++;
		else break;
	}
	console.log(gid);
	addSearchObj({id:gid,name: $('#add-eng-frm .eng-name').val(), url: $('#add-eng-frm .eng-url').val()},'#engs-cnt');

//	$('#add-eng-frm').reset();  ocb????
	saveSearchEngines();
});

addSearchObj({name: "DELIMITER"}, '#engs-cnt');

for (var i = 0; i < background.searchGroups.length ; i++)
{
	addSearchObj(background.searchGroups[i],'#grps-cnt');
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
    if(item.attr('data-id') !== undefined && $(this).attr('data-id') == item.attr('data-id')) duplicte++;
  });
  if(duplicte > 1) return 1; //item.remove();
  else return 0;
}

var __mouseStart = $.ui.draggable.prototype._mouseStart;
$.ui.draggable.prototype._mouseStart = function (e, overrideHandle, nop) {
    this._trigger("prestart", e, this._uiHash());
    __mouseStart.apply(this, [e, overrideHandle, nop]);
};