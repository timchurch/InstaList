$(document).ready(function() {
	// Enable checkboxes
	$(".box").live('click', function(event) {
		$(this).toggleClass("checked");
	});

	// Enable text editing on list items
	$("div.value").live('click', function(event) {
		var text = $(this).text();
		$(this).next('input').attr('value', text).show().focus().select();
		$(this).hide();
	});
	$('input.value').live('blur', function(event) {
		var text = $(this).attr('value');
		if (text) {
			$(this).prev('div.value').text(text).show();
			$(this).hide();	
		} else {
			// DELETE row if text is empty
			var sublist = $(this).parents('li').first().children('ol');
			if(sublist.length > 0) {
				var ol = sublist[0];
				var sublist_items = $(ol).children('li');
				if(sublist_items.length > 0) {
					$(this).prev('div.value').text("").show();
					$(this).hide();
				} else {
					$(this).parents('li').first().remove();
				}
			} else {
				$(this).parents('li').first().remove();
			}
		}
	}).click();

	// Enable title editing
	$("#list-title").click(function(event) {
		var title = $(this).text();
		$('#list-title-edit').attr('value', title).show().focus().select();
		$(this).hide();
	});
	$('#list-title-edit').focusout(function(event) {
		var title = $(this).attr('value');
		$('#list-title').text(title).show();
		$(this).hide();
	});
	
	// Enable drag & drop sorting
	$("#checklist").nestedSortable({
			disableNesting: 'no-nest',
			forcePlaceholderSize: true,
			handle: '.handle',
			helper:	'clone',
			items: 'li',
			maxLevels: 3,
			opacity: .6,
			placeholder: 'sortable-placeholder',
			revert: false,
			tabSize: 34,
			tolerance: 'pointer',
			toleranceElement: '> div'
	});
	$("#checklist").disableSelection();

	// Enable "Add item" button
	$("#add").click(function(event) {
		add_row();
		$('#checklist li:last-child div.value').click();
	});
	
	// Enable buttons on reset confirmation modal
	$("#confirm-reset").click(function(event) {
		$("#reset-confirm-modal").modal('hide');
		reset();
		$('#checklist li:last-child div.value').click();
	});
	$("#cancel-reset").click(function(event) {
		$("#reset-confirm-modal").modal('hide')
	});
	
	// Enable 'About' link
	$("#show-about").click(function(event) {
		$("#about").toggle();
	});
	$("#close-about").click(function(event) {
		$("#about").hide();
	});

	// Enable print button
	$("#print").click(function(){
		window.print();
	});
	
	// Enable export button
	$('#export').downloadify({
		filename: function(){
			return "InstaList.txt";
		},
		data: function(){ 
			return export_list();
		},
		onComplete: function(){},
		onCancel: function(){},
		onError: function(){},
		swf: 'media/downloadify.swf',
		downloadImage: 'images/export-button.png',
		width: 68,
		height: 29,
		transparent: true,
		append: false
	});
	
	// Enable import button
	$("#confirm-import").click(function() {
		var input = document.getElementById('import-file-input');
		
		if (!input.files) {
            var error = $('<div>').addClass('alert-message block-message error').text("This browser doesn't seem to support the 'files' property of file inputs.");
            $('#import-error').append(error);
        } else if (!input.files[0]) {
            var error = $('<div>').addClass('alert-message block-message error').text("Please select a file");
            $('#import-error').append(error);
        } else {
        	$('#import-error').children().remove();
            file = input.files[0];
            reader = new FileReader();
            reader.onload = function(e) {
        		var filecontent = e.target.result; 
        		//console.log(filecontent);
        		import_list(filecontent);
    		};
			reader.readAsText(file);
        }
	});
	$("#cancel-import").click(function(event) {
		$("#import-modal").modal('hide');
		$('#import-error').children().remove();
	});
	
});


/*******************
 * Constants
 *******************/

var NEWLINE = "\r\n";
var TAB = "    ";
var ALT_TAB = "\t";
var BULLET = "-";
var ALT_BULLET = "*";
var CHECKMARK = "X";

/*******************
 * Custom functions
 *******************/

/*
 * Adding new String methods
 * via http://stackoverflow.com/a/646643
 */
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

function add_row() {
	$('#checklist').append($('<li>')
				   .append($('<div>').attr('class', 'row')
				   .append($('<div>').attr('class', 'handle-container')
				   .append($('<img>').attr('src', "images/glyphicons_186_move.png").attr('class', 'handle')))
				   .append($('<div>').attr('class', 'box'))
				   .append($('<div>').attr('class', 'value').text("New Item"))
				   .append($('<input>').attr("type", "text").attr('class', 'value editMode'))));
}

function reset() {
	$("#list-title").text("List Title");
	$("#checklist").children().remove();
	add_row();
}

function export_helper(input, output, level) {
	var row = "";
	var checked = $(input).children('div.row').children('div.box').hasClass('checked');
	for(var i=0; i < level; i++) {
		row = row + TAB;
	}
	
	if(checked) {
		row = row + CHECKMARK;
	} else {
		row = row + BULLET;
	}
	row = row + " ";
	var text = $(input).children('div.row').children('div.value').first().text();
	row = row + text + NEWLINE;
	output = output + row;	

	// Recursively add sublists
	var sublist = $(input).children('ol').children('li');
	if(sublist.length) {
		level = level + 1;
		$(sublist).each(function() {
			output = export_helper(this, output, level);
		});
	}
	return output;
}

function export_list() {
	var title, output, x, level;
	output = "";
	
	// Title
	title = $("#list-title").text();
	if(title) {
		output = title + NEWLINE;
		for(x=0; x < title.length; x++) {
			output = output + "-";
		}
		output = output + NEWLINE + NEWLINE;
	}
	
	// List items
	level = 0;
	$('#checklist > li').each(function(){
		output = export_helper(this, output, level);
	});
	
	//Data URI's not working yet - can't force download and limited cross-browser support
	//uriContent = "data:application/octet-stream," + encodeURIComponent(output);
	//newWindow=window.open(uriContent, 'InstaList');
	return output;
}

function is_list_item(s) {
	s = $.trim(s);
	return s.startsWith(BULLET + " ") || s.startsWith(CHECKMARK + " ") || s.startsWith(ALT_BULLET + " ");
}

function get_nesting_level(s) {
	var level = 0;
	s = s.replace(/\t/g, TAB);
	while(s.startsWith(TAB)) {
		level = level + 1;
		s = s.slice(TAB.length);
	}
	return level;
}

function is_checked(s) {
	s = $.trim(s);
	if(s.startsWith(CHECKMARK)) {
		return true;
	}
	return false;
}

function get_list_item_value(s) {
	s = $.trim(s);
	return s.slice(2);
}

function import_list(text) {
	var i, j, line, lines, title, nesting_level, rows, row, new_sublist, end_sublist;
	lines = text.split("\r\n");
	
	//find title
	title = "";
	if(!is_list_item(lines[0])){
		title = lines.shift();
		
		//skip underline and blank lines
		while(lines.length && !is_list_item(lines[0])) {
			lines.shift();
		}
	}
	
	//process list items
	rows = [];
	for(i=0; i < lines.length; i++) {
		line = lines[i];
		
		if(is_list_item(line)) {
			row = {};
			row.nesting_level = get_nesting_level(line);
			row.is_checked = is_checked(line);
			row.value = get_list_item_value(line);
			rows.push(row);
		}
	}
	
	//error check
	if(!rows.length) {
		var error = $('<div>').addClass('alert-message block-message error').text("This file does not appear to be a valid list...");
        $('#import-error').append(error);
	} else {
		$("#list-title").text(title);
		$("#checklist").children().remove();
		
		sublists = [];
		for(j=0; j < rows.length; j++) {
			new_sublist = false;
			end_sublist = false;
			row = $('<li>').append($('<div>').attr('class', 'row')
				   .append($('<div>').attr('class', 'handle-container')
				   .append($('<img>').attr('src', "images/glyphicons_186_move.png").attr('class', 'handle')))
				   .append($('<div>').attr('class', 'box'))
				   .append($('<div>').attr('class', 'value').text(rows[j].value))
				   .append($('<input>').attr("type", "text").attr('class', 'value editMode')));
			
			if(rows[j].is_checked) {
				$(row).find('div.box').addClass('checked');
			}
			
			// check for sublists
			if(j < rows.length-1) {    //ensure valid array index
				if(rows[j].nesting_level < 2) {  //max depth = 2
					if(rows[j].nesting_level < rows[j+1].nesting_level) {
						//start of new sublist
						var list = $('<ol>');
						$(row).append(list);
						sublists.push(list);
						new_sublist = true;
					}
				}
				
				//end of sublist check
				if(rows[j].nesting_level > rows[j+1].nesting_level) {
					end_sublist = true;
				}
			}
			
			// add this row to the list
			if(sublists.length == 0 ){
				$("#checklist").append(row);
			} else if(new_sublist && sublists.length == 1){
				$("#checklist").append(row);
			} else if(new_sublist && sublists.length > 1){
				sublist = sublists[sublists.length-2];
				$(sublist).append(row);
			} else {
				sublist = sublists[sublists.length-1];
				$(sublist).append(row);
				if(end_sublist){
					sublists.pop();
				}
			}
		}
		$("#import-modal").modal('hide');
	}
}


