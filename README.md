exp-js
===

Expansive plugin for Javascript files.

Provides the 'minify-js' service.

### To install:

    pak install exp-js

### Description

Script files can be optimized by post-processing to remove white-space, managle names and otherwise compress.
By default, the script files use a '.js' extension, but will use a '.min.js' extension if the 'dotmin' option is
enabled.

### To configure in expansive.json:

* minify-js.enable &mdash; Enable minifying script files.
* minify-js.files &mdash; Array of files to minify. Files are relative to 'source'.
* minify-js.compress &mdash; Enable compression of script files.
* minify-js.mangle &mdash; Enable mangling of Javascript variable and function names.
* minify-js.dotmin &mdash; Set '.min.js' as the output file extension after minification. Otherwise will be '.js'.
* minify-js.exclude &mdash; Array of files to exclude from minification. Files are relative to 'source'.

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
