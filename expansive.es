Expansive.load({
    expansive: {
        transforms: {
            name:       'minify-js',
            input:      'js',
            output:     'js',
            compress:   true,
            mangle:     true,
            dotmin:     false,

            script: `
                function transform(contents, meta, service) {
                    let minify = Cmd.locate('uglifyjs')
                    if (minify) {
                        let cmd = minify
                        if (service.compress) {
                            cmd += ' --compress'
                        }
                        if (service.mangle) {
                            cmd += ' --mangle'
                        }
                        contents = run(cmd, contents)
                        if (service.dotmin && !meta.public.contains('min.js')) {
                            meta.public = meta.public.trimExt().joinExt('min.js', true)
                        }
                    } else {
                        trace('Warn', 'Cannot find uglifyjs')
                    }
                    return contents
                }
            `
        }
    }
})
