//------------------------------------------------------------------------------
// вешаем на ссылки и кнопки для отправки данных формы ajax-обработчики
$(document).ready(function(){
    // присваиваем событие всем ссылкам, кроме:
    // 1. Если ссылка имеет внешний url - согласимся, задавать атрибут 'name' 
    // таким ссылкам - 'not_ajax'.
    // 2. Если ссылка имеет # в атрибуте 'href', следовательно это ссылка
    // на якорь внутри текста.
    $('a').live('click',function(e){
        if($(this).attr('name') != 'not_ajax'){
            if($(this).attr('href').toString().indexOf('#') == -1){
                change_page(this);
                return false;
            }
        }
    });
    // присваиваем событие всем элементам (input[type="submit"], button), кроме:
    // 1. Если форма должна перезагружать страницу синхронно - согласимся,  
    // задавать атрибут 'class' таким кнопкам 
    // (input[type="submit"], button) - 'not_ajax'.
    $('.button').live('click',function(e){
        if($(this).attr('class') != 'not_ajax'){
            send_data(this);
            return false;
        }
    });
});