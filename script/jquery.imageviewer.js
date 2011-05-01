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
	$.fn.imageviewer = function(options) {
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
		return this.each(function() {
			elementWidth = $(this).width();
			elementHeight = $(this).height();
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
		init: function() {
			imageSize = settings.tileSize * Math.pow(2, settings.zoom);
			tiles = [];
			columns = Math.ceil(elementWidth / settings.tileSize) + 1;
			rows = Math.ceil(elementHeight / settings.tileSize) + 1;
	    $.fn.imageviewer.methods.create();
		},
		/*
		 *	Creating the tiles.
		 *
		 */
		create: function() {
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
						html: '<img class="imageviewer-tile">'
					};
					image = $.fn.imageviewer.methods.imageSource(tile);
					tile.html = '<img class="imageviewer-tile" src="'+image+'">';
					group.push(tile);
				}
				tiles.push(group)
			}
			console.log(tiles)	
		},
		/*
		 *	Find the image source.
		 *	If outside image area use an empty image.
		 *
		 */
		imageSource: function(tile) {
	    var imageSource = settings.fileLocation + '/imageviewer-tile-' + settings.zoom + '-' + tile.column + '-' + tile.row + settings.fileType;
			if (tile.column < 0 || tile.column >= Math.pow(2, settings.zoom) || tile.row < 0  || tile.row >= Math.pow(2, settings.zoom)) {
				imageSource = settings.fileLocation + '/imageviewer-tile-empty' + settings.fileType;
			}
			return imageSource;
		}
	};
})( jQuery );