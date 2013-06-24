(function($){
	$.fn.bookmark = function(options) {  

		var opt = {
			// Опции
                        'bookmark_class': 'bookmark', // класс для закладок
                        'bookmark_esset_class': 'bookmark_esset', // класс для содержимого закладок
                        'fadeSpeed': 400,
                        'start_from': 1 // с какой закладки стартуем

		};
		return this.each(function() {
			if (options) {
				$.extend(opt, options);
			}
                        
                        $('.' + opt.bookmark_class).eq(opt.start_from-1)
                                                   .addClass('active');
                        $('.' + opt.bookmark_esset_class).hide()
                                                         .eq(opt.start_from-1)
                                                         .show();
                        
                        $('.' + opt.bookmark_class).click(function(){
                            if(!$(this).hasClass('active')){
                                $('.' + opt.bookmark_esset_class).hide()
                                                                 .eq($(this).index())
                                                                 .fadeIn(opt.fadeSpeed);
                            }
                            $('.' + opt.bookmark_class).removeClass('active');
                            $(this).addClass('active');
                        });
                        
                });
        };
})(jQuery);


