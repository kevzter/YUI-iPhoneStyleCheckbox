(function() {

	if (typeof YAHOO != "undefined") {
		// Constructor
		var $Y = YAHOO,
		$L = $Y.lang,
		$D = $Y.util.Dom,
		$E = $Y.util.Event,
		$S = $Y.util.Selector;

		$Y.namespace("widget");
		$Y.widget.iPhoneStyle = function(elem, options) {
			var eContainer = $S.query(elem),
				oConfig = $L.merge({
						duration :  1,
						checkedLabel : 'ON',
						uncheckedLabel : 'OFF',
						resizeHandle : true,
						resizeContainer : true,
						background : '#fff',
						statusClass : 'checkRendered',
						containerClass : 'iPhoneCheckContainer',
						labelOnClass : 'iPhoneCheckLabelOn',
						labelOffClass : 'iPhoneCheckLabelOff',
						handleClass : 'iPhoneCheckHandle',
						handleCenterClass : 'iPhoneCheckHandleCenter',
						handleRightClass : 'iPhoneCheckHandleRight',
						clicking : false,
						dragging : false,
						dragStartPosition : 0,
						statusChange: function(eCheck) {
					}
				}, options || {}),
				eCheck, eHandle, eOffLabel, eOffSpan, eOnLabel, eOnSpan, eContainer, iRt, fDown, fMove, fUp, fStop;
			
			// Initialize the control
			wrapCheckboxWithDivs();
			attachEvents();
			disableTextSelection();

			if (oConfig.resizeHandle) {
				optionallyResize('handle');
			}
			if (oConfig.resizeContainer) {
				optionallyResize('container');
			}
			initialPosition();
			
			function wrapCheckboxWithDivs() {
				$D.addClass(eContainer, oConfig.containerClass);
				eCheck  = $S.query('input[type=checkbox]', eContainer, true);
				$D.addClass(eCheck, oConfig.statusClass);
				$D.setStyle(eCheck, "opacity", 0);
				eHandle = document.createElement('div');
				$D.addClass(eHandle, oConfig.handleClass);
				eHandle.innerHTML = '<div class="' + oConfig.handleRightClass + '"><div class="' + oConfig.handleCenterClass +'"></div></div>';
				$D.insertAfter(eHandle, eCheck);
				eOnLabel = document.createElement("label");
				$D.addClass(eOnLabel, oConfig.labelOnClass);
				eOnSpan = document.createElement('span');
				eOnSpan.innerHTML = oConfig.checkedLabel;
				eOnLabel.appendChild(eOnSpan);
				$D.insertAfter(eOnLabel, eCheck);
				eOffLabel = document.createElement("label");
				$D.addClass(eOffLabel, oConfig.labelOffClass);
				eOffSpan = document.createElement('span');
				eOffSpan.innerHTML = oConfig.uncheckedLabel;
				eOffLabel.appendChild(eOffSpan);
				$D.insertAfter(eOffLabel, eCheck);
			}
			
			function disableTextSelection() {
				if (!$Y.lang.ua.ie) {
					return;
				}
				eHandle.unselectable = "on";
				eOffLabel.unselectable = "on";
				eOnLabel.unselectable = "on";
				eContainer.unselectable = "on";
			}
			
			function optionallyResize(mode) {
				var onLabelWidth = $D.getRegion(eOnLabel).width,
					offLabelWidth = $D.getRegion(eOffLabel).width,
					newWidth;

				if (mode == 'container') {
					newWidth = (onLabelWidth > offLabelWidth) ? onLabelWidth : offLabelWidth;
					newWidth += $D.getRegion(eHandle).width + 15;
					$D.setStyle(eContainer, "width", newWidth + 'px');
				} else {
					newWidth = (onLabelWidth < offLabelWidth) ? onLabelWidth : offLabelWidth;
					$D.setStyle(eHandle, "width", newWidth + 'px');
				}
			}
			
			function fDown(ev) {
				var x = $E.getPageX(ev) || ev.originalEvent.changedTouches[0].pageX;;
				
				$E.preventDefault(ev);
				if (eCheck.disabled) {
					return;
				}
				$[iphoneStyle].currentlyClicking = obj.handle;
			                                    $[iphoneStyle].dragStartPosition = x;
			                                    $[iphoneStyle].handleLeftOffset = parseInt(
			                                            obj.handle.css('left'),
			                                            10) || 0;
			                                    $[iphoneStyle].dragStartedOn = obj.$elem;
		                                    }
			
			function attachEvents() {
				$E.on()
		                    this.container
		                            .bind(
		                                    'mousedown touchstart',
		                                    function(event) {
			                                    event.preventDefault();

			                                    if (obj.$elem.is(':disabled')) {
				                                    return;
			                                    }

			                                    var x = event.pageX
			                                            || event.originalEvent.changedTouches[0].pageX;
			                                    $[iphoneStyle].currentlyClicking = obj.handle;
			                                    $[iphoneStyle].dragStartPosition = x;
			                                    $[iphoneStyle].handleLeftOffset = parseInt(
			                                            obj.handle.css('left'),
			                                            10) || 0;
			                                    $[iphoneStyle].dragStartedOn = obj.$elem;
		                                    })

		                            // Utilize event bubbling to handle drag on
									// any element beneath the container
		                            .bind(
		                                    'iPhoneDrag',
		                                    function(event, x) {
			                                    event.preventDefault();

			                                    if (obj.$elem.is(':disabled')) {
				                                    return;
			                                    }
			                                    if (obj.$elem != $[iphoneStyle].dragStartedOn) {
				                                    return;
			                                    }

			                                    var p = (x
			                                            + $[iphoneStyle].handleLeftOffset - $[iphoneStyle].dragStartPosition)
			                                            / obj.rightSide;
			                                    if (p < 0) {
				                                    p = 0;
			                                    }
			                                    if (p > 1) {
				                                    p = 1;
			                                    }
			                                    obj.handle.css({
				                                    left : p * obj.rightSide
			                                    });
			                                    obj.onLabel.css({
				                                    width : p * obj.rightSide
				                                            + 4
			                                    });
			                                    obj.offSpan.css({
				                                    marginRight : -p
				                                            * obj.rightSide
			                                    });
			                                    obj.onSpan.css({
				                                    marginLeft : -(1 - p)
				                                            * obj.rightSide
			                                    });
		                                    })

		                            // Utilize event bubbling to handle drag end
									// on any element beneath the container
		                            .bind(
		                                    'iPhoneDragEnd',
		                                    function(event, x) {
			                                    if (obj.$elem.is(':disabled')) {
				                                    return;
			                                    }

			                                    var checked;
			                                    if ($[iphoneStyle].dragging) {
				                                    var p = (x - $[iphoneStyle].dragStartPosition)
				                                            / obj.rightSide;
				                                    checked = (p < 0) ? Math
				                                            .abs(p) < 0.5
				                                            : p >= 0.5;
			                                    } else {
				                                    checked = !obj.$elem
				                                            .attr('checked');
			                                    }

			                                    obj.$elem.attr('checked',
			                                            checked);

			                                    $[iphoneStyle].currentlyClicking = null;
			                                    $[iphoneStyle].dragging = null;
			                                    obj.$elem.change();
		                                    });

		                    // Animate when we get a change event
		                    this.$elem
		                            .change(function() {
			                            if (obj.$elem.is(':disabled')) {
				                            obj.container
				                                    .addClass(obj.disabledClass);
				                            return false;
			                            } else {
				                            obj.container
				                                    .removeClass(obj.disabledClass);
			                            }

			                            var new_left = obj.$elem
			                                    .attr('checked') ? obj.rightSide
			                                    : 0;

			                            obj.handle.animate({
				                            left : new_left
			                            }, obj.duration);
			                            obj.onLabel.animate({
				                            width : new_left + 4
			                            }, obj.duration);
			                            obj.offSpan.animate({
				                            marginRight : -new_left
			                            }, obj.duration);
			                            obj.onSpan.animate({
				                            marginLeft : new_left
				                                    - obj.rightSide
			                            }, obj.duration);
		                            });
	                    },


		};

	$
	        .extend(
	                $[iphoneStyle].prototype,
	                {


	                    // Setup the control's inital position
	                    initialPosition : function() {
		                    this.offLabel.css({
			                    width : this.container.width() - 5
		                    });

		                    var offset = ($.browser.msie && $.browser.version < 7) ? 3
		                            : 6;
		                    this.rightSide = this.container.width()
		                            - this.handle.width() - offset;

		                    if (this.$elem.is(':checked')) {
			                    this.handle.css({
				                    left : this.rightSide
			                    });
			                    this.onLabel.css({
				                    width : this.rightSide + 4
			                    });
			                    this.offSpan.css({
				                    marginRight : -this.rightSide
			                    });
		                    } else {
			                    this.onLabel.css({
				                    width : 0
			                    });
			                    this.onSpan.css({
				                    marginLeft : -this.rightSide
			                    });
		                    }

		                    if (this.$elem.is(':disabled')) {
			                    this.container.addClass(this.disabledClass);
		                    }
	                    }
	                });

	// jQuery-specific code
	$.fn[iphoneStyle] = function(options) {
		var checkboxes = this.filter(':checkbox');

		// Fail early if we don't have any checkboxes passed in
		if (!checkboxes.length) {
			return this;
		}

		// Merge options passed in with global defaults
		var opt = $.extend({}, $[iphoneStyle].defaults, options);

		checkboxes.each(function() {
			$(this).data(iphoneStyle, new $[iphoneStyle](this, opt));
		});

		if (!$[iphoneStyle].initComplete) {
			// As the mouse moves on the page, animate if we are in a drag state
			$(document).bind(
			        'mousemove touchmove',
			        function(event) {
				        if (!$[iphoneStyle].currentlyClicking) {
					        return;
				        }
				        event.preventDefault();

				        var x = event.pageX
				                || event.originalEvent.changedTouches[0].pageX;
				        if (!$[iphoneStyle].dragging
				                && (Math.abs($[iphoneStyle].dragStartPosition
				                        - x) > opt.dragThreshold)) {
					        $[iphoneStyle].dragging = true;
				        }

				        $(event.target).trigger('iPhoneDrag', [ x ]);
			        })

			// When the mouse comes up, leave drag state
			.bind(
			        'mouseup touchend',
			        function(event) {
				        if (!$[iphoneStyle].currentlyClicking) {
					        return;
				        }
				        event.preventDefault();

				        var x = event.pageX
				                || event.originalEvent.changedTouches[0].pageX;
				        $($[iphoneStyle].currentlyClicking).trigger(
				                'iPhoneDragEnd', [ x ]);
			        });

			$[iphoneStyle].initComplete = true;
		}

		return this;
	}; // End of $.fn[iphoneStyle]

	$[iphoneStyle].defaults = {
	    duration : 200, // Time spent during slide animation
	    checkedLabel : 'ON', // Text content of "on" state
	    uncheckedLabel : 'OFF', // Text content of "off" state
	    resizeHandle : true, // Automatically resize the handle to cover
								// either label
	    resizeContainer : true, // Automatically resize the widget to contain
								// the labels
	    disabledClass : 'iPhoneCheckDisabled',
	    containerClass : 'iPhoneCheckContainer',
	    labelOnClass : 'iPhoneCheckLabelOn',
	    labelOffClass : 'iPhoneCheckLabelOff',
	    handleClass : 'iPhoneCheckHandle',
	    handleCenterClass : 'iPhoneCheckHandleCenter',
	    handleRightClass : 'iPhoneCheckHandleRight',
	    dragThreshold : 5
	// Pixels that must be dragged for a click to be ignored
	};

})(jQuery, 'iphoneStyle');
