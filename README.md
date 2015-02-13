exp-js
===

Expansive plugin for Javascript files.

Provides the 'minify-js' service.

### To install:

    pak install exp-js

### Description

The minify-js plugin intelligently selects minified or raw Javascript files. By default, it runs in a "debug"
mode where minified scripts are used if a corresponding source map file with a 'min.map' extension is present.
Otherwise, raw Javascript files with a plain 'js' extension will be used.

Script files can be optimized by post-processing to remove white-space, managle names and otherwise compress.
By default, the script files use a '.js' extension, but will use a '.min.js' extension if the 'dotmin' option is
enabled.

### To configure in expansive.json:

* minify-js.compress &mdash; Enable compression of script files. Default to true.
* minify-js.dotmin &mdash; Use '.min.js' as the output file extension after minification. Otherwise will be 
    '.js'.  Default to true.
* minify-js.enable &mdash; Enable minifying script files. Default to true.
* minify-js.exclude &mdash; Array of files to exclude from minification. Files are relative to 'source'.
* minify-js.files &mdash; Array of files to minify. Files are relative to 'source'.
* minify-js.genmap &mdash; Generate source map for minified scripts if 'minified' is true. Default to true.
* minify-js.mangle &mdash; Enable mangling of Javascript variable and function names. Default to true.
* minify-js.minify &mdash; Enable minifying of Javascript files. Default to false.
* minify-js.usemap &mdash; Use minified Javascript if corresponding source maps is present. Default to true.
* minify-js.usemin &mdash; Use minified Javascripts if present. Default to false.

```
{
    services: {
        'minify-js': {
            enable: true,
            files:      null,
            compress:   true,
            mangle:     true,
            dotmin:     false,
            exclude:    []
        }
    }
}
```

### Get Pak from

[https://embedthis.com/pak/](https://embedthis.com/pak/download.html)
