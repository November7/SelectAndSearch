function localizePage()
{    
    $('.i18n').each(function() {
        var replaced = $(this)[0].outerHTML.replace(/__MSG_(\w+)__/g, function(match, msg)
        {
            return msg ? browser.i18n.getMessage(msg) : "";
        });
        $(this)[0].outerHTML = replaced;
    })
}