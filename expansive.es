Expansive.load({
    transforms: {
        name:       'minify-js',
        input:      'js',
        output:     'js',
        compress:   true,
        mangle:     true,
        dotmin:     false,
        exclude:    null,

        script: `
            function transform(contents, meta, service) {
                let minify = Cmd.locate('uglifyjs')
                if (!minify) {
                    trace('Warn', 'Cannot find uglifyjs')
                    return contents
                }
                let cmd = minify
                if (service.compress) {
                    cmd += ' --compress'
                }
                if (service.mangle) {
                    cmd += ' --mangle'
                }
                if (service.exclude) {
                    if (!(service.exclude is Array)) {
                        service.exclude = [service.exclude]
                    }
                    for each (pat in service.exclude) {
                        if (meta.dest.glob(pat)) {
                            vtrace('Omit', 'Skip minifying', meta.dest)
                            return contents
                        }
                    }
                }
                contents = run(cmd, contents)
                if (service.dotmin && !meta.public.contains('min.js')) {
                    meta.public = meta.public.trimExt().joinExt('min.js', true)
                }
                return contents
            }
        `
    }
})
