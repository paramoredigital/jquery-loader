/**
 * jQuery Loader Plugin
 *
 * Simple plugin that allows for lazy-loading module dependencies as needed.
 *
 * By Jesse Bunch on November 8, 2012
 */
(function ($)
{
    /**
     * @type {Object}
     */
    var defaultOptions = {
        method:"parallel",
        basePath:"./"
    };

    /**
     * @param {Object} scripts
     * @param {Object} options
     * @param {Function} finalCallback
     */
    $.loader = function (scripts, options, finalCallback)
    {
        options = $.extend(defaultOptions, options);

        scripts = normalizeScriptPaths(scripts, options.basePath);

        if (options.method == "parallel")
            loadInParallel(scripts, options, finalCallback);
        else
            loadInSerial(scripts, options, finalCallback);
    };

    $.loader.setBasePath = function(newPath)
    {
        defaultOptions.basePath = newPath;
    };

    /**
     * @param {Object} scripts
     * @param {Object} options
     * @param {Function} finalCallback
     */
    function loadInParallel(scripts, options, finalCallback)
    {
        if (typeof scripts != "object")
            scripts = [scripts];

        for (var i = 0; i <= scripts.length; i++) {
            var script = scripts[i];
            loadIndividualScript(script, function ()
            {
                if (i <= scripts.length && typeof finalCallback == "function")
                    finalCallback();
            });
        }
    }

    /**
     * @param {Object} scripts
     * @param {Object} options
     * @param {Function} finalCallback
     */
    function loadInSerial(scripts, options, finalCallback)
    {
        var scriptIndex = 0;

        loadIndividualScript(scripts[scriptIndex], loadScriptCallback);

        function loadScriptCallback()
        {
            scriptIndex++;

            if (scriptIndex >= scripts.length) {
                if (typeof finalCallback == "function")
                    finalCallback();
            } else {
                loadIndividualScript(scripts[scriptIndex], loadScriptCallback);
            }
        }
    }

    /**
     * @param {String} script
     * @param {Function} callback
     */
    function loadIndividualScript(script, callback)
    {
        $.ajax({
            url:script,
            dataType:"script",
            success:function ()
            {
                callback();
            },
            error: function()
            {
                callback();
            }
        });
    }

    /**
     * @param {Object} scripts
     * @param {String} basePath
     * @return {Object}
     */
    function normalizeScriptPaths(scripts, basePath)
    {
        for (var i = 0; i < scripts.length; i++) {
            scripts[i] = normalizeScriptPath(scripts[i], basePath);
        }

        return scripts;
    }

    /**
     * @param {String} script
     * @param {String} basePath
     * @return {String}
     */
    function normalizeScriptPath(script, basePath)
    {
        console.log(typeof script);
        if (script.substring(-3) == ".js")
            return script;

        return basePath + script + ".js";
    }

})(jQuery);