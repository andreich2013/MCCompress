$(document).ready(function(){
    $('.bible_quote').children().first().fadeIn().addClass('active');
//    rotator_header = setInterval(function(){rotator($('.bible_quote'))},5000);
    
    $('#backtotop').scrollToTop();
    
    $('.filter select').live('change', function() {
      filter_load(this);
      return false;
    });
    
    $('.jplayer_wr').draggable({
        handle: '.jplayer_drag_handle',
        containment: 'parent',
        drag: function( event, ui ) {
            
//            h = $('#wrapper').height() - ui.offset.top;
//            
//            if(h < 250){
//                $(".jplayer_container, .jp_playlist").css('background','#6ccaff');
//            }else if(h < 400){
//                $(".jp_playlist").css('background','#6ccaff');
//                $(".jplayer_container").css('background','#00a4ff');
//            }else if(ui.offset.top < 100){
//                $(".jplayer_container, .jp_playlist").css('background','#6ccaff');
//            }else if(ui.offset.top < 300){
//                $(".jplayer_container").css('background','#6ccaff');
//                $(".jp_playlist").css('background','#00a4ff');
//            }else{
//                $(".jplayer_container, .jp_playlist").css('background','#00a4ff');
//            }

        }
    });
    
    $('.jp_playlist').jScrollPane({
        autoReinitialise: true,
        contentWidth: 0
    });
    
    if(!isOldIe()){
        $(".jplayer_wr").audioPlayer();

        $( ".jplayer_wr" ).droppable({
                accept: '.sortable, .sortable_playlist',
                drop: function( event, ui ) {
                    if($(ui.draggable).hasClass('sortable')){
                        audioPlayer.playlist.addAudioTrack(ui.draggable);
                    }
                },
                over: function( event, ui ) {
                    variables.sortableOverDroppable = true;
                },
                out: function( event, ui ) {
                    variables.sortableOverDroppable = false;
                }
        });
    }
    
//  хаки для ie7 по верстке
    if(($.browser.msie) && ($.browser.version == '7.0')){
        $('.cloud1,\n\
           .cloud2,\n\
           .sun').css('zoom','1');
    }
    
});
