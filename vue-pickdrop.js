'use strict';

exports.install = function(Vue, options) {
    var drag = null;

    document.addEventListener('mousemove', function(e) {
        if (drag) {
            e.preventDefault();
            var mouseMoveEvent = document.createEvent('CustomEvent');
            mouseMoveEvent.initCustomEvent('pickdrag:move', true, true, e);
            drag.dispatchEvent(mouseMoveEvent);
        }
    })

    function emit(vnode, name, data) {
        var handlers = (vnode.data && vnode.data.on) ||
            (vnode.componentOptions && vnode.componentOptions.listeners);

        if (handlers && handlers[name]) {
            handlers[name].fns(data);
        }
    }

    Vue.directive('pickdrag', {
        bind: function(el, binding, vnode) {

            var tags = Object.keys(binding.modifiers);
            var data = binding.value || binding.expression;
            var startX = 0;
            var startY = 0;
            var underTouch = [];
            var isMouseDown = false;

            /* CUSTOM EVENTS */

            var touchOverEvent = document.createEvent('Event');
            touchOverEvent.initEvent('pickdrop:over', true, true);

            var touchEnterEvent = document.createEvent('CustomEvent');
            touchEnterEvent.initCustomEvent('pickdrop:enter', true, true, { tags: tags });

            var touchLeaveEvent = document.createEvent('Event');
            touchLeaveEvent.initEvent('pickdrop:leave', true, true);

            var touchDropEvent = document.createEvent('CustomEvent');
            touchDropEvent.initCustomEvent('pickdrop:drop', true, true, { tags: tags, data: data });

            /* INITIAL STATE */

            el.setAttribute('draggable', true);

            el.ondragstart = function() {
                return false;
            };


            /* EVENT LISTENERS */

            el.addEventListener('touchstart', function(e) {
                e.preventDefault();
                onStart(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }, { passive: false })

            el.addEventListener('touchmove', function(e) {
                e.preventDefault();
                onMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }, { passive: false })

            el.addEventListener('touchend', function(e) {
                onEnd();
            })

            el.addEventListener('mousedown', function(e) {
                if (e.which === 1) {
                    isMouseDown = true;
                    onStart(e.clientX, e.clientY);
                }
            })

            el.addEventListener('mousemove', function(e) {
                if (!drag && isMouseDown) {
                    drag = e.target;
                    onStart(e.clientX, e.clientY);
                }
            })

            el.addEventListener('pickdrag:move', function(e) {
                e.preventDefault();
                onMove(e.detail.clientX, e.detail.clientY);
            })

            el.addEventListener('mouseup', function(e) {
                if (e.which === 1) {
                    isMouseDown = false;
                }
                drag = null;
                onEnd();
            })

            function onStart(x, y) {
                el.classList.add('pickdrag');
                el.style.zIndex = 99999;
                el.style.position = 'relative';
                startX = x;
                startY = y;
            }

            function onMove(x, y) {
                var deltaX = x - startX;
                var deltaY = y - startY;
                setPosition(deltaX, deltaY);

                var currentDrops = document.elementsFromPoint(x, y)
                    .filter(function(elm) {
                        if (elm !== el && elm.getAttribute('droppable')) {
                            if (underTouch.indexOf(elm) < 0) {
                                elm.dispatchEvent(touchEnterEvent);
                                underTouch.push(elm);
                            }

                            elm.dispatchEvent(touchOverEvent);
                            return true;
                        }
                    });

                underTouch = underTouch.filter(function(u) {
                    if (currentDrops.indexOf(u) < 0) {
                        u.dispatchEvent(touchLeaveEvent);
                        return false;
                    }
                    return true;
                })

            }

            function onEnd() {
                el.classList.remove('pickdrag');
                el.style.zIndex = null;
                setPosition(0, 0);
                underTouch = underTouch.filter(function(u) {
                    u.dispatchEvent(touchLeaveEvent);
                    u.dispatchEvent(touchDropEvent);
                    return false;
                })
            }

            function setPosition(x, y) {
                el.style.transform = "translate3d(" + x + "px, " + y + "px, 0px)";
            }
        },
        unbind: function(el) {
            el.removeEventLister('touchstart');
            el.removeEventLister('touchmove');
            el.removeEventLister('touchend');
            el.removeEventLister('pickdrag:move');

            el.removeEventLister('mousedown');
            el.removeEventLister('mousemove');
            el.removeEventLister('mouseup');
        }
    })

    Vue.directive('pickdrop', {
        bind: function(el, binding, vnode) {

            var tags = Object.keys(binding.modifiers);
            var data = binding.value || binding.expression;

            el.setAttribute('droppable', true);

            el.addEventListener('pickdrop:enter', function(e) {
                if (checkTags(e)) {
                    el.classList.add('pickdrop')
                }
            });

            el.addEventListener('pickdrop:leave', function() {
                el.classList.remove('pickdrop')
            });

            el.addEventListener('pickdrop:drop', function(e) {
                if (checkTags(e)) {
                    emit(vnode, 'drop', { dragData: e.detail.data, dropData: data });
                }
            })

            function checkTags(e) {
                return tags.length === 0 || tags.some(t => e.detail.tags.indexOf(t) >= 0);
            }
        },
        unbind: function(el) {
            el.removeEventLister('pickdrop:enter');
            el.removeEventLister('pickdrop:leave');
            el.removeEventLister('pickdrop:drop');
        }
    })
}