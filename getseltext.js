browser.runtime.onMessage.addListener( 
    function(request, sender, sendResponse) {
        if (request.method == "getSelText") 
            sendResponse({data: window.getSelection().toString()});
        else
            sendResponse({});
    }
)