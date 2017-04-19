/****************************************************************/
localizePage();
var background = browser.extension.getBackgroundPage();

function saveSearchEngines()
{
	background.removeEngines();
	$('#engs-cnt').find('.item').each(function() {

		background.addSearchEngine(	$(this).attr('data-id'), 
									$(this).find('.eng-name').val(), 
									$(this).find('.eng-url').val());		
	});	

	$('#grps-cnt').find('.item').each(function() {
				
		background.addSearchEngine(	$(this).attr('data-id'),
									$(this).find('.eng-name').val(),
									$(this).find("input:checkbox:checked").map(function() {
									  return parseInt($(this).attr('data-eid')); }).get().toString());
	});

	$('#menu-cnt .droppable-list').children().each(function() {
			background.addSearchMenu($(this).attr('data-id'));
		
	});

	background.saveOptions();
	displayEngines();
}

function addSearchObj(obj)
{	
	var parent = '#engs-cnt .draggable-list';
	var strItemAttr = "item list-eng-item' data-id='" + obj.id;
	var strItemEdit = "<svg width='20px' height='20px' class='ico ico-right btn-edit'><use xlink:href='ico/icons.svg#edit'></use></svg>";
	var strItemDisplayName = "<p class='title'>" + obj.name + "</p>";

	if(obj.id < 0)	{
		parent = '#grps-cnt .draggable-list';
		strItemDisplayName = "<svg class='ico ico-left'><use xlink:href='ico/icons.svg#multi'></use></svg>" + strItemDisplayName;
		strItemEdit += "<div class='edit-engs'><hr/><form>"
					+  browser.i18n.getMessage("labelEnterGroupName") + "<br/>"
					+ "<input class='eng-in eng-name' type='text' value='" + obj.name + "' placeholder='" + browser.i18n.getMessage("placeholderGroupName") + "'/><br/>"
					+  browser.i18n.getMessage("labelSelectEngines") + "<br/>";

		for (var i = 0; i < background.searchEngines.length ; i++)
		{
			if(background.searchEngines[i].id>0) {
				var checked = "";
				var eid = background.searchEngines[i].id;
				if(obj.members.indexOf(parseInt(eid)) != -1) checked="checked";			
				strItemEdit += "<label><input class='eng-chk' type='checkbox' " + checked + " data-eid='" +eid+ "'/>"+background.searchEngines[i].name+"</label><br>";
			}			
		}
	
		strItemEdit += "<hr/><input class='btn-save' value='" + browser.i18n.getMessage("labelSaveBtn") + "' type='button' /><input class='btn-reset' value='" + browser.i18n.getMessage("labelResetBtn") + "' type='reset'/>"
		 			+  "</form></div>";
	}
	else if(obj.id > 0) {
		
		strItemEdit += "<div class='edit-engs'><hr/><form>"
					+  browser.i18n.getMessage("labelEnterEngName") + "<br/>"
					+  "<input class='eng-in eng-name' type='text' value='" + obj.name + "' placeholder='" + browser.i18n.getMessage("placeholderEngName") + "'/><br/>"
					+  browser.i18n.getMessage("labelEnterEngUrl") + "<br/>"
					+  "<input class='eng-in eng-url' type='text' value='" + obj.url + "' placeholder='" + browser.i18n.getMessage("placeholderEngUrl") + "'/>"
					+  "<hr/><input class='btn-save' value='" + browser.i18n.getMessage("labelSaveBtn") + "' type='button' /><input class='btn-reset' value='" + browser.i18n.getMessage("labelResetBtn") + "' type='reset'/>"
					+  "</form></div>";
	}
	else {
		strItemAttr = "separator";
		strItemEdit = "";
	}

	var strItem = "<div class='draggable-item-list ";
	strItem += strItemAttr + "'>";	
	strItem += strItemDisplayName + "<svg class='ico ico-right btn-delete'><use xlink:href='ico/icons.svg#close'></use></svg>";
	strItem += strItemEdit + "</div>";

	var item = $(strItem);

	$(parent).append(item);

	if(obj.id)
	{
		item.find('.btn-edit').click(function () {		
			$(this).parent().find('div.edit-engs').toggle(300);
		});

		item.find('.btn-delete').click(function () {		
			if(confirm(browser.i18n.getMessage("labelDeleteConfirm")))$(this).parent().remove();
			saveSearchEngines();
		});

		item.find('.btn-save').click(function () {
			saveSearchEngines();
		});

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

function addMenuItem (id) 
{
	var strItemAttr = "item' data-id='" + id;
	var strItemDisplayName;
	
	for(var i=0;i<background.searchEngines.length;i++) {
		
		if(background.searchEngines[i].id == id) {
			strItemDisplayName = "<p class='title'>" + background.searchEngines[i].name + "</p>";
			break;
		}
	}

	if(id < 0) {
		strItemDisplayName = "<svg class='ico ico-left'><use xlink:href='ico/icons.svg#multi'></use></svg>" + strItemDisplayName;
	}
	else if (id > 0) {

	}
	else {
		strItemAttr = "separator";
		strItemDisplayName = "<p class='title'>" + browser.i18n.getMessage("labelMenuDelimiter") + "</p>";
	}

	var strItem = "<div class='draggable-item-list ";
	strItem += strItemAttr + "'>";	
	strItem += strItemDisplayName + "<svg class='ico ico-right btn-delete'><use xlink:href='ico/icons.svg#close'></use></svg>";
	strItem += "</div>";

	var item = $(strItem);

	$('#menu-cnt .droppable-list').append(item);
	item.find('.btn-delete').click(function () {		
			$(this).parent().remove();			
		});
}

function displayEngines()
{
	$('#engs-cnt .draggable-list').empty();
	$('#grps-cnt .draggable-list').empty();
	$('#menu-cnt .droppable-list').empty();

	for (var i = 0; i < background.searchEngines.length ; i++) {
		addSearchObj(background.searchEngines[i]);	
	}

	addSearchObj({name: browser.i18n.getMessage("labelMenuDelimiter"), id: 0});

	for(var i = 0; i < background.searchMenu.length ; i++) 
	{
		addMenuItem(background.searchMenu[i]);
	}		
}

displayEngines();

$(".droppable-list").sortable({
  revert: 150,
  axis: "y",
  placeholder: "placeholder",
  receive: function (event, ui) {
    var item = $(this).data().uiSortable.currentItem;
	if(removeDuplicate($(this),item))  item.remove();
	$('.droppable-list .btn-delete').click(function () {		
		$(this).parent().remove();
	});
	
  },
  stop: function(e,data) {
	var useTag = data.item.find("use")[0];
	if (useTag.href && useTag.href.baseVal) {
    	useTag.href.baseVal = useTag.href.baseVal; //fix "dissapearing svg with use xlink" bug 
	}
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

$('#menu-sv-btn').click(function () {
	saveSearchEngines();
})

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


function getNextId(stp)
{
	var gid = 2*stp; //first gid: 2 or -2
	for (var i = 0; i < background.searchEngines.length ; i++)
	{
		if( background.searchEngines[i].id * stp > 0) {
			if( background.searchEngines[i].id == gid) gid += stp;
			else break;
		} 
	}
	return gid;
}

$('#show-eng-dlg').click(function() {
		$('#add-eng-dlg').dialog({
			modal: true,
			resizable: false,
			dialogClass: 'add-dlg',
			closeOnEscape: true,
			open: function(event,ui) {
				$('#eng-frm')[0].reset();	
			},
			buttons: [ 
						{
							class: "btn-cancel",							
							text: browser.i18n.getMessage("labelCancelBtn"), 
							click: function() { 
								$('#eng-frm .eng-name').removeClass('required');
								$( this ).dialog( "close" ); 
							} 
						},
						{
							class: "btn-save",							
							text: browser.i18n.getMessage("labelSaveBtn"), 
							click: function() { 
								if(!/\S/.test($('#eng-frm .eng-name').val())) {
									$('#eng-frm .eng-name').addClass('required');
									return;
								}
								else {
									addSearchObj({id:getNextId(1), name: $('#eng-frm .eng-name').val(), url: $('#eng-frm .eng-url').val()},'#engs-cnt');
									$('#eng-frm .eng-name').removeClass('required');
									saveSearchEngines();
									$( this ).dialog( "close" ); 
								}
								
							} 
						}
					] 
		});
	});

	$('#show-grp-dlg').click(function() {
		$('#add-grp-dlg').dialog({
			modal: true,
			resizable: false,
			dialogClass: 'add-dlg',
			closeOnEscape: true,
			open: function(event, ui) {
				$('#grp-frm')[0].reset();
				$('#grp-frm .eng-frm-engs').empty();
				for (var i = 0; i < background.searchEngines.length ; i++) {
					if(background.searchEngines[i].id > 0) {			
						$('#grp-frm .eng-frm-engs').append("<label><input class='eng-chk' type='checkbox' data-eid='" 
															+ background.searchEngines[i].id
															+ "'/>"+background.searchEngines[i].name+"</label><br>");
					}
				}
			},

			buttons: [ 
						{
							class: "btn-cancel",							
							text: browser.i18n.getMessage("labelCancelBtn"), 
							click: function() { 
								$('#grp-frm .grp-name').removeClass('required');
								$( this ).dialog( "close" ); 
							} 
						},
						{
							class: "btn-save",							
							text: browser.i18n.getMessage("labelSaveBtn"), 
							click: function() { 
								if(!/\S/.test($('#grp-frm .grp-name').val())) {
									$('#grp-frm .grp-name').addClass('required');
									return;
								}
								else {
									addSearchObj({	id:getNextId(-1),name: $('#grp-frm .grp-name').val(), 
										members: $("#grp-frm input:checkbox:checked").map(function() {
														return parseInt($(this).attr('data-eid')); 
													}).get().toString()},'#grps-cnt');
									
									$('#grp-frm .grp-name').removeClass('required');
									saveSearchEngines();
									$( this ).dialog( "close" ); 
								}
								
							} 
						}
					] 
		});
	});

	$("#div-help-more-btn").click(function() {
		$("#div-help-content").toggle(300);
	});