/*!
 * jQuery Image Viewer plugin
 *
 * Copyright 2011, George Paterson
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
(function($){
	/*
	 * 
	 *
	 */
	$.fn.imageviewer = function (options) {
		/*
		 * Merge defaults and options in to settings.
		 * If no options uses defaults.
		 *
		 */
		if (options) {
			settings = $.extend({}, $.fn.imageviewer.defaults, options);
		}
		else {
			settings = $.fn.imageviewer.defaults;
		}
		return this.each(function () {
			element = $(this);
			elementWidth = $(this).width();
			elementHeight = $(this).height();
			elementOffset = $(this).offset();
			$.fn.imageviewer.methods.init();
		});
	};
	/*
	 *	Default options, can be extend by options passed to the function.
	 *
	 */
	$.fn.imageviewer.defaults = {
		fileLocation: 'image',
		fileType: '.png',
		tileSize: 256,
		zoom: 1
	};
	$.fn.imageviewer.methods = {
		/*
		 *	Initialising method.
		 *
		 */	
		init: function () {
			imageSize = settings.tileSize * Math.pow(2, settings.zoom);
			imageCenter = {
				horizontal: ((imageSize - elementWidth) / -2), 
				vertical: ((imageSize - elementHeight) / -2)
			};
			tiles = [];
			columns = Math.ceil(elementWidth / settings.tileSize) + 1;
			rows = Math.ceil(elementHeight / settings.tileSize) + 1;
			startPosition = {
				horizontal: 0,
				vertical: 0
			};
			eventPosition = {
				horizontal: 0,
				vertical: 0
			};
	    $.fn.imageviewer.methods.create();
		},
		/*
		 *	Creating the tiles.
		 *
		 */
		create: function () {
			var i = 0,
				j = 0,
				tile = [],
				image= null;
			for ( i = 0; i < columns; i++) {
				var group = [];
				for ( j = 0; j < rows; j++) {
					tile = {
						column: i, 
						row: j,
						vertical: 0,
						horizontal: 0,
						html: null
					};
					image = $.fn.imageviewer.methods.imageSource(tile);
					tile.html = $('<img class="imageviewer-tile" src="'+image+'" style="top: '+ tile.vertical +'px; left: '+ tile.horizontal +'px;">');
					$('.imageviewer-frame', element).append(tile.html);
					group.push(tile);
				}
				tiles.push(group);
			}	
			$.fn.imageviewer.methods.position();
			$.fn.imageviewer.methods.pan();
		},
		/*
		 *	Find the image source.
		 *	Calculate current image area based on zoom level.
		 *	Tiles outside image area will be empty.
		 *
		 */
		imageSource: function (tile) {
	    var imageSource = settings.fileLocation + '/imageviewer-tile-' + settings.zoom + '-' + tile.column + '-' + tile.row + settings.fileType;
			if (tile.column < 0 || tile.column >= Math.pow(2, settings.zoom) || tile.row < 0  || tile.row >= Math.pow(2, settings.zoom)) {
				imageSource = settings.fileLocation + '/imageviewer-tile-empty' + settings.fileType;
			}
			return imageSource;
		},
		/*
		 *	Reposition tiles outside the frame.
		 *	
		 *	
		 *
		 */
		position: function () {
			var i = 0,
			j = 0,
			tile = [];
			for ( i = 0; i < tiles.length; i++) {
				for ( j = 0; j < tiles[i].length; j++) {
					tile = tiles[i][j];
					tile.vertical = (tile.row * settings.tileSize) + imageCenter.vertical + (eventPosition.vertical - startPosition.vertical);
					tile.horizontal = (tile.column * settings.tileSize) + imageCenter.horizontal + (eventPosition.horizontal - startPosition.horizontal);
					if (tile.vertical > elementHeight) {
						while (tile.vertical > elementHeight) {
							tile.row = tile.row - tiles[i].length;
							tile.vertical = (tile.row * settings.tileSize) + imageCenter.vertical + (eventPosition.vertical - startPosition.vertical);
						}
					} 
					else {
						while (tile.vertical < (-settings.tileSize)) {
							tile.row = tile.row + tiles[i].length;
							tile.vertical = (tile.row * settings.tileSize) + imageCenter.vertical + (eventPosition.vertical - startPosition.vertical);
						}
					}
					if (tile.horizontal > elementWidth) {
						while (tile.horizontal > elementWidth) {
							tile.column = tile.column - tiles.length;
							tile.horizontal = (tile.column * settings.tileSize) + imageCenter.horizontal + (eventPosition.horizontal - startPosition.horizontal);
						}
					} 
					else {
						while (tile.horizontal < (-settings.tileSize)) {
							tile.column = tile.column + tiles.length;
							tile.horizontal = (tile.column * settings.tileSize) + imageCenter.horizontal + (eventPosition.horizontal - startPosition.horizontal);
						}
					}
					tile.html.css({'top' : tile.vertical +'px', 'left': tile.horizontal +'px'});
				}
			}
		},
		pan: function () {
			/*
			 *	Prevents the image element being independently dragged.
			 *	
			 */
			$('img', element).bind('dragstart', function (event) {
				return false;
			});
			/*
			 * Bind mouse down, move and up events to pan the image.
			 *	
			 */
			$('.imageviewer-interface', element).bind('mousedown', function (event) {
				startPosition.horizontal = (event.pageX - elementOffset.left);
				startPosition.vertical = (event.pageY - elementOffset.top);
				$('.imageviewer-interface', element).bind('mousemove', function (event) {
					eventPosition.horizontal = (event.pageX - elementOffset.left);
					eventPosition.vertical = (event.pageY - elementOffset.top);
					$.fn.imageviewer.methods.position();
				});
			});
			$('.imageviewer-interface', element).bind('mouseup', function (event) {
				$('.imageviewer-interface', element).unbind('mousemove');
				imageCenter.horizontal += (eventPosition.horizontal - startPosition.horizontal);
        imageCenter.vertical += (eventPosition.vertical - startPosition.vertical);
			});
		}
	};
})( jQuery );