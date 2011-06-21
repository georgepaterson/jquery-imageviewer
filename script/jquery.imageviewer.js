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
			self = $(this);
			self.width = $(this).width();
			self.height = $(this).height();
			self.offset = $(this).offset();
			$.fn.imageviewer.methods.init();
		});
	};
	/*
	 *	Default options, can be extend by options passed to the function.
	 *
	 */
	$.fn.imageviewer.defaults = {
		location: 'image',
		type: '.png',
		size: 256,
		zoom: 1
	};
	$.fn.imageviewer.methods = {
		/*
		 *	Initialising method.
		 *
		 */	
		init: function () {
			tiles = [];
			image = {
				size: settings.size * Math.pow(2, settings.zoom),
				columns: Math.ceil(self.width / settings.size) + 1,
				rows: Math.ceil(self.height / settings.size) + 1
			};
			image.center = {
				horizontal: ((image.size - self.width) / -2), 
				vertical: ((image.size - self.height) / -2)
			};
			image.start = {
				horizontal: 0,
				vertical: 0
			};
			image.position = {
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
				source = null;
			for ( i = 0; i < image.columns; i++) {
				var group = [];
				for ( j = 0; j < image.rows; j++) {
					tile = {
						column: i, 
						row: j,
						vertical: 0,
						horizontal: 0,
						html: null
					};
					tile.html = $('<img class="imageviewer-tile" style="top: '+ tile.vertical +'px; left: '+ tile.horizontal +'px;">');
					$('.imageviewer-frame', self).append(tile.html);
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
		source: function (tile) {
	    var source = settings.location + '/imageviewer-tile-' + settings.zoom + '-' + tile.column + '-' + tile.row + settings.type;
			if (tile.column < 0 || tile.column >= Math.pow(2, settings.zoom) || tile.row < 0  || tile.row >= Math.pow(2, settings.zoom)) {
				source = settings.location + '/imageviewer-tile-empty' + settings.type;
			}
			return source;
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
				tile = [],
				source = null;
			for ( i = 0; i < tiles.length; i++) {
				for ( j = 0; j < tiles[i].length; j++) {
					tile = tiles[i][j];
					tile.vertical = (tile.row * settings.size) + image.center.vertical + (image.position.vertical - image.start.vertical);
					tile.horizontal = (tile.column * settings.size) + image.center.horizontal + (image.position.horizontal - image.start.horizontal);
					if (tile.vertical > self.height) {
						while (tile.vertical > self.height) {
							tile.row -= tiles[i].length;
							tile.vertical = (tile.row * settings.size) + image.center.vertical + (image.position.vertical - image.start.vertical);
						}
					} 
					else {
						while (tile.vertical < (-settings.size)) {
							tile.row += tiles[i].length;
							tile.vertical = (tile.row * settings.size) + image.center.vertical + (image.position.vertical - image.start.vertical);
						}
					}
					if (tile.horizontal > self.width) {
						while (tile.horizontal > self.width) {
							tile.column -= tiles.length;
							tile.horizontal = (tile.column * settings.size) + image.center.horizontal + (image.position.horizontal - image.start.horizontal);
						}
					} 
					else {
						while (tile.horizontal < (-settings.size)) {
							tile.column += tiles.length;
							tile.horizontal = (tile.column * settings.size) + image.center.horizontal + (image.position.horizontal - image.start.horizontal);
						}
					}
					tile.html.css({'top' : tile.vertical +'px', 'left': tile.horizontal +'px'});
					source = $.fn.imageviewer.methods.source(tile);
					tile.html.attr('src', source);
				}
			}
		},
		pan: function () {
			/*
			 *	Prevents the image self being independently dragged.
			 *	
			 */
			$('img', self).bind('dragstart', function (event) {
				return false;
			});
			/*
			 * Bind mouse down, move and up events to pan the image.
			 *	
			 */
			$('.imageviewer-interface', self).bind('mousedown', function (event) {
				image.start.horizontal = (event.pageX - self.offset.left);
				image.start.vertical = (event.pageY - self.offset.top);
				$('.imageviewer-interface', self).bind('mousemove', function (event) {
					image.position.horizontal = (event.pageX - self.offset.left);
					image.position.vertical = (event.pageY - self.offset.top);
					$.fn.imageviewer.methods.position();
				});
			});
			$('.imageviewer-interface', self).bind('mouseup', function (event) {
				$('.imageviewer-interface', self).unbind('mousemove');
				image.center.horizontal += (image.position.horizontal - image.start.horizontal);
        image.center.vertical += (image.position.vertical - image.start.vertical);
			});
		}
	};
})( jQuery );