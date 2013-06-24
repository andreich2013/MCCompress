//##############################################################################
//Аяксовый движок сайта
//------------------------------------------------------------------------------
// переход по истории браузера, с помощью кнопок назад-вперед
window.onload=function(){ 
    window.setTimeout(function(){ 
        window.onpopstate = function(e) {
            var returnLocation = history.location || document.location; 
                ajax_load(variables.path_root+'/lib/core_ajax.php','POST',e.state.params);
            },false
        },1
    ); 
}
//------------------------------------------------------------------------------
// подгрузка страниц аяксом
function change_page(elem){
    href = $(elem).attr('href').substr(variables.path_root.length);
    
    var params = {};
    
    if(global_params){
        params = global_params;
        global_params = false;
    }
    params["variables"] = variables;
    params["href"] = href;
    params["change_page"] = 1;

    state = {
        "params": params
    }
    
    if(pR){
        clearInterval(pR);
    }
    
    reset_load_map = false;
    
    ajax_load(variables.path_root+'/lib/core_ajax.php','POST',state.params);
    addHistoryNote(state);
        
}
//------------------------------------------------------------------------------
// подгрузка контента на страницах аяксом
function change_content(params){
    
    params["variables"] = variables;
    
    if(pR){
        clearInterval(pR);
    }
    
    ajax_load(variables.path_root+'/lib/core_ajax.php','POST',params);
        
}
//------------------------------------------------------------------------------
// отправка данных формы аяксом
function get_params(elem){
    
    var params = {
        "variables": variables
    }
    
    var form = $(elem).parents('form:first');
    var fieldset = $(elem).parents('fieldset:first');
    var action = form.attr('action');

    if(action){
        params["href"] = action;
    }else{
        params["href"] = location.href.substr(variables.path_root.length);
    }
    
    var params1 = {};
    
    fieldset.find('.form_elements').each(function(){
        var required = 0;
        if($(this).attr('required')){
            required = "1";
        }
        params1[$(this).attr('name')] = {
            "data": $(this).val(),
            "required": required,
            "title": fieldset.find('label[for='+$(this).attr('name')+']').text()
        }
    });
    
    params["data"] = params1;
    
    return params;
}
//------------------------------------------------------------------------------
// отправка данных формы аяксом
function send_data(elem){
    
    var params = get_params(elem);

    ajax_load(variables.path_root+'/lib/core_ajax.php','POST',params);
}
//------------------------------------------------------------------------------
// постоянный запрос на сервер с переодичностью в "n" секунд 
function permanentRequest(elem,url,type,params,time){
    
        pR = setInterval(function(){
            ajax_load(url,type,params);            
        },time);
//        $(elem).click(function(){
//            clearInterval(permanentRequest);
//            pR = setInterval(function(){
//                ajax_load(url,type,pR_params);
//            },time);
//        });
}
//------------------------------------------------------------------------------
// сердце движка - функция, которая посылает-принимает данные с сервера
function ajax_load(url,type,params){
//    console.log(params);
    $.ajax({
        url: url, 
        type: type,
        dataType: 'json',
        data: params,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
//                console.log(errorThrown);
//                console.log(textStatus);
//                console.log(XMLHttpRequest);
              },
        success: function (data, textStatus) { 
//                console.log(data);
                for (var key in data) {
                    ajax_action(key,data);
                }
        }               
    });
}
//------------------------------------------------------------------------------
// отвечает за действие, которое будет произведено с данными,
// полученными после запроса
function ajax_action(key,data){
    switch(data[key]['action']){
        // добавление элементов на страницу
        case "append": $(key).append(data[key]['data']); break;
        case "prepend": $(key).prepend(data[key]['data']); break;
        case "after": $(key).after(data[key]['data']); break;
        // удаление элементов со страницы
        case "remove": $(key).remove(); break;
        case "detach": $(key).detach(); break;
        case "empty": $(key).empty(); break;
        // анимация элементов на странице
        case "hide": $(key).hide(); break;
        case "show": $(key).show(); break;
        case "fadeIn": $(key).fadeIn(); break;
        case "fadeIn": $(key).fadeOut(); break;
        // по умолчанию замена содержимого селектора
        default: $(key).html(data[key]['data']); break;
    }
}
//------------------------------------------------------------------------------
// осуществляет запись подгруженной страницы в историю браузера
function addHistoryNote(state){
    history.pushState(state, 'null', state.params.href);
}
//------------------------------------------------------------------------------
// осуществляет запись подгруженной страницы в историю браузера
function editHistoryNote(state){
    history.replaceState(state, 'null', state.params.href);
}
$(document).ready(function(){
    // флаг для подгрузки карты аяксом в карточке продукта
    reset_load_map = false;
    // глобальные флаги
    // флаг для постоянного фонового запроса аяксом
    pR = false;
    // переменная для подгрузки параметров в функцию change_page()
    global_params = {};
})
//------------------------------------------------------------------------------
//##############################################################################

// центрирует элемент(@elem) относительно родителя(@wr)
function centured(elem,wr){ 
    mT = (wr.outerHeight() - elem.outerHeight())/2;
    mL = (wr.outerWidth() - elem.outerWidth())/2;
    
    m = {
        marginTop : mT,
        marginLeft: mL
    }
    return m;
}

// подгрузка карты аяксом
function load_map(params){
    if(!reset_load_map){
        change_content(params);
        reset_load_map = true;
    }
}

// обновление капчи
function refresh_captcha(elem){
    var params = {
        "refresh_captcha": 1
    }
    
    ajax_load(variables.path_root+'/lib/captcha.php','POST',params);
    
}

// подгрузка элементов через фильтр
function filter_load(elem){
    
    var params = get_params(elem);
    
    if($(elem).attr('name') == 'section') {
        delete params["data"]["category"];
        delete params["data"]["subcategory"];
    }
    
    if($(elem).attr('name') == 'category') {
        delete params["data"]["subcategory"];
    }
    
    params["change_page"] = 1;
    var url = window.location.toString();
    url = url.substr(variables.path_root.length);
    
    if(url.indexOf('/#/') != -1){
        url = url.replace('/#/','/');
    }
    
    if(url.indexOf('/page-') != -1){
        var replace_str = url.substr(url.indexOf('/page-'),7);
        url = url.replace(replace_str,'');
    }
    
    if(url.indexOf('?') != -1){
        url = url.substr(0,url.indexOf('?'));
    }
    
    if(params["data"]["section"]){
        params["href"] = url+'?section='+params["data"]["section"]["data"];
    }
    
    if(params["data"]["category"]){
        params["href"] += '&category='+params["data"]["category"]["data"];
    }
    
    if(params["data"]["subcategory"]){
        params["href"] += '&subcategory='+params["data"]["subcategory"]["data"];
    }
    
    state = {
        "params": params
    }
    
    addHistoryNote(state);

    ajax_load(variables.path_root+'/lib/core_ajax.php','POST',params);
    
}

// простой слайдер
function rotator(elem){

    var currentIndex = elem.find('.active').index();
    
    if(currentIndex == (elem.children().length-1)){
        var index = 0;
    }else{
        var index = currentIndex+1;
    }
    
    elem.children().removeClass('active')
                   .fadeOut()
                   .eq(index)
                   .fadeIn()
                   .addClass('active');
}

// внимание, замыкание!
(function(){
    var link;
    var rolled_up;
    //загрузка видео в попап
    window.load_video = function (elem){
        $('.body_popup_wr').removeClass('roll_up')
                           .fadeIn();
        $('html').css('overflow','hidden');

        var video_url = $(elem).parent().find('.video_url').text();
        var video_adress = $(elem).parent().find('.video_adress').text();
        var video_comments = $(elem).parent().find('.video_comments').text();
        var title = $(elem).find('.video_title').last().text();
        var url = window.location.toString();

        if(url.indexOf('/#/') != -1){
            url = url.replace('/#/','/');
        }
        var href = url.substr(variables.path_root.length);
        
        
        link = 'video='+video_url;
        
        if(href.indexOf('?') != -1){
            link = '&'+link;
        }else{
            link = '?'+link;
        }

        $('.body_popup_title').html(title);
        $('.body_popup .video_wr').html('<iframe width="560" height="315" src="'+video_adress+'" frameborder="0" allowfullscreen></iframe>')

        if($('#vk_comments_video').not().empty()){
           $('#vk_comments_video').html(''); 
        }
        
        roll_popup_down();
        
        if(video_comments){
            $('#vk_comments_video').css('margin-top','10px');
            VK.init({ apiId: video_comments, onlyWidgets: true});
            VK.Widgets.Comments("vk_comments_video", 
                                    {
                                        limit: 5,
                                        width: "560",
                                        attach: false,
                                        autoPublish: 0
                                    }
                                   );
                                     
        }else{
            $('#vk_comments_video').css({'margin-top':'0px','height':'0','width':'0','background':'none'})
                                   .html('');
        }

        if(href.indexOf(link) == -1){
            if((href.indexOf('?video=') != -1) || (href.indexOf('&video=') != -1)){
                var old_link = href.substr(href.indexOf('video=')-1);
                href = href.replace(old_link, "");
            }

            change_history_video(href + link);
        }
    }
    // закрываем попап
    window.close_popup = function (){
        $('.body_popup_wr').hide();
        $('.body_popup .video_wr iframe').remove();
        $('html').css('overflow','auto');

        var url = window.location.toString();
        if(url.indexOf('/#/') != -1){
            url = url.replace('/#/','/');
        }
        var href = url.substr(variables.path_root.length);
        href = href.replace(link, "");
        
        change_history_video(href);
    }
    
    // свертывание и развертывание попапа
    window.roll_popup = function(){
        if(rolled_up){
            roll_popup_down();
        }else{
            roll_popup_up();
        }
    }
    
    // разворачиваем попап
    function roll_popup_down(){
        $('.body_popup_wr').removeClass('roll_up');
        $('html').css('overflow','hidden');
        $('.body_popup .video_wr iframe').width(560)
                                         .height(315);
        $('.body_popup_roll').removeClass('down')
                             .addClass('up');
                     
        $('.body_popup_title').show();
        $('#vk_comments_video').show();
        
        var url = window.location.toString();

        if(url.indexOf('/#/') != -1){
            url = url.replace('/#/','/');
        }
        var href = url.substr(variables.path_root.length);
        
        if(href.indexOf('?') != -1){
            link = link.replace("?","&");
        }else{
            link = link.replace("&","?");
        }
        
        if(href.indexOf(link) == -1){
            if((href.indexOf('?video=') != -1) || (href.indexOf('&video=') != -1)){
                var old_link = href.substr(href.indexOf('video=')-1);
                href = href.replace(old_link, "");
            }

            change_history_video(href + link);
        }
        
        rolled_up = false;
    }
    
    // cворачиваем попап
    function roll_popup_up(){
        $('.body_popup_wr').addClass('roll_up');
        $('html').css('overflow','auto');
        $('.body_popup .video_wr iframe').width(240)
                                         .height(135);
        $('.body_popup_roll').removeClass('up')
                             .addClass('down');
                     
        $('.body_popup_title').hide();
        $('#vk_comments_video').hide();
        
        var url = window.location.toString();

        if(url.indexOf('/#/') != -1){
            url = url.replace('/#/','/');
        }
        var href = url.substr(variables.path_root.length);
        href = href.replace(link, "");
        
        change_history_video(href)
        
        rolled_up = true;
    }
    
    // изменить историю браузера с видео
    function change_history_video(href){
        
        var params = {};

        if(global_params){
            params = global_params;
            global_params = false;
        }
        params["variables"] = variables;
        params["href"] = href;
        params["change_page"] = 1;

        state = {
            "params": params
        }

        editHistoryNote(state);
    }
})();

// смена фильтров
// внимание, замыкание!
var dynamicSelect = (function() {
    
        /*
         * список опция для селекта
         * select.name => options[]
         * @type Object
         */
    var optionsList = {},
        
        /*
         * список подчиненных селектов для селекта
         * select.name => childs[]
         * @type Object
         */
        childrenList = {},
        
        /*
         * массив полей для селектов для поиска в массиве
         * select.name => key
         * @type Object
         */
        fieldKeyList = {},
        
        /*
         * массив самих элементов, с которым работаем
         * select.name => select
         * @type Object
         */
        selects = {},
              
        /*
         * элемент родитель селекта
         * select.name => select.parentNode
         * @type Object
         */
        parentsList = {},
        
        /*
         * массив флагов, отвечающих, за то удален ли конкретный элемент
         * select.name => Boolean
         * @type Object
         */
        isDeleted = {},
        
        /*
         * паттерн HTML кода селекта
         * пример "<select class='myselect'></select>"
         * @type String
         */
        patternSelect = "<select></select>";
        
    function reset() {
        optionsList = {};
        childrenList = {};
        fieldKeyList = {};
        selects = {};
        parentsList = {};
        isDeleted = {};
    }
    
    function setPatternSelect(html) {
        if(html != undefined) {
            patternSelect = html;
        }
    }
    
    function getPatternSelect() {
        return patternSelect;
    }
    
    /*
     * создание образа селекта в объекте 
     */
    function createSelect(select) {
        var select = select || null;
        var selectName,
            selectDOM,
            isDeletedValue,
            fieldKey;
        
        
        // если передана строка, то селекта фактически не существует
        // укажем только некоторые его атрибуты
        if(select == null){
            return;
        }else if(typeof select === "string") {
            selectName = select;
            fieldKey = null;
            selectDOM = null;
            isDeletedValue = true;
        }else if(typeof select === "object") {
            selectName = $(select).attr('name');
            fieldKey = $(select).attr("rel");
            selectDOM = select;
            isDeletedValue = false;
        }
        
        if(optionsList[selectName] == undefined) optionsList[selectName] = [];
        if(childrenList[selectName] == undefined) childrenList[selectName] = [];
        if(selects[selectName] == undefined) selects[selectName] = select;
        if(fieldKeyList[selectName] == undefined) fieldKeyList[selectName] = fieldKey;
        if(parentsList[selectName] == undefined) parentsList[selectName] = select.parentNode;
        if(isDeleted[selectName] == undefined) isDeleted[selectName] = isDeletedValue;
    }
    
    /*
     * работа с селектом
     */
    function reCreateSelect(selectName) {
        if(selectName == undefined) return;
        
        if(selects[selectName] != null) {
            $(parentsList[selectName]).html(selects[selectName]);    
        }else{
            $(parentsList[selectName]).html(patternSelect);
            parentsList[selectName].find('select').attr('name', selectName);
        }
        
        isDeleted[selectName] = false;
    }
    
    function deleteSelect(selectName) {
        $('select[name="'+selectName+'"]').detach();
        isDeleted[selectName] = true;
    }
    
    /*
     * работа с опциями селекта
     */
    function createOptionHTML(options) {
        var response = 'option value="'+options.value+'" '+options.selected+'>'+options.title+'</option>';
        
        return response;
    }    
    
    function setOptions(selectName, value) {
        value = value || "all_options";
        
        var html = "",
            htmlCopy,
            selected = "";
        
        if(value == "all_options") {
            selected = selected;
        }
        
        html += createOptionHTML({
            title: "Все",
            value: "all_options",
            selected: selected
        });
                
        htmlCopy = html;
        
        for(var i = 0; i <= optionsList[selectName].length; i++) {
            if(value == optionsList[selectName][i][fieldKeyList[selectName]]) {
                html += createOptionHTML({
                    title: optionsList[selectName][i]["title"],
                    value: optionsList[selectName][i]["value"],
                    selected: selected
                });
            }
        }
        
        if(htmlCopy === html){
            deleteSelect(selectName);
            
            // удаляем все подчиненные селекты рекурсивно
            for(var i = 0; i <= childrenList.length; i++) {
                setOptions(childrenList[selectName][i]);
            }
            
            return;
        }
        
        for(var i = 0; i <= childrenList.length; i++) {
            setOptions(childrenList[selectName][i]);
        }
        
        $(select).html(html);
    }
    
    function deleteOptions(selectName) {
        $('select[name="'+selectName+'"] option').remove();
    }
    
    /*
     * объект, который вернет внешнее API
     */
    var select = {
        reset: function() {
            reset();
        },
        
        setPatternSelect: function(html) {
            setPatternSelect(html);
        },
        
        getPatternSelect: function() {
            return getPatternSelect();
        },

        createSelect: function(elem) {
            createSelect(elem);
        },
        
        setChild: function(selectName, child) {
            if(selectName == undefined) return;
            
            childrenList[selectName].push(child);
        },
                
        setChildren: function(selectName, children) {
            if(selectName == undefined) return;
            
            optionsList[selectName] = children;
        },
                
        getChildren: function(selectName) {
            return (selectName != undefined) ? childrenList[selectName] : childrenList;
        },
        
        setParent: function(selectName, parent) {
            if(selectName == undefined || parent == undefined) return;
            
            if(typeof parent === "object") {
                parentsList[selectName] = parent;
            }
        },

        getParent: function(selectName) {
            return (selectName != undefined) ? parentsList[selectName] : optionsList;
        },
                
        setOptions: function(selectName, options) {
            if(selectName == undefined) return;
            
            optionsList[selectName] = options;
        },
                
        getOptions: function(selectName) {
            return (selectName != undefined) ? optionsList[selectName] : optionsList;
        },
        
        setFieldKey: function(selectName, fieldKey) {
            if(selectName == undefined) return;
            
            fieldKeyList[selectName] = fieldKey;
        },
        
        getFieldKey: function(selectName) {
            return (selectName != undefined) ? fieldKeyList[selectName] : fieldKeyList;
        },
                
        changeChildrenOptions: function(selectName, value) {
            if(isDeleted[selectName]) {
                reCreateSelect(selectName);
            }
            
            deleteOptions(selectName);
            setOptions(selectName, value);
        }
    }
    
    return select;
})();

//мега-хак для центрирования слайдера на главной для ie7
//так делать нельзя... :)
function centuredSlideshowImg(elem){
    $(elem).parents('.slide').css({"display": "block"});
    var margin = centured($(elem).parent(),$('.news_slideshow'));
    $(elem).parents('.slide').css({"margin-left": margin.marginLeft,
                                   "margin-top": margin.marginTop
                                
    });
    $(elem).parents('.slide').not('.current').css({"display": "none"});
}