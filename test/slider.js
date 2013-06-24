(function($){
	$.fn.slider = function(options) {
            var opt = {
			// �����
                        'slide_teg': 'div', // ��� � ������� ���������� �����
                        'width': 240, // ������ � ������ �����������
                        'height': 320,
                        'position': 'bottom', // ��������� ���������
                        'bullets': false, // �������� �������� ���������
                        'thumbs':  false, // �������� ��������� �����������
                        'row': 4, // �������� �� ������
                        'thumbs_essence': 'another_pic', //�������� ��������:
                                                      // same_pic - ����������� �������� �� ������
                                                      // another_pic - ������ ��������
                        'another_pic_class': 'thumbs_another_pic',
                        'pagination':  true, // �������� ��������� ��������
                        'caption': false, // �������� ��������
                        'animation': 'fade',  //�������� ��������:
                                                    // 'fade' - ��������� �������
                                                    // 'transition' - ������� �������
                        'transition_direction': 'horizontal',   // ����������� ��������
                                                                // vertical - ������������
                                                                // horizontal - ��������������
                        'transition_var': 'simple',      // 'simple' - �������
                                                                  // 'each_to_another'
                        'start_slide': 1, // ����� � �������� ������� ��������
                        'auto': false, // ����������������
                        'autoSpeed': 5000, // �������� ����� ������� ��� ����������������
                        'fadeSpeed': 500 //�������� ��������� ������ ��� �����
		};

		return this.each(function() {
			if (options) {
				$.extend(opt, options);
			}
                        
                        // ��������
                        
                        $(this).children(opt.slide_teg)
                               .addClass('slide');      
                        if(opt.bullets == true){
                            $(this).append('<div class="prev"/>')
                                   .append('<div class="next"/>');
                        }
                        
                        if(opt.position == 'top' || opt.position == 'left'){
                            $(this).prepend('<div class="navigation"/>');
                        }else{
                            $(this).append('<div class="navigation"/>');
                        }
                        
                        
                        if(opt.thumbs == true){
                            $(this).find('.navigation').append('<div class="thumbs"/>');
                        }
                        if(opt.pagination == true){
                            $(this).find('.navigation').append('<div class="pagination"/>');
                        }
                        $(this).children('.slide')
                               .wrapAll('<div class="slider_wrapper" />');
                        
                        $(this).children()
                               .wrapAll('<div class="slider" />');
                               
                        var container = $(this).find('.slider');
                        var slider_wrapper = container.find('.slider_wrapper');
                        var nav = container.find('.navigation');
                               
                        slider_wrapper.find('.slide').each(function(i){
                            
                            i++;
                            // ���������� ����������� ��������
                            if(opt.thumbs == true){
                                nav.find('.thumbs')
                                   .append('<div class="thumb"/>');
                                switch (opt.thumbs_essence){ 
                                    case 'same_pic': // ���� ��������� - �� �� ��������
                                        nav.find('.thumb')
                                           .eq($(this).index())
                                           .append ('<img src="' + $(this)
                                           .find('img')
                                           .attr('src') + '" />');
                                        break;
                                    case 'another_pic': // ���� ��������� - ������ ��������
                                        nav.find('.thumb')
                                           .eq($(this).index())
                                           .append ('<img src="' + $('.' + opt.another_pic_class)
                                           .find('img')
                                           .eq($(this).index())
                                           .attr('src') + '" />');
                                        break;
                                }                               
                            }
                            // ���������� ���������
                            if(opt.pagination == true){
                                nav.find('.pagination')
                                   .append('<div class="paginate"/>');
                            }   
                        });
                        nav.find('.thumbs').append('<div class="clear"/>');
                        // ���������� ��������
                        if(opt.caption == true){
                            $(this).find('p').addClass('caption');
                        }
                        
                        // ������ ������� obj
                        
                        var obj = function(){
                               
                            //��������� �������� ������� obj

                            this.slide = slider_wrapper.find('.slide');
                            this.next = container.find('.next');
                            this.prev = container.find('.prev');
                            this.thumb = nav.find('.thumb');
                            this.paginate = nav.find('.paginate');

                            //��������� ������ ������� obj
                            
                            this.getCurrentIndex = function(){ // ������� ������ �������� ������
                                return this.slide.filter('.current').index();
                            }

                            this.fade = function(index){ // ��������� �������� - ���������
                                this.slide.addClass('fade');
                                this.slide.removeClass('current')
                                     .fadeOut(opt.fadeSpeed)
                                     .eq(index)
                                     .fadeIn(opt.fadeSpeed)
                                     .addClass('current');

                            }
//                            this.transition = function(index){ // ��������� �������� - ������� �������
//                                if(opt.transition_var == 'each_to_another'){
//                                    transition_indent = 0;
//                                }
//                                this.slide.not('.current')
//                                          .hide()
//                                if(opt.transition_direction == 'horizontal'){
//                                    if(opt.transition_var == 'simple'){
//                                        transition_indent = opt.width;
//                                    }
//                                    if(this.getCurrentIndex() > index){
//                                        this.slide.eq(index)
//                                                  .show()
//                                                  .css('left',-opt.width);
//                                        this.slide.eq(this.getCurrentIndex())
//                                                  .animate({'left': transition_indent})
//                                                  .delay(100)
//                                                  .fadeOut(100)
//                                                  .removeClass('current');
//                                        this.slide.eq(index)
//                                                  .animate({'left': 0})
//                                                  .addClass('current');
//                                                  
//                                    }else{
//                                        this.slide.eq(index)
//                                                  .show()
//                                                  .css('left', opt.width);
//                                        this.slide.eq(this.getCurrentIndex())
//                                                  .animate({'left': -transition_indent})
//                                                  .delay(100)
//                                                  .fadeOut(100)
//                                                  .removeClass('current');
//                                        this.slide.eq(index)
//                                                  .animate({'left': 0})
//                                                  .addClass('current');
//                                    }
//                                }else if(opt.transition_direction == 'vertical'){
//                                    if(opt.transition_var == 'simple'){
//                                        transition_indent = opt.height;
//                                    }
//                                    if(this.getCurrentIndex() > index){
//                                        this.slide.eq(index)
//                                                  .show()
//                                                  .css('top', opt.height);
//                                        this.slide.eq(this.getCurrentIndex())
//                                                  .animate({'top': -transition_indent})
//                                                  .delay(100)
//                                                  .fadeOut(100)
//                                                  .removeClass('current');
//                                        this.slide.eq(index)
//                                                  .animate({'top': 0})
//                                                  .addClass('current');
//                                    }else{
//                                        this.slide.eq(index)
//                                                  .show()
//                                                  .css('top',-opt.height);
//                                        this.slide.eq(this.getCurrentIndex())
//                                                  .animate({'top': transition_indent})
//                                                  .delay(100)
//                                                  .fadeOut(100)
//                                                  .removeClass('current');
//                                        this.slide.eq(index)
//                                                  .animate({'top': 0})
//                                                  .addClass('current');
//                                    }
//                                }
//                            }

                            this.changeNavigation = function(kindNavigation,index){ // ����� �������� ������� ���������
                                    kindNavigation.removeClass('current')
                                              .eq(index)
                                              .addClass('current');
                            }
                            
                            this.changeSlides = function(index){ // ����� �������
                                if(index != this.getCurrentIndex()){
                                    switch (opt.animation){
                                        case 'fade': this.fade(index);
                                            break;
                                        case 'transition': this.transition(index);
                                            break;
                                    }
                                    this.changeNavigation(this.thumb,index);
                                    this.changeNavigation(this.paginate,index);
                                }
                            }

                            this.changeNextPrev = function(d){ // ����� ������� ����� next, prev
                                var currentIndex = this.getCurrentIndex();
                                if(currentIndex == (this.slide.length - 1) && d > 0){
                                    this.changeSlides(0);
                                }
                                else if(currentIndex == 0 && d < 0){
                                    this.changeSlides((this.slide.length - 1));
                                }
                                else if( currentIndex <= (this.slide.length - 1)){
                                    this.changeSlides(parseInt(currentIndex + 1*d));
                                }
                            }

                            this.auto = function(){ // ������������ ������� �������������

                            }

                            this.init = function(index){ // ��������� ��������� ��� ������� obj
                                
                                // ���������
                                if (opt.thumbs === true) { 
                                    if(opt.position == 'left' || opt.position == 'right'){ // ���� ��������� ������ ��� �����
                                        option = opt.height;
                                        css_sel = 'height';
                                        margin = 'margin-top';
                                        border = 'border-top-width';
                                    }else{ // ���� ��������� ����� ��� ������
                                        option = opt.width;
                                        css_sel = 'width';
                                        margin = 'margin-left';
                                        border = 'border-left-width';
                                        this.thumb.css('float', 'left');
                                    }
                                    var thumbMargin = parseInt(this.thumb.css(margin));
                                    var thumbBorder = parseInt(this.thumb.css(border));
                                    var thumbMaxWidth = option/opt.row;
                                    thumbWidth = (thumbMaxWidth - (thumbMargin * 2)) - (thumbBorder * 2)
                                    this.thumb.css( css_sel, thumbWidth );
                                    this.thumb.find('img').css( css_sel, thumbWidth );
                                }
                                
                                if(opt.position == 'left' || opt.position == 'right'){
                                    nav.find('.thumbs').height(opt.height)
                                                       .width(thumbWidth);
                                    alert(thumbWidth);
                                    container_width = opt.width + nav.outerWidth();
                                    container_height = opt.height;
                                }else{
                                    nav.find('.thumbs').width(opt.width);
                                    container_width = opt.width;
                                    container_height = opt.height + nav.outerHeight();
                                }       
                                
                                container.width(container_width)
                                         .height(container_height);
                                slider_wrapper.width(opt.width)
                                              .height(opt.height);


                                this.slide.hide()
                                          .eq(index)
                                          .addClass('current')
                                          .fadeIn();
                                this.thumb.eq(index)
                                          .addClass('current');
                                this.paginate.eq(index)
                                             .addClass('current');


                            }
                        
                        } // ����� ������� ������� obj
                        
                        var slide_obj = new obj();
                        
                        slide_obj.init(opt.start_slide-1);
                        
                        //������� ������� �� next,prev
                        slide_obj.next.click(function(){
                            slide_obj.changeNextPrev(1);
                        });
                        slide_obj.prev.click(function(){
                            slide_obj.changeNextPrev(-1);
                        });
                        
                        //������� ������� �� ������ ���������
                        
                        slide_obj.thumb.click(function() {
                            slide_obj.changeSlides($(this).index());
                        });
                        slide_obj.paginate.click(function() {
                            slide_obj.changeSlides($(this).index());
                        }); 
                        
                        if (opt.auto == true){
                            
                            var changeSlideAuto = function(){
                                slide_obj.changeNextPrev(1)
                            };
                            
                            var interval = setInterval(changeSlideAuto, opt.autoSpeed);
                            
                            slider_wrapper.hover(function(){clearInterval(interval);}, function(){interval=setInterval(changeSlideAuto, opt.autoSpeed);});
                            //slide_obj.thumb.hover(function(){clearInterval(interval);}, function(){interval=setInterval(changeSlideAuto, opt.autoSpeed);});
                            //slide_obj.paginate.hover(function(){clearInterval(interval);}, function(){interval=setInterval(changeSlideAuto, opt.autoSpeed);});

                            // ���������� ������, ����� ������ ��������� ��� ������
                            slide_obj.thumb.click(function(){clearInterval(interval); interval=setInterval(changeSlideAuto, opt.autoSpeed);});
                            slide_obj.paginate.click(function(){clearInterval(interval); interval=setInterval(changeSlideAuto, opt.autoSpeed);});
                            slide_obj.next.click(function(){clearInterval(interval); interval=setInterval(changeSlideAuto, opt.autoSpeed);});
                            slide_obj.prev.click(function(){clearInterval(interval); interval=setInterval(changeSlideAuto, opt.autoSpeed);});
                        }
                               
                });
                
                        
        }
})(jQuery);