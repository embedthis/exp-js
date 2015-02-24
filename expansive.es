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
            Smart defaults for debug. Will use minified if map present.
        */
        usemap:     true,
        usemin:     null,

        minify:     false,
        dotmin:     true,
        genmap:     true,

        compress:   true,
        mangle:     true,

        script: `
            function init() {
                let directories = expansive.directories
                let service = expansive.services['minify-js']
                let collections = expansive.control.collections
                /*
                    Build list of scripts to render. Must be in pak dependency order.
                    Permit explicit script override list in pak package.json pak.render.js
                 */
                let files
                if (service.files) {
                    files = directories.top.files(service.files, { directories: false, relative: true})
                } else {
                    let list = directories.top.files(expansive.control.documents, {directories: false, relative: true })
                    list = list.filter(function(path) path.glob(['**.js', '**.min.map']))
                    files = []
                    /* Sort files by pak dependency order */
                    for each (pak in expansive.pakList) {
                        let path = directories.lib.join(pak)
                        let json = directories.paks.join(pak, 'package.json').readJSON()
                        let explicitRender = (json && json.pak && json.pak.render) ? json.pak.render.js : null
                        for each (file in list) {
                            if (file.startsWith(path)) {
                                if (!explicitRender) {
                                    files.push(file)
                                }
                            }
                        }
                        if (explicitRender) {
                            /* Expand first to permit ${TOP} which is absolute to override directories.lib */
                            for (let [key,value] in explicitRender) {
                                explicitRender[key] = value.expand(expansive.dirTokens, { fill: '.' })
                            }
                            let render = directories.lib.join(pak).files(explicitRender, {relative: true})
                            for each (path in render) {
                                files.push(directories.lib.join(pak, path).relative)
                            }
                        }
                    }
                }
                files = files.unique()

                let scripts = []
                service.hash = {}
                for each (file in files) {
                    let ext = file.extension
                    let script = null
                    if (ext == 'map') {
                        if (service.usemap) {
                            service.hash[file.name] = true
                        } else {
                            service.hash[file.name] = 'not required because "usemap" is false.'
                        }
                    } else if (file.endsWith('min.js')) {
                        if (service.usemin ||
                                (service.usemap && file.replaceExt('map').exists && service.usemin !== false)) {
                            service.hash[file.name] = true
                            script = file
                        } else {
                            service.hash[file.name] = 'not required because "usemin" is false.'
                        }
                    } else if (ext == 'js') {
                        let minified = file.replaceExt('min.js')
                        if (service.usemin && minified.exists) {
                            service.hash[file.name] = 'not required because ' + file.replaceExt('min.js') + ' exists.'
                        } else {
                            let mapped = file.replaceExt('min.map')
                            if (service.usemap && mapped.exists && minified.exists) {
                                service.hash[file.name] = 'not required because ' + file.replaceExt('min.js') + ' exists.'
                            } else if (service.minify) {
                                service.hash[file.name] = { minify: true }
                                script = file
                            } else {
                                service.hash[file.name] = true
                                script = file
                            }
                        }
                    }
                    if (script) {
                        scripts.push(script.trimStart(directories.lib + '/').trimStart(directories.contents + '/'))
                    }
                }
                collections.scripts = scripts + (collections.scripts || [])

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
            }
            init()

            /*
                Transformation callback called when rendering
             */
            function transform(contents, meta, service) {
                let instructions = service.hash[meta.source]
                if (!instructions) {
                    return contents
                }
                if (instructions is String) {
                    vtrace('Info', meta.file + ' ' + instructions)
                    return null
                }
                if (instructions.minify) {
                    vtrace('Info', 'Minify', meta.file)
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
                }
                return contents
            }

            public function renderScripts(filter) {
                let scripts = (expansive.collections.scripts || [])
                for each (script in scripts.unique()) {
                    if (filter && !Path(script).glob(filter)) {
                        continue
                    }
                    write('<script src="' + meta.top + script + '"></script>\n    ')
                }
                if (expansive.collections['inline-scripts']) {
                    write('<script>')
                    for each (script in expansive.collections['inline-scripts']) {
                        write(script)
                    }
                    write('\n    </script>')
                }
            }
        `
    }
})
