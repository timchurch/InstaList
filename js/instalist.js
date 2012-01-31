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
});

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
