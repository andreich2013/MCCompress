(function($){
    $.fn.accordion = function(options) {  
        var opt = {
            //�����
            'push_teg': 'a', //���, ��� ������� �� ������� ��������� ��������������
            'dropdown_teg': 'ul', // ���������������� ���
            'closest_parent': 'li', 
            'mouseenter': true,
            'animation': 'advanced'
            //�������� ��� ������� ��������:
            //'handle' - ��������� �������������� � ������������ �������
            //'advanced' - ��������� �������������� � ������������ �������������
            //'standart' - ��������� �������������� � ������������ �������������,
            //�������� ������ �������� ���� �������
	};

        return this.each(function() {
            if (options) {
                    $.extend(opt, options);
            }

            $(this).addClass('accordion')
                   .addClass('dropdown_teg')
                   .find(opt.push_teg)
                   .css('cursor','pointer');
            $('.accordion').find(opt.dropdown_teg).addClass('dropdown_teg');
            $('.accordion .dropdown_teg').css('display', 'none');
            $('.accordion').children().addClass('bg_arrow_down');

            //�������������� ����������� ���������� ��� �������� �� ������

            $(this).find('.active')
                   .addClass('on')
                   .parents('.dropdown_teg')
                   .css('display', 'block');
            $(this).find('.active')
                   .parents(opt.closest_parent)
                   .addClass('on');
            $(this).find('.active')
                   .children('.dropdown_teg')
                   .css('display', 'block');

            $('.dropdown_teg > ' + opt.closest_parent + ' > ' + opt.push_teg).click(function(){

                var main_parent = $(this).parent(opt.closest_parent).parent('.dropdown_teg');
                $('.accordion').find(opt.closest_parent).removeClass('active');
                $(this).parent(opt.closest_parent).addClass('active');
                main_parent.children(opt.closest_parent).children('.dropdown_teg').find(opt.closest_parent).removeClass('active');

                if(opt.animation == 'advanced' || opt.animation == 'handle'){
                    $(this).parent(opt.closest_parent).children('.dropdown_teg').slideToggle('normal');
                }
                else if(opt.animation == 'standart'){
                    $(this).parent(opt.closest_parent).children('.dropdown_teg').slideDown('normal');
                }

                if(opt.animation == 'handle'){
                    main_parent.children(opt.closest_parent).removeClass('on');
                    $(this).parent(opt.closest_parent).toggleClass('on');
                    main_parent.children(opt.closest_parent).children('.dropdown_teg').find(opt.closest_parent).removeClass('on');
                }

                if(opt.animation == 'advanced' || opt.animation == 'standart'){
                    main_parent.children(opt.closest_parent).removeClass('on');
                    main_parent.children(opt.closest_parent).children('.dropdown_teg').find(opt.closest_parent).removeClass('on');
                    $(this).parent(opt.closest_parent).addClass('on');
                    main_parent.children(opt.closest_parent).not('.active').find('.dropdown_teg').slideUp('normal');    
                }

            });

            if(opt.mouseenter == true){
                $('.dropdown_teg > ' + opt.closest_parent + ' > ' + opt.push_teg).hover(function(e) {
                    $(this).hoverFlow(e.type, { marginLeft: 10 }, 250);
                }, function(e) {
                    $(this).hoverFlow(e.type, { marginLeft: 0 }, 250);
                });
            }                        
        });
    };
})(jQuery);

//(function(a){a.jPlayerCount=0;a.each({jPlayer:function(b){a.jPlayerCount++;var c={ready:null,cssPrefix:"jqjp",swfPath:"js",quality:"high",width:0,height:0,top:0,left:0,position:"absolute",bgcolor:"#ffffff"};a.extend(c,b);b={id:a(this).attr("id"),swf:c.swfPath+(""!=c.swfPath?"/":"")+"Jplayer.swf",fid:c.cssPrefix+"_flash_"+a.jPlayerCount,hid:c.cssPrefix+"_force_"+a.jPlayerCount};a.extend(c,b);a(this).data("jPlayer.config",c);b={change:function(b,c){var d=a(this).data("jPlayer.config").fid;a(this).data("jPlayer.getMovie")(d).fl_change_mp3(c);a(this).trigger("jPlayer.screenUpdate",!1)},jp_play:function(){var b=a(this).data("jPlayer.config").fid;a(this).data("jPlayer.getMovie")(b).fl_play_mp3()&&a(this).trigger("jPlayer.screenUpdate",!0)},jp_pause:function(){var b=a(this).data("jPlayer.config").fid;a(this).data("jPlayer.getMovie")(b).fl_pause_mp3()&&a(this).trigger("jPlayer.screenUpdate",!1)},jp_stop:function(){var b=a(this).data("jPlayer.config").fid;a(this).data("jPlayer.getMovie")(b).fl_stop_mp3()&&a(this).trigger("jPlayer.screenUpdate",!1)},playHead:function(b,c){var d=a(this).data("jPlayer.config").fid;a(this).data("jPlayer.getMovie")(d).fl_play_head_mp3(c)&&a(this).trigger("jPlayer.screenUpdate",!0)},volume:function(b,c){var d=a(this).data("jPlayer.config").fid;a(this).data("jPlayer.getMovie")(d).fl_volume_mp3(c)},screenUpdate:function(b,c){var d=a(this).data("jPlayer.cssId.jp_play"),e=a(this).data("jPlayer.cssId.jp_pause");a(this).data("jPlayer.config");if(null!=d&&null!=e)if(c){var j=a(this).data("jPlayer.cssDisplay.jp_pause");a("#"+d).css("display","none");a("#"+e).css("display",j)}else j=a(this).data("jPlayer.cssDisplay.jp_play"),a("#"+d).css("display",j),a("#"+e).css("display","none")}};for(var d in b){var e="jPlayer."+d;a(this).unbind(e);a(this).bind(e,b[d])}a(this).data("jPlayer.getMovie",function(b){return a.browser.msie?window[b]:document[b]});if(a.browser.msie){b='<object id="'+c.fid+'"';b+=' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"';b+=' type="application/x-shockwave-flash"';b+=' width="'+c.width+'" height="'+c.height+'">';b+="</object>";d=[];d[0]='<param name="movie" value="'+c.swf+'" />';d[1]='<param name="quality" value="high" />';d[2]='<param name="FlashVars" value="id='+escape(c.id)+"&fid="+escape(c.fid)+'" />';d[3]='<param name="allowScriptAccess" value="always" />';d[4]='<param name="bgcolor" value="'+c.bgcolor+'" />';b=document.createElement(b);for(e=0;e<d.length;e++)b.appendChild(document.createElement(d[e]));a(this).html(b)}else d='<embed name="'+c.fid+'" src="'+c.swf+'"',d+=' width="'+c.width+'" height="'+c.height+'" bgcolor="'+c.bgcolor+'"',d+=' quality="high" FlashVars="id='+escape(c.id)+"&fid="+escape(c.fid)+'"',d+=' allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />',a(this).html(d);d='<div id="'+c.hid+'"></div>';a(this).append(d);a(this).css({position:c.position,top:c.top,left:c.left});a("#"+c.hid).css({"text-indent":"-9999px"});return a(this)},change:function(b){a(this).trigger("jPlayer.change",b)},jp_play:function(){a(this).trigger("jPlayer.jp_play")},changeAndPlay:function(b){a(this).trigger("jPlayer.change",b);a(this).trigger("jPlayer.jp_play")},jp_pause:function(){a(this).trigger("jPlayer.jp_pause")},jp_stop:function(){a(this).trigger("jPlayer.jp_stop")},playHead:function(b){a(this).trigger("jPlayer.playHead",b)},volume:function(b){a(this).trigger("jPlayer.volume",b)},jPlayerId:function(b,c){if(null!=c)if(null!=eval("$(this)."+b)){a(this).data("jPlayer.cssId."+b,c);var d=a(this).data("jPlayer.config").id;eval('var myHandler = function(e) { $("#'+d+'").'+b+"(e); return false; }");a("#"+c).click(myHandler).hover(this.rollOver,this.rollOut).data("jPlayerId",d);d=a("#"+c).css("display");a(this).data("jPlayer.cssDisplay."+b,d);"jp_pause"==b&&a("#"+c).css("display","none")}else alert("Unknown function assigned in: jPlayerId( fn="+b+", id="+c+" )");else{c=a(this).data("jPlayer.cssId."+b);if(null!=c)return c;alert("Unknown function id requested: jPlayerId( fn="+b+" )");return!1}},loadBar:function(b){var c=a(this).data("jPlayer.cssId.loadBar");if(null!=c){var d=a("#"+c).offset();b=b.pageX-d.left;c=a("#"+c).width();a(this).playHead(100*b/c)}},playBar:function(a){this.loadBar(a)},onProgressChange:function(b){a(this).data("jPlayer.jsFn.onProgressChange",b)},updateProgress:function(b,c,d,e,k){var f=a(this).data("jPlayer.cssId.loadBar");null!=f&&a("#"+f).width(b+"%");var g=a(this).data("jPlayer.cssId.playBar");null!=g&&a("#"+g).width(c+"%");var h=a(this).data("jPlayer.jsFn.onProgressChange");null!=h&&h(b,c,d,e,k);return null!=f||null!=g||null!=h?(this.forceScreenUpdate(),!0):!1},volumeMin:function(){a(this).volume(0)},volumeMax:function(){a(this).volume(100)},volumeBar:function(b){var c=a(this).data("jPlayer.cssId.volumeBar");if(null!=c){var d=a("#"+c).offset();b=b.pageX-d.left;c=a("#"+c).width();a(this).volume(100*b/c)}},volumeBarValue:function(a){this.volumeBar(a)},updateVolume:function(b){var c=a(this).data("jPlayer.cssId.volumeBarValue");if(null!=c)return a("#"+c).width(b+"%"),this.forceScreenUpdate(),!0},onSoundComplete:function(b){a(this).data("jPlayer.jsFn.onSoundComplete",b)},finishedPlaying:function(){var b=a(this).data("jPlayer.jsFn.onSoundComplete");a(this).trigger("jPlayer.screenUpdate",!1);return null!=b?(b(),!0):!1},setBufferState:function(b){var c=a(this).data("jPlayer.cssId.loadBar");if(null!=c){var d=a(this).data("jPlayer.config").cssPrefix;b?a("#"+c).addClass(d+"_buffer"):a("#"+c).removeClass(d+"_buffer");return!0}return!1},bufferMsg:function(){},setBufferMsg:function(b){var c=a(this).data("jPlayer.cssId.bufferMsg");return null!=c?(a("#"+c).html(b),!0):!1},forceScreenUpdate:function(){var b=a(this).data("jPlayer.config").hid;a("#"+b).html(Math.random())},rollOver:function(){var b=a(this).data("jPlayerId"),b=a("#"+b).data("jPlayer.config").cssPrefix;a(this).addClass(b+"_hover")},rollOut:function(){var b=a(this).data("jPlayerId"),b=a("#"+b).data("jPlayer.config").cssPrefix;a(this).removeClass(b+"_hover")},flashReady:function(){var b=a(this).data("jPlayer.config").ready;null!=b&&b()}},function(b){a.fn[b]=this})})(jQuery);