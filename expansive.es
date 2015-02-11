Expansive.load({
    transforms: {
        name:       'minify-js',
        files:      null,
        input:      'js',
        output:     'js',
        compress:   true,
        mangle:     true,
        dotmin:     false,
        exclude:    null,

        script: `
            let service = expansive.services['minify-js']
            service.files = expansive.directories.contents.files(service.files, {relative: true}).unique()
            function transform(contents, meta, service) {
                let match = service.files == null
                for each (file in service.files) {
                    if (meta.file.glob(file)) {
                        match = true
                        break
                    }
                }
                if (!match) {
                    vtrace('Omit', 'Skip minifying', meta.file)
                    return contents
                }
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
                        if (meta.file.glob(pat)) {
                            vtrace('Omit', 'Skip minifying', meta.file)
                            return contents
                        }
                    }
                }
                contents = run(cmd, contents)
                if (service.dotmin && !meta.document.contains('min.js')) {
                    meta.document = meta.document.trimExt().joinExt('min.js', true)
                }
                return contents
            }
        `
    }
})
