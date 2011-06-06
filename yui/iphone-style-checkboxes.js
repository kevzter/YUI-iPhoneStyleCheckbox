/*!
 // iPhone-style Checkboxes using YUI 2 api
 // Copyright Thomas Reynolds, licensed GPL & MIT
 */
(function() {

	if (typeof YAHOO != "undefined") {
		// Constructor
		var $Y = YAHOO,
		$L = $Y.lang,
		$D = $Y.util.Dom,
		$E = $Y.util.Event,
		$S = $Y.util.Selector;

		$Y.namespace("widget");
		$Y.widget.iPhoneStyle = function(sSelector, oConfig) {
			var aELs, eContainer, i;

			oConfig = $L.merge({
				duration :  0.2,
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
				statusChange: function(eCheck) {
				}
			}, oConfig || {});

			if ($L.isString(sSelector)) {
				aELs = $S.query(sSelector);
			} else if ($L.isArray(sSelector)) {
				aELs = sSelector;
			} else {
				aELs = [sSelector];
			}
			for (i = 0; i < aELs.length; ++i) {
				eContainer = aELs[i];
				if (!eContainer || eContainer.iPhoneStyle) {
					continue;
				}
				eContainer.iPhoneStyle = new function() {
					var aELs, eCheck, eHandle, eOffLabel, eOffSpan, eOnLabel, eOnSpan, iRt, fDown, fMove, fUp, fStop, fIESelect,
					bClicking = false, bDragging = false, iDragStart = 0;
					
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
					if (oConfig.resizeHandle) {
						iMin = ($D.getRegion(eOnLabel).width < $D.getRegion(eOffLabel).width) ? $D.getRegion(eOnLabel).width : $D.getRegion(eOffLabel).width;
						$D.setStyle(eHandle, "width", iMin + 'px');
					}
					if (oConfig.resizeContainer) {
						iMax = ($D.getRegion(eOnLabel).width > $D.getRegion(eOffLabel).width) ? $D.getRegion(eOnLabel).width : $D.getRegion(eOffLabel).width;
						$D.setStyle(eContainer, "width", iMax + $D.getRegion(eHandle).width + 12 + 'px');
					}
					$D.setStyle(eOffLabel, "width", $D.getRegion(eContainer).width - 5  + 'px');
					iRt = $D.getRegion(eContainer).width - $D.getRegion(eHandle).width - 3;
					if (eCheck.checked) {
						$D.setStyle(eHandle, "left", iRt + 'px');
						$D.setStyle(eOnLabel, "width", iRt + 4 + 'px');
						$D.setStyle(eOffSpan, "marginRight",  iRt + 'px');
					} else {
						$D.setStyle(eHandle, "left", 0);
						$D.setStyle(eOnLabel, "width", 0);
						$D.setStyle(eOnSpan, "marginLeft",  iRt + 'px');
					}
					eCheck.fChange = function() {
						var iTo = (this.checked ? iRt : 0);
						
						if ($Y.util.Anim) {
							new $Y.util.Anim(eHandle, {
								left: {
									to : iTo
								}
							}, oConfig.duration).animate();
							new $Y.util.Anim(eOnLabel, {
								width: {
									to : iTo + 4
								}
							}, oConfig.duration).animate();
							new $Y.util.Anim(eOffSpan, {
								marginRight: {
									to : iTo
								}
							}, oConfig.duration).animate();
							new $Y.util.Anim(eOnSpan, {
								marginLeft: {
									to : iTo - iRt
								}
							}, oConfig.duration).animate();
						} else {
							$D.setStyle(eHandle, "left", iTo + "px");
							$D.setStyle(eOnLabel, "width", iTo + 4 + "px");
							$D.setStyle(eOffSpan, "marginRight", iTo + "px");
							$D.setStyle(eOnSpan, "marginLeft", iTo - iRt + "px");
						}
						oConfig.statusChange(eCheck);
					};
					$E.on(eCheck, 'change', eCheck.fChange);
					fDown = function(e) {
						var x = $E.getPageX(e);
				
						if (e.changedTouches) {
							x = e.changedTouches[0].pageX;
						}
						bClicking = true;
						iDragStart = x - (parseInt($D.getStyle(eHandle, 'left'), 10) || 0);
						$E.stopEvent(e);
					};
					$E.on(eContainer, 'mousedown', fDown);
					$E.on(eContainer, 'touchstart', fDown);
					fMove = function(e) {
						var p, x = $E.getPageX(e);
				
						if (bClicking) {
							$E.stopEvent(e);
							if (e.changedTouches) {
								x = e.changedTouches[0].pageX;
							}
							if (x != iDragStart) {
								bDragging = true;
							}
							p = (x - iDragStart) / iRt;
							if (p < 0) {
								p = 0;
							}
							if (p > 1) {
								p = 1;
							}
							$D.setStyle(eHandle, "left",  p * iRt + 'px');
							$D.setStyle(eOnLabel, "width", p * iRt + 4 + 'px');
							$D.setStyle(eOffSpan, "marginRight", p * iRt + 'px');
							$D.setStyle(eOnSpan, "marginLeft", -(1 - p) * iRt + 'px');
						}
					};
					$E.on(document, 'mousemove', fMove);
					$E.on(document, 'touchmove', fMove);
					$E.on(eContainer, 'mousedown', function(e) {
						$E.stopEvent(e);
						bClicking = true;
						iDragStart = $E.getPageX(e) - (parseInt($D.getStyle(eHandle, 'left'), 10) || 0);
						return false;
					});
					fUp = function(e) {
						var p, x = $E.getPageX(e);
						if (bClicking) {
							$E.stopEvent(e);
							if (!bDragging) {
								eCheck.checked = !eCheck.checked;
							} else {
								if (e.changedTouches) {
									x = e.changedTouches[0].pageX;
								}
								 p = (x - iDragStart) / iRt;
								eCheck.checked = (p >= 0.5);
							}
							bClicking = false;
							bDragging = false;
							eCheck.fChange();
						}
					};
					$E.on(document, 'touchend', fUp);
					$E.on(document, 'mouseup', fUp);
					fStop = function(e) {
						$E.preventDefault(e);
						return false;
					};
					$E.on(eContainer, 'mousedown', fStop);
					$E.on(eOnLabel, 'mousedown', fStop);
					$E.on(eOffLabel, 'mousedown', fStop);
					$E.on(eHandle, 'mousedown', fStop);
					if ($Y.env.ua.ie) {
						fIESelect = function(e) {
							$E.stopEvent(e);
							return false;
						};
						$E.on(eContainer, 'startselect', fIESelect);
						$E.on(eOnLabel, 'startselect', fIESelect);
						$E.on(eOffLabel, 'startselect', fIESelect);
						$E.on(eHandle, 'startselect', fIESelect);
					}
				}
			};
		};
	}
})();