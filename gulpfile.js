//require gulp 
//
var gulp = require('gulp-help')(require('gulp'));

//include plugins 
//
var   plumber = require('gulp-plumber'),
        watch = require('./semantic/tasks/watch'),
        build = require('./semantic/tasks/build'),
        buildJS = require('./semantic/tasks/build/javascript'),
        buildCSS = require('./semantic/tasks/build/css'),
        buildAssets = require('./semantic/tasks/build/assets'),
        clean = require('./semantic/tasks/clean'),
        nodemon = require('gulp-nodemon'),
        jspm = require('jspm'),
        path = require('path'),
        rename = require('gulp-rename'),
        template = require('gulp-template'),
        uglify = require('gulp-uglify'),
        htmlreplace = require('gulp-html-replace'),
        ngAnnotate = require('gulp-ng-annotate'),
        yargs = require('yargs').argv,
        rimraf = require('rimraf'),
        jshint = require('gulp-jshint'),
        stylish = require('jshint-stylish'),
        exec = require('child_process').exec;
        
//Define functions
//        
        var root = 'public';
       //error logging
       //
        var onError = function(err) {
            console.log(err)
        };
        // helper method to resolveToApp paths
        // 
        var resolveTo = function(resolvePath) {
            return function(glob) {
                glob = glob || '';
                return path.resolve(path.join(root, resolvePath, glob));
            }
        };

        var resolveToApp = resolveTo('app'); // public/app/{glob}
        var resolveToComponents = resolveTo('app/components'); // public/app/components/{glob}

        // map of paths
        // 
        var paths = {
            css: resolveToApp('**/*.css'),
            html: [
                resolveToApp('**/*.html'),
                path.join(root, 'index.html')
            ],
            blankTemplates: path.join(__dirname, 'generator', 'component/**/*.**'),
            dist: path.join(__dirname, 'dist/')
        };

  ////////////////////////////////////////////////////////////
 //                      Tasks                         //
////////////////////////////////////////////////////////////

//Launch app and watch for changes
//
gulp.task('serve', function() {
    nodemon({
        script: 'server.js',
        ext: 'html js',
        watch: [
            'app/**/*',
            'public/app/**/*'
            ],
        tasks: ['jshint']
    })
    .on('restart', function() {
        console.log('Vita restarted for changes');
    })
});

//Launch Mongo
//
gulp.task('mongo', exec('mongod'));

//jshint task
//
gulp.task('jshint', function() {
    gulp.src(['./app/**/*.js', './public/app/**/*.js'])
        .pipe(plumber({
            errorHandler : onError
        }))
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

//Create Angular components
//
gulp.task('component', function(){
    var cap = function(val){
        return val.charAt(0).toUpperCase() + val.slice(1);
    };

    var name = yargs.name;
    var parentPath = yargs.parent || '';
    var destPath = path.join(resolveToComponents(), parentPath, name);

    return gulp.src(paths.blankTemplates)
        .pipe(template({
            name: name,
            upCaseName: cap(name)
        }))
        .pipe(rename(function(path){
            path.basename = path.basename.replace('temp', name);
        }))
        .pipe(gulp.dest(destPath));
});

//Build and minify app using jspm
//
gulp.task('build', function() {
    var dist = path.join(paths.dist + 'app.js');
    rimraf.sync(path.join(paths.dist, '*'));
    // Use JSPM to bundle our app
    return jspm.bundleSFX(resolveToApp('app'), dist, {})
        .then(function() {
            // Also create a fully annotated minified copy
            return gulp.src(dist)
                .pipe(ngAnnotate())
                .pipe(uglify())
                .pipe(rename('app.min.js'))
                .pipe(gulp.dest(paths.dist))
        })
        .then(function() {
            // Inject minified script into index
          return gulp.src('public/index.html')
                .pipe(htmlreplace({
                    'js': 'app.min.js'
                }))
                .pipe(gulp.dest(paths.dist));
        });
});

//Semantic UI Tasks
//
gulp.task('watch', 'Watch for site/theme changes', watch);

gulp.task('build-semantic', 'Builds all files from source', build);
gulp.task('build-javascript', 'Builds all javascript from source', buildJS);
gulp.task('build-css', 'Builds all css from source', buildCSS);
gulp.task('build-assets', 'Copies all assets from source', buildAssets);

gulp.task('clean', 'Clean dist folder', clean);

//Make serve the default gulp task
//
gulp.task('default', ['mongo', 'jshint', 'serve'])