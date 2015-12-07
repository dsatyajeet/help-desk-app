exports.generalSyncCallback = function (context, err, resultObj, message) {
    if (err) {
        renderError(err, context.request, context.response);
        if(context.callback)
        context.callback(err);
    }
    else {
        if (message) {
            context.response.send(message);
        }
        else {
            if (resultObj)
                context.response.json(resultObj);
        }
        if(context.callback)
        context.callback(null);
    }
}

function renderError(err, req, res, next) {
    console.log('custom error..utilservice' + err);
    res.status(err.status || 500);
    res.json({errorMessage: err.message});
}

exports.getContext=function(req,res,cb){
    var context={};
    context.request=req;
    context.response=res;
    context.callback=cb;
    return context;
}