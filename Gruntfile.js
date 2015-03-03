'use strict';
var path = require('path');

module.exports = function(grunt) {

    grunt.event.once('git-describe', function(rev) {
        grunt.option('buildrev', rev);
    });

    grunt.initConfig({
        requirejs: {
            compile: {
                options: {
                    appDir: "./modules/web/app",
                    baseUrl: ".",
                    dir: "./modules/web/public/js/build",
                    findNestedDependencies: true,
                    removeCombined: true,
                    skipDirOptimize: false,
                    modules: [{
                        name: "app"
                    }, {
                        name: "routes/main",
                        exclude: [
                            "app"
                        ]
                    }],
                    paths: {
                        "tinybone": "../../tinybone",
                        "lodash": "../public/js/lodash",
                        "dust": "../public/js/dust",
                        "dust-helpers": "../public/js/dust-helpers",
                        "dustjs": "../public/js/dust",
                        "dustc": "../../tinybone/dustc",
                        "text": "../../../node_modules/requirejs-text/text",
                        "safe": "../public/js/safe",
                        "bootstrap": "../public/js/bootstrap",
                        "moment": "../public/js/moment",
                        "backctx": "empty:",
                        "highcharts": "empty:",
                        "jquery": "empty:",
                        "jquery-cookie": "../public/js/jquery-cookie",
                    },
                    shim: {
                        'dust-helpers': {
                            deps: ['dust'],
                            exports: 'helpers'
                        },
                        'dust': {
                            exports: 'dust'
                        }
                    },
                    done: function(done, output) {
                        console.log(output);
                        done();
                    }
                }
            }
        },
        "git-describe": {
            "options": {},
            "main": {}
        },
        nodemon: {
            dev: {
                script: 'app.js'
            }
        }
    })

    grunt.registerTask('ensureLocalConfig', function() {
        var config = {};
        if (grunt.file.exists('local-config.js'))
            config = require("./local-config.js");
        var rev = grunt.option('buildrev').toString()
        if (config.rev != rev) {
            config.rev = rev;
            grunt.file.write('local-config.js', "module.exports=" + JSON.stringify(config, null, "\t"));
        }
    })

    grunt.registerTask('default', []);

    grunt.registerTask('build', ['git-describe', 'ensureLocalConfig', 'requirejs:compile']);

    grunt.registerTask('server', ['build', 'nodemon']);

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-git-describe');
    grunt.loadNpmTasks('grunt-nodemon');
};