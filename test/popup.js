(function($){
    $.fn.popup = function(options) {  
        var opt = {
            //опции
            'push_teg': 'popup_wr',   //тег, на который нужно наводить, нажимать
            'event': 'hover',   // событие при котором всплывает окно:
                                // click - клик, hover - при наведении
            'position': 'left',  // возможные варианты:
                                // top - cверху, bottom - снизу, left - слева, right - справа
                                // another - имя класса, свои личные настройки в css
            'maxWidth': 230,   // максимальная длина попапа
            'maxHeight': 230,
            'fadeSpeed': 400
	};

        return this.each(function(){
            if (options) {
                    $.extend(opt, options);
            }
            
            var popup = $(this);
            var popup_this = this;
            
            popup.addClass(opt.position);
            popup.find('.popup_arrow').addClass(opt.position);
            
            if(opt.position == 'top' || opt.position == 'bottom'){
                var w = popup.width();
                if(w < opt.maxWidth){
                    popup.css('width', w);
                }else{
                    popup.css('width', opt.maxWidth);
                }
                offset_left(popup)
                height =  + popup.children('.popup_arrow').outerHeight() + popup.parent().outerHeight();
            }else if(opt.position == 'left' || opt.position == 'right'){
                var h = $(this).height();
                if(h < opt.maxHeight){
                    popup.css('height', h);
                }else{
                    popup.css('height', opt.maxHeight);
                }
                offset_top(popup);
                width =  + popup.children('.popup_arrow').outerWidth() + popup.parent().outerWidth();
            }
            
            if(opt.position == 'top'){
                $(this).css('bottom',height-3+10)
            }else if(opt.position == 'bottom'){
                $(this).css('top',height-3+10)
            }else if(opt.position == 'left'){
                $(this).css('right',width-3+10)
            }else if(opt.position == 'right'){
                $(this).css('left',width-3+10)
            }
            
            if(opt.event == 'hover'){ // если событие "при наведении"
                $('.' + opt.push_teg).hover(function(e) {
                    el = $(this).find(popup_this);
                    if(opt.position == 'top'){
                        if(!is_old_ie()){
                            el.stop(true, true).animate({opacity: "show", bottom: height-3}, "slow");
                        }else{
                            el.hoverFlow(e.type, { opacity: "show", bottom: height-3 }, "slow");
                        }
                    }else if(opt.position == 'bottom'){
                        if(!is_old_ie()){
                            el.stop(true, true).animate({opacity: "show", top: height-3}, "slow");
                        }else{
                            el.hoverFlow(e.type, { opacity: "show", top: height-3 }, "slow");
                        }
                    }else if(opt.position == 'left'){
                        if(!is_old_ie()){
                            el.stop(true, true).animate({opacity: "show", right: width-3}, "slow");
                        }else{
                            el.hoverFlow(e.type, { opacity: "show", right: width-3 }, "slow");
                        }
                    }else if(opt.position == 'right'){
                        if(!is_old_ie()){
                            el.stop(true, true).animate({opacity: "show", left: width-3}, "slow");
                        }else{
                            el.hoverFlow(e.type, { opacity: "show", left: width-3 }, "slow");
                        }
                    }
                }, function(e) {
                    if(opt.position == 'top'){
                        if(!is_old_ie()){
                            popup.stop(true, true).animate({opacity: "hide", bottom: height-3+10}, "fast");
                        }else{
                            popup.hoverFlow(e.type, { opacity: "hide", bottom: height-3+10 }, "fast");
                        }
                    }else if(opt.position == 'bottom'){
                        if(!is_old_ie()){
                            popup.stop(true, true).animate({opacity: "hide", top: height-3+10}, "fast");
                        }else{
                            popup.hoverFlow(e.type, { opacity: "hide", top: height-3+10 }, "fast");
                        }     
                    }else if(opt.position == 'left'){
                        if(!is_old_ie()){
                            popup.stop(true, true).animate({opacity: "hide", right: width-3+10}, "fast");
                        }else{
                            popup.hoverFlow(e.type, { opacity: "hide", right: width-3+10 }, "fast");
                        }
                    }else if(opt.position == 'right'){
                        if(!is_old_ie()){
                            popup.stop(true, true).animate({opacity: "hide", left: width-3+10}, "fast");
                        }else{
                            popup.hoverFlow(e.type, { opacity: "hide", left: width-3+10 }, "fast");
                        }
                    }
                });
            }else if(opt.event == 'click'){ // если событие "клик"
                $('.' + opt.push_teg).click(function(e){
                    el = $(this).parent().find(popup_this);
                    if(opt.position == 'top'){
                        el.animate({opacity: "show", bottom: height-3}, "slow");
                    }else if(opt.position == 'bottom'){
                        el.animate({opacity: "show", top: height-3}, "slow");
                    }else if(opt.position == 'left'){
                        el.animate({opacity: "show", right: width-3}, "slow");
                    }else if(opt.position == 'right'){
                        el.animate({opacity: "show", left: width-3}, "slow");
                    }
                });
            }
            
            $('.popup_close').bind('click',function(e){
                if(opt.position == 'top'){
                    popup.animate({opacity: "hide", bottom: height-3+10}, "fast");
                }else if(opt.position == 'bottom'){
                    popup.animate({opacity: "hide", top: height-3+10}, "fast");
                }else if(opt.position == 'left'){
                    popup.animate({opacity: "hide", right: width-3+10}, "fast");
                }else if(opt.position == 'right'){
                    popup.animate({opacity: "hide", left: width-3+10}, "fast");
                }
            });
            
            var is_old_ie = function(){
                return ($.browser.msie && $.browser.version <= 8.0) ? true : false;
            }
            
        })
        function offset_top(el){ //центрируем элемент по высоте
            var h = el.outerHeight();
            var w = el.outerWidth();
            el.css('margin-top', -h/2);
            //return w;
        }
        function offset_left(el){ //центрируем элемент по длине
            var w = el.outerWidth();
            var h = el.outerHeight();
            el.css('margin-left', -w/2);
            //return h;
        }
        
    };
})(jQuery);            