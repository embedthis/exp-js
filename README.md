exp-js
===

Expansive plugin to manage rendering Javascript files.

Provides the 'minify-js' service.

### To install:

    pak install exp-js

### Description

The minify-js service intelligently selects processes Javascript files. By default, it runs in a "debug"
mode where supplied minified scripts are used if a corresponding source map file with a 'min.map' extension is present.
Otherwise, raw Javascript files with a plain 'js' extension will be used.

Script files can be optimized by minfication post-processing to remove white-space, managle names and otherwise compress.
By default, the script files use a '.js' extension, but will use a '.min.js' extension if the 'dotmin' option is
enabled.

The renderScripts() API may be used in documents to render HTML script elements for all required scripts. The scripts
to be be rendered will be added to the Expansive 'scripts' collection in a bottom up, Pak dependency order. The list of
script can be overriden by modifying the 'scripts' collection using the addItems, removeItems APIs.

The renderScripts API may be invoked with an optional array of Path patterns to select a subset of scripts for which 
to create script elements.

### To configure in expansive.json:

* minify-js.compress &mdash; Enable compression of script files. Default to true.
* minify-js.dotmin &mdash; Use '.min.js' as the output file extension after minification. Otherwise will be 
    '.js'.  Default to true.
* minify-js.enable &mdash; Enable minifying script files. Default to true.
* minify-js.files &mdash; Array of files to minify. Files are relative to 'source'.
* minify-js.genmap &mdash; Generate source map for minified scripts if 'minified' is true. Default to true.
* minify-js.mangle &mdash; Enable mangling of Javascript variable and function names. Default to true.
* minify-js.minify &mdash; Enable minifying of Javascript files. Default to false.
* minify-js.usemap &mdash; Use minified Javascript if corresponding source maps is present. Default to true.
* minify-js.usemin &mdash; Use minified Javascripts if present. Default to null. Set explicitly to false
    to disable the use of minified resources.

```
{
    services: {
        'minify-js': {
            enable: true,
            files:      null,
            compress:   true,
            mangle:     true,
            dotmin:     false,
        }
    }
}
```

### Get Pak from

[https://embedthis.com/pak/](https://embedthis.com/pak/download.html)
