$(document).ready(function(){
 
	// make popovers work
	$('[data-toggle="popover"]').popover();
	$('[data-toggle="tooltip"]').tooltip();
	$('[data-toggle="dropdown"]').dropdown();
	
	var drawer = $('#col-stats');
	var mainContent = $('#main-content');
	
	$('#button-drawer').click(function(e){
		var clicked = $(e.currentTarget);
		var winWidth = $( window ).width();
		var shrinkVar;
		clicked.removeClass('open');
		$( mainContent ).removeClass();
		
		// what size is the window?
		
		if( winWidth <= 992 ) {
			shrinkVar = 'shrinkHeight';
		} else {
			shrinkVar = 'shrinkWidth';
		}
		
		// is the drawer showing or hidden?
		
		if (drawer.hasClass('shrinkWidth') || drawer.hasClass('shrinkHeight') || drawer.hasClass('hidden')){
			
			// drawer is hidden 
			
			drawer.removeClass('shrinkWidth shrinkHeight hidden');
			if ( shrinkVar === 'shrinkHeight' ) {
				mainContent.addClass( 'col-xs-12' );
				console.log('make content wide');
			} else {
				mainContent.addClass( 'col-sm-9');
				console.log('make content narrow');
			}
		} else {
			
			// drawer is showing
			clicked.addClass('open');
			mainContent.addClass( 'col-xs-12' );
			drawer.addClass("hidden");
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
