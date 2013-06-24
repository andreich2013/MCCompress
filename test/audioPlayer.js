(function($){
    $.fn.audioPlayer = function(options) {  

        /*
         * опции
         */
        var opt = {
            player: {
                self: ".jplayer_wr",
                title: "#song_title",
                duration: "#play_time",
                currentTime: "#total_time",
                play: "#jp_play",
                pause: "#jp_pause",
                stop: "#jp_stop",
                prev: "#jp_prev",
                next: "#jp_next",
                playlistToggle: "#jp_playlist",
                volumeMin: "#jp_volume_min",
                volumeMax: "#jp_volume_max",
                volumeBar: "#jp_volume_bar",
                progressBar: "#jp_progress",
                close: "#jp_close"
            },
            
            playlist: {
                self: "#jplayer_playlist",
                audioTrack: ".sortable_playlist"
            },
            
            soundsContainer: {
                self: ".audio",
                audioTrack: ".audio a"
            }
        };
        
        return this.each(function() {
            
            if (options) {
                $.extend(opt, options);
            }

            audioPlayer = new audioPlayer_obj(opt);
        
        });
        
    };
        
    audioPlayer_obj = function(options){
    
        /*
         * переопределим this, чтобы не было путаницы с областью видимости
         * @type audioPlayer
         */
        var self = this;

        self.player = {
            self: "",
            title: "",
            duration: "",
            currentTime: "",
            play: "",
            pause: "",
            volumeBar: "",
            progressBar: ""
        }
        
        self.playlist = {
            self: "",
            audioTrack: "",
            addAudioTrack: function(audioTrack){
                
                var html = "";
                
                if($(self.soundsContainer.audioTrack).hasClass('ui-selected')){
                    $(self.soundsContainer.audioTrack+':link.ui-selected').each(function(){
                        html += '<a id="playlist_'+$(this).attr('id')+'"\n\
                                        name="not_ajax"\n\
                                        class="sortable_playlist ui-state-default ui-widget-content"\n\
                                        href="'+$(this).attr('href')+'"\n\
                                        rel="'+$(this).attr('rel')+'">\n\
                                             '+$(this).html()+'\n\
                                     </a>';
                        
                    });
                }else{
                    html = '<a id="playlist_'+$(audioTrack).attr('id')+'"\n\
                                name="not_ajax"\n\
                                class="sortable_playlist ui-state-default ui-widget-content"\n\
                                href="'+$(audioTrack).attr('href')+'"\n\
                                rel="'+$(audioTrack).attr('rel')+'">\n\
                                        '+$(audioTrack).html()+'\n\
                            </a>';
                }
                
                $(".jspPane").sortable({
                    handle: ".title",
                    stop: function( event, ui ) {
                        
                        if(!variables.sortableOverDroppable){
                            self.playlist.removeAudioTrack(ui.item);
                        }
                        
                    }
                });
                $(".jspPane").disableSelection();
                $(".jspPane").selectable();
                
                $(this.self).find('.jspPane').append(html);
            
            },
            removeAudioTrack: function(audioTrack){
                
                if($(self.playlist.audioTrack).hasClass('ui-selected')){
                    $(self.playlist.audioTrack+':link.ui-selected').detach();
                }else{
                    $(self.playlist.self).find(audioTrack).detach();
                }
                
            
            }
        }
        
        self.soundsContainer = {
            self: "",
            audioTrack: ""
        }
        
        /*
         * переопределим self.audio.duration, 
         * дабы оно было доступно в любом месте приложения
         */
        self.duration = "";
        
        /*
         * глобальные флаги (в пределах объекта)
         */
        self.isSongLoaded = false;
        self.detach = false;
        
        /*
         * инициализация объекта
         */
        self.init = function(options){
            
            if (options) {
                $.extend(self.player, options.player);
                $.extend(self.playlist, options.playlist);
                $.extend(self.soundsContainer, options.soundsContainer);
            }
            
            self._create();
            self._volumeLevel(0.75);
            
        }
        
        /*
         * создание объекта audio
         * @returns {@exp;self@pro;audio}
         */
        self._create = function(){
            
            self.audio = new Audio();
            
            self.audio.canPlayOgg = !!self.audio.canPlayType && self.audio.canPlayType('audio/ogg; codecs="vorbis"') != "";
            self.audio.canPlayMp3 = !!self.audio.canPlayType && self.audio.canPlayType('audio/mpeg; codecs="mp3"') != "";
            
            /*
            * в данном случае - это уже объекты jQuery
            * об этом не стоит забывать
            */
           self.player.progressBarWidth = $(self.player.progressBar).width();
           self.player.progressBarLoad = $(self.player.progressBar).children();
           self.player.progressBarPlay = $(self.player.progressBar).children().children();
           self.player.volumeBarWidth = $(self.player.volumeBar).width();
           self.player.volumeLoad = $(self.player.volumeBar).children();
            
            // обработчики событий
                        
            self.audio.addEventListener('loadedmetadata', function() {
                
                var timeToMMSS = self._timeToMMSS(self.audio.duration);
                
                self.duration = self.audio.duration;
                
                $(self.player.duration).html(timeToMMSS);
                $(self.player.currentTime).html('');
                
                self._play();
                
                self.isSongLoaded = true;
                
            });
            
            self.audio.addEventListener("timeupdate", function() {
                
                var timeToMMSS = self._timeToMMSS(self.audio.currentTime);
                $(self.player.currentTime).html(timeToMMSS);

                var width = parseInt(self.player.progressBarWidth)*(self.audio.currentTime/self.duration);
                self.player.progressBarPlay.width(width);
                
                if(self.isSongLoaded){
                    var diff = self.audio.seekable.end(0)/self.duration;
                    var width = self.player.progressBarWidth*diff;

                    self.player.progressBarLoad.width(width);
                }
                
            });
            
            self.audio.addEventListener('ended', function() {
                
                self._stop();                
                self._next();
                
            });
            
            $(self.playlist.audioTrack+', '+self.soundsContainer.audioTrack).live( 'click', function(e){
            
                e.preventDefault();

                var sound = {

                    title: $(this).text(),
                    mp3: $(this).attr('href'),
                    ogg: $(this).attr('rel')

                }

                if($(this).parents(self.playlist.self)[0]){
                    $(self.playlist.audioTrack).removeClass('active');
                    $(this).addClass('active');
                }

                self._change(sound);

                if($(self.player.self).is(':hidden')){
                    $(self.player.self).fadeIn();
                    
                    self.playlist.addAudioTrack(this);
                    $(self.playlist.audioTrack).filter('#playlist_'+$(this).attr('id')).addClass('active');
                }

            });
            
            $(self.player.play).bind('click', function(event){
                
                self._play();
                
            });
            
            $(self.player.pause).bind('click', function(event){
                
                self._pause();
                
            });
            
            $(self.player.stop).bind('click', function(event){
                
                self._stop();
                
            });
            
            $(self.player.prev).bind('click', function(event){
                
                self._prev();
                
            });
            
            $(self.player.next).bind('click', function(event){
                
                self._next();
                
            });
            
            $(self.player.playlistToggle).bind('click', function(event){
                
                self._togglePlaylist();
                
            });
            
            $(self.player.close).bind('click', function(event){
                
                self._closePlayer();
                
            });
            
            $(self.player.volumeMin).bind('click', function(event){
                
                self._volumeLevel(0.001);
                
            });
            
            $(self.player.volumeMax).bind('click', function(event){
                
                self._volumeLevel(1);
                
            });
            
            $(self.player.volumeBar).bind('click', function(event){
                
                var offset = $(self.player.volumeBar).offset();
                var width = event.pageX - offset.left;
                var level = width/parseInt(self.player.volumeBarWidth);

                self._volumeLevel(level);
                
            });
            
            $(self.player.progressBar).bind('click', function(event){
                
                self._progressBar(event);
                
            });

            return self.audio;
            
        }
        
        /*
         * преобразование времени в формат mm:ss
         * @returns {@exp;timeMMSS@pro;string}
         */
        self._timeToMMSS = function(time){
            
            var mm = parseInt((time / 60) % 60);
            var ss = parseInt(time % 60);

            if(mm.toString().length == 1){
                mm = '0' + mm;
            }
            if(ss.toString().length == 1){
                ss = '0' + ss;
            }
            
            var timeMMSS = mm+':'+ss;
            
            return timeMMSS;
            
        }
        
        /*
         * смена аудиофайла
         */
        self._change = function(sound){
            
            self.isSongLoaded = false;
            
            if(!self.audio.paused){
                self.audio.pause();
            }
            
            if(self.audio.canPlayMp3){
                $(self.audio).prop('src', sound.mp3);
            }else{
                $(self.audio).prop('src', sound.ogg);
            }
            
            $(self.player.title).html(sound.title);

        }
        
        /*
         * метод - проигрывание аудиофайла
         */
        self._play = function(currentTime){
            
            if(currentTime){
                self.audio.currentTime = currentTime;
            }
            
            self.audio.play();
            
            $(self.player.play).hide();
            $(self.player.pause).show();
            
        }
        
        /*
         * метод - установка паузы при проигрывании аудиофайла
         */
        self._pause = function(){
            
            self.audio.pause();

            $(self.player.pause).hide();
            $(self.player.play).show();
            
        }
        
        /*
         * метод - стоп при проигрывании аудиофайла
         */
        self._stop = function(){
                
            self._pause();
            self.audio.currentTime = 0;

        }
        
        /*
         * смена на предыдущий аудиофайл
         */
        self._prev = function(){
            
            if($(self.playlist.audioTrack).filter('.active').index() == 0){
                var _this = $(self.playlist.audioTrack).removeClass('active').last();
            }else{
                var _this = $(self.playlist.audioTrack).filter('.active').prev();
                $(self.playlist.audioTrack).removeClass('active');
            }
            
            if(_this[0] != undefined){
                _this.addClass('active');

                var sound = {

                    title: _this.text(),
                    mp3: _this.attr('href'),
                    ogg: _this.attr('rel')

                }

                self._change(sound);
            }
            
        }
        
        /*
         * смена на следующий аудиофайл
         */
        self._next = function(){
            
            if($(self.playlist.audioTrack).filter('.active').index() == ($(self.playlist.audioTrack).length - 1)){
                var _this = $(self.playlist.audioTrack).removeClass('active').first();
            }else{
                var _this = $(self.playlist.audioTrack).filter('.active').next();
                $(self.playlist.audioTrack).removeClass('active');
            }
            
            if(_this[0] != undefined){
                _this.addClass('active');

                var sound = {

                    title: _this.text(),
                    mp3: _this.attr('href'),
                    ogg: _this.attr('rel')

                }

                self._change(sound);
            }
            
        }
        
        /*
         * изменение громкости
         */
        self._volumeLevel = function(level){
            
            var width = self.player.volumeBarWidth*level;
            
            self.player.volumeLoad.width(width);
            self.audio.volume = level;
            
        }
        
        /*
         * прогресс загрузки аудиофайла
         */
        self._progressBar = function(event){
            
            var offset = $(self.player.progressBar).offset();
            var left = event.pageX - offset.left;
            var currentTime = left/self.player.progressBarWidth*self.duration;
            
            self.player.progressBarPlay.width(left);
            
            self._play(currentTime);

        }
        
        /*
         * показ/скрывание плейлиста
         */
        self._togglePlaylist = function(){
            
            if($(self.playlist.self).is(':hidden')){
                $(self.playlist.self).slideDown();
            }else{
                $(self.playlist.self).slideUp();
            }
            
        }
        
        /*
         * показ/скрывание плеeра
         */
        self._closePlayer = function(){
            
            self._stop();
            
            $(self.player.self).fadeOut();
            
            $(self.playlist.audioTrack).removeClass('active');
            
        }
        
        self.init(options);

    } 
    
})(jQuery);
    