/*
Copyright 2012 Adobe Systems Inc.;
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/*global module:false*/

var path = require('path'),
    chromiumSrc = process.env.CHROMIUM_SRC;

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        topcoat: {
            download: {
                options: {
                    srcPath: "src/",
                    repos: "<%= pkg.topcoat %>"
                }
            }
        },
        unzip: {
            controls: {
                src: "src/controls/*.zip",
                dest: "src/controls"
            },
            theme: {
                src: "src/*.zip",
                dest: "src/"
            }
        },
        stylus: {
            compile_mobile_light_theme: {
                options: {
                    paths: grunt.file.expand('src/controls/**/src/mixins'),
                    import: grunt.file.expand('src/**/src/theme-mobile-light.styl'),
                    compress: false
                },
                files: {
                    'release/css/topcoat-mobile-light.css': 'src/**/skins/**/src/*.styl'
                }
            },
            compile_mobile_dark_theme: {
                options: {
                    paths: grunt.file.expand('src/controls/**/src/mixins'),
                    import: grunt.file.expand('src/**/src/theme-mobile-dark.styl'),
                    compress: false
                },
                files: {
                    'release/css/topcoat-mobile-dark.css': 'src/**/skins/**/src/*.styl'
                }
            },
            compile_desktop_light_theme: {
                options: {
                    paths: grunt.file.expand('src/controls/**/src/mixins'),
                    import: grunt.file.expand('src/**/src/theme-desktop-light.styl'),
                    compress: false
                },
                files: {
                    'release/css/topcoat-desktop-light.css': 'src/**/skins/**/src/*.styl'
                }
            },
            compile_desktop_dark_theme: {
                options: {
                    paths: grunt.file.expand('src/controls/**/src/mixins'),
                    import: grunt.file.expand('src/**/src/theme-desktop-dark.styl'),
                    compress: false
                },
                files: {
                    'release/css/topcoat-desktop-dark.css': 'src/**/skins/**/src/*.styl'
                }
            }
        },

        cssmin: {
            minify: {
                files: {
                    'release/css/topcoat-mobile-light.min.css': 'release/css/topcoat-mobile-light.css',
                    'release/css/topcoat-mobile-dark.min.css': 'release/css/topcoat-mobile-dark.css',
                    'release/css/topcoat-desktop-light.min.css': 'release/css/topcoat-desktop-light.css',
                    'release/css/topcoat-desktop-dark.min.css': 'release/css/topcoat-desktop-dark.css',
                }
            }
        },

        clean: {
            src: ['src'],
            release: ['release'],
            docs: ['docs'],
            zip: ['src/*.zip', 'src/controls/*.zip', 'src/**/skins/*.zip']
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'src/**/font/**',
                    dest: 'release/font/'
                }, {
                    expand: true,
                    flatten: true,
                    src: 'src/**/img/*',
                    dest: 'release/img'
                }]
            },
            docs: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'src/**/font/**',
                    dest: 'docs/font/'
                }, {
                    expand: true,
                    flatten: true,
                    src: 'src/**/img/*',
                    dest: 'docs/img'
                }]
            }
        },

        /* telemetry task, added here because grunt.js file in subfolder can't load Npm tasks */
        telemetry: {
            files: [{
                expand: true,
                cwd: 'test/perf/telemetry/perf/',
                src: ['**'],
                dest: path.join(chromiumSrc, 'tools/perf/')
            }, {
                src: ['release/**'],
                dest: path.join(chromiumSrc, 'tools/perf/page_sets/topcoat/')
            }, {
                expand: true,
                cwd: 'components/topcoat-button/',
                src: ['release/**'],
                dest: path.join(chromiumSrc, 'tools/perf/page_sets/topcoat/')
            }]
        },


        jade: {
            telemetry: {
                options: {
                    data: {
                        debug: false,
                        pretty: true
                    }
                },
                files: [{ //todo see if expandMapping can be used instead of listing them all - https://github.com/gruntjs/grunt-contrib/issues/95
                    dest: path.join(chromiumSrc, "tools/perf/page_sets/topcoat/topcoat_buttons.html"),
                    src: "test/perf/telemetry/perf/page_sets/topcoat/topcoat_buttons.jade"
                }, {
                    dest: path.join(chromiumSrc, "tools/perf/page_sets/topcoat/topcoat_buttons_no_theme.html"),
                    src: "test/perf/telemetry/perf/page_sets/topcoat/topcoat_buttons_no_theme.jade"
                }]
            }
        },

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['lib/**/*.js', 'test/**/*.js']
            }
        },

        watch: {
            files: ['src/style/*.styl'],
            tasks: ['stylus']
        },

        styleguide: {
            docs: {
                files: {
                    'docs/styleguide': 'release/css/*.css'
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-topcoat');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-styleguide');
    grunt.loadNpmTasks('grunt-contrib-cssmin');


    // Default task.
    grunt.registerTask('default', ['clean', 'topcoat', 'unzip', 'clean:zip', 'stylus', 'cssmin', 'copy:dist', 'styleguide', 'copy:docs']);
    grunt.registerTask('docs', ['clean:docs', 'stylus', 'styleguide', 'copy:docs']);

    grunt.registerTask('check_chromium_src', "Internal task to store CHROMIUM_SRC env var into chromiumSrc", function() {
        if (!chromiumSrc) {
            grunt.fail.warn("Please set the CHROMIUM_SRC env var to the root of your chromium sources(ends in /src)");
        } else {
            grunt.log.writeln("CHROMIUM_SRC points to " + chromiumSrc.cyan);
        }
    });

    grunt.registerTask('telemetry', ['check_chromium_src', 'jade:telemetry', 'copy:telemetry']);
    grunt.registerTask('telemetry-submit', 'Submit telemetry test results', function() {

        var exec = require("child_process").exec,
            commandToBeExecuted = 'git log --pretty=format:"%H %ai" | head -n 1',
            done = this.async();

        exec(commandToBeExecuted, function(error, stdout, stderr) {
            if (error) {
                grunt.log.error('Error');
                console.log(error);
                done();
            } else {

                var path = grunt.option('path'),
                    device = grunt.option('device'),
                    test = grunt.option('test');

                if (!path) {
                    console.log('No path file specified');
                    console.log('Usage: grunt telemetry-submit --path=path_to_output_file [--test= Test name ] [--device= Device type ]');
                } else {
                    var submitData = require('./test / perf / telemetry / lib / submitData ');
                    submitData(stdout, path, {
                        device: device,
                        test: test
                    });
                }
            }
        });

    });
};
