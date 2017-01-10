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

	background.searchGroups = [];

	

	$('#grps-cnt').find('.item').each(function() {
		var mm = [];
		/*$(this).find("input:checkbox:checked").map(function() {
								return parseInt($(this).attr('data-eid')); 
							}).get(); */

		$(this).find("input:checkbox:checked").each(function()
		{
			//console.log("??"+$(this).attr('data-eid'));
			mm.push(parseInt($(this).attr('data-eid')));
		});
		background.searchGroups.push({
			id: $(this).attr('data-id'),
			name: $(this).find('.eng-name').val(),
			members: $(this).find("input:checkbox:checked").map(function() {
								return parseInt($(this).attr('data-eid')); 
							}).get()
		});
	});

	background.saveOptions();
	genEngs();
}

function addSearchObj(obj,parent)
{
	
	var strItemAttr = "item' data-id='" + obj.id;
	var strItemEdit = "<i class='material-icons ico ico-right btn-edit'>mode_edit</i>";
	var strItemDisplayName = obj.name;

	if(obj.id < 0)	{
		strItemDisplayName = "<i class='material-icons ico-left ico'>group</i> " + strItemDisplayName;
		strItemEdit += "<div class='edit-engs'><form>"
					+  "Name: <input class='eng-in eng-name' type='text' value='" + obj.name + "'/><br/>";

		for (var i = 0; i < background.searchEngines.length ; i++)
		{
			var checked = "";
			var eid = background.searchEngines[i].id;
			
			if(obj.members.indexOf(parseInt(eid)) != -1) checked="checked";
		
			strItemEdit += "<label><input class='eng-chk' type='checkbox' " + checked + " data-eid='" +eid+ "'/>"+background.searchEngines[i].name+"</label><br>";
		}

					
		strItemEdit += "<br/><input class='btn-se-save' value='save' type='button' /><input value='Default' type='reset'/>"
		 			+  "</form></div>";
	}
	else if(obj.id > 0) {
		strItemEdit += "<div class='edit-engs'><form>"
					+  "Name: <input class='eng-in eng-name' type='text' value='" + obj.name + "'/><br/>"
					+  "Url: <input class='eng-in eng-url' type='text' value='" + obj.url + "'/>"
					+  "<br/><input class='btn-se-save' value='save' type='button' /><input value='Default' type='reset'/>"
					+  "</form></div>";
	}
	else {
		strItemAttr = "separator";
		strItemEdit = "";
	}

	var strItem = "<div class='draggable-item-list ";
	strItem += strItemAttr + "'>";	
	strItem += "<p class='title'>" + strItemDisplayName + "</p><i class='material-icons ico ico-right btn-delete'>close</i>";
	strItem += strItemEdit + "</div>";

	var item = $(strItem);

	$(parent).append(item);

	if(obj.id)
	{
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

function genEngs()
{
	$('#engs-cnt').empty();
	$('#grps-cnt').empty();

	for (var i = 0; i < background.searchEngines.length ; i++)
	{
		addSearchObj(background.searchEngines[i],'#engs-cnt');
	}	

	addSearchObj({name: "DELIMITER", id: 0}, '#engs-cnt');

	for (var i = 0; i < background.searchGroups.length ; i++)
	{
		addSearchObj(background.searchGroups[i],'#grps-cnt');
	}
}

genEngs();

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