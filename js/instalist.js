$(document).ready(function() {
	$(".box").live('click', function(event) {
		$(this).toggleClass("checked");
	});

	$("div.value").live('click', function(event) {
		var text = $(this).text();
		$(this).next('input').attr('value', text).show().focus();
		$(this).hide();
	});

	$('input.value').live('blur', function(event) {
		var text = $(this).attr('value');
		if (text) {
			$(this).prev('.value').text(text).show();
			$(this).hide();	
		} else {
			$(this).parents('li').remove();
		}
	}).click();

	$("#list-title").click(function(event) {
		var title = $(this).text();
		$('#list-title-edit').attr('value', title).show().focus();
		$(this).hide();
	});

	$('#list-title-edit').focusout(function(event) {
		var title = $(this).attr('value');
		$('#list-title').text(title).show();
		$(this).hide();
	});
	
	$("#checklist").nestedSortable({
			disableNesting: 'no-nest',
			forcePlaceholderSize: true,
			handle: '.handle',
			helper:	'clone',
			items: 'li',
			maxLevels: 3,
			opacity: .6,
			placeholder: 'sortable-placeholder',
			revert: 250,
			tabSize: 35,
			tolerance: 'pointer',
			toleranceElement: '> div'
	});
	$( "#checklist" ).disableSelection();

	$("#add").click(function(event) {
		$('#checklist').append($('<li>')
					   .append($('<div>').attr('class', 'row')
					   .append($('<div>').attr('class', 'handle-container')
					   .append($('<img>').attr('src', "images/glyphicons_186_move.png").attr('class', 'handle')))
					   .append($('<div>').attr('class', 'box'))
					   .append($('<div>').attr('class', 'value').text("New Item"))
					   .append($('<input>').attr("type", "text").attr('class', 'value editMode'))));
	});

	$("#print").click(function(){
		window.print();
	});
});
