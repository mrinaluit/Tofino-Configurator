$(document).ready(function(){
 
	// make popovers work
	$('[data-toggle="popover"]').popover();
	$('[data-toggle="tooltip"]').tooltip();
	$('[data-toggle="dropdown"]').dropdown();
	
	var drawer = $('#col-stats');
	var mainContent = $('#main-content');
	
	$('#button-drawer').click(function(e){
		var clicked = $(e.currentTarget);
		//var winWidth = $( window ).width();
		clicked.removeClass('open');
				
		if (drawer.hasClass('hidden')){
			
			// drawer is hidden 
			drawer.removeClass('hidden');
			mainContent.toggleClass( 'col-sm-9' );
		} else {
			
			// drawer is showing
			clicked.addClass('open');
			mainContent.toggleClass( 'col-sm-9' );
			drawer.toggleClass('hidden');
		}
	});
	
	var inventoryButtons = $('#button-view-topology, #button-view-map, #button-view-table');
	
	inventoryButtons.click(function(e){
			
		$.each( inventoryButtons, function( index, value ) {
		  $('.'+$(value).attr('data-view')).addClass('hidden');
		});
		var clicked = $(e.currentTarget);
		$('.'+clicked.attr('data-view')).removeClass('hidden');
		$('.view-icon').attr('src', 'assets/img/'+clicked.attr('data-icon'));
		$('.view-icon').attr('width', clicked.attr('data-icon-width'));
	});
});