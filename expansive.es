Expansive.load({
    transforms: {
        name:       'minify-js',
        files:      null,
        
        mappings: {
            'js',
            'min.js',
            'min.map'
        },

        /* 
            Smart defaults for debug. Will use minified if map present
        */
        usemap:     true,
        usemin:     false,

        minify:     false,
        dotmin:     true,
        genmap:     true,

        compress:   true,
        mangle:     true,

        exclude:    null,

        script: `
            let service = expansive.services['minify-js']
            if (!service.files) {
                let files = expansive.directories.top.files(expansive.control.documents, 
                    {exclude: 'directories', relative: true})
                service.files = files.filter(function(path) path.glob('**.js'))
                service.files += files.filter(function(path) path.glob('**.min.map'))
            }
            if (service.exclude) {
                if (!(service.exclude is Array)) {
                    service.exclude = [service.exclude]
                }
            }
            service.hash = {}
            for each (file in service.files) {
                for each (pat in service.exclude) {
                    if (file.glob(pat)) {
                        file = null
                        break
                    }
                }
                if (file) {
                    service.hash[file.name] = true
                }
            }
            let minify = Cmd.locate('uglifyjs')
            if (!minify) {
                trace('Warn', 'Cannot find uglifyjs')
                service.enable = false
            }
            let cmd = minify
            if (service.compress) {
                cmd += ' --compress'
            }
            if (service.mangle) {
                cmd += ' --mangle'
            }
            service.cmd = cmd


            function transform(contents, meta, service) {
                if (!service.hash[meta.source]) {
                    vtrace('Omit', 'Skip minifying', meta.source)
                    return contents
                }
                let ext = meta.file.extension
                if (ext == 'map') {
                    if (service.usemap) {
                        return contents
                    }
                    vtrace('Skip', meta.file + '. Not required because "usemap" is false.')
                    return null
                }
                if (meta.file.endsWith('min.js')) {
                    if (service.usemin || (service.usemap && meta.source.replaceExt('map').exists)) {
                        return contents
                    }
                    vtrace('Skip', meta.file + '. Not required because "usemin" is false.')
                    return null
                }
                if (ext == 'js') {
                    let minified = meta.source.replaceExt('min.js')
                    if ((service.usemin || service.usemap) && minified.exists) {
                        vtrace('Skip', meta.file + '. Not required because ' + meta.file.replaceExt('min.js') + ' exists.')
                        return null
                    }
                    if (service.minify) {
                        let cmd = service.cmd
                        if (service.genmap) {
                            let mapFile = meta.document.replaceExt('min.map')
                            mapFile.dirname.makeDir()
                            cmd += ' --source-map ' + mapFile
                            contents = runFile(cmd, contents, meta)
                            let map = mapFile.readJSON()
                            map.sources = [ meta.document ]
                            mapFile.write(serialize(map))
                        } else {
                            contents = run(cmd, contents)
                        }
                        if (service.dotmin && !meta.document.contains('min.js')) {
                            meta.document = meta.document.trimExt().joinExt('min.js', true)
                        }
                        return contents
                    }
                }
                return contents
           }
        `
    }
})
