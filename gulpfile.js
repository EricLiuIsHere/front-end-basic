/**
 * 组件安装
 * npm install gulp jshint gulp-strip-debug gulp-util gulp-imagemin gulp-ruby-sass gulp-minify-css gulp-jshint gulp-uglify gulp-rename gulp-concat gulp-clean gulp-livereload tiny-lr --save-dev
 */

// 引入 gulp及组件
var gulp    = require('gulp'),                 //基础库
    imagemin = require('gulp-imagemin'),       //图片压缩
    sass = require('gulp-ruby-sass'),          //sass
    minifycss = require('gulp-minify-css'),    //css压缩
    jshint = require('gulp-jshint'),           //js检查
    uglify  = require('gulp-uglify'),          //js压缩
    rename = require('gulp-rename'),           //重命名
    concat  = require('gulp-concat'),          //合并文件
    clean = require('gulp-clean'),             //清空文件夹
    tinylr = require('tiny-lr'),               //livereload
    server = tinylr(),
    stripDebug = require('gulp-strip-debug'),
    port = 35729,
    livereload = require('gulp-livereload');   //livereload
// HTML处理
/*gulp.task('html', function() {
    var htmlSrc = './views/*.html',
        htmlDst = './views/';

    gulp.src(htmlSrc)
        .pipe(livereload(server))
        .pipe(gulp.dest(htmlDst))
});
*/
// 样式处理
gulp.task('sass', function () {
    var cssSrc = './pre-public/pre-sass/*.scss',
        cssDst = './public/css/';
        return sass(cssSrc)
        .on('error',sass.logError)
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(cssDst));
    // gulp.src(cssSrc)
    //     .pipe(sass({ style: 'compressed'}))
    //     .pipe(gulp.dest(cssDst))
    //     .pipe(rename({ suffix: '.min' }))
    //     .pipe(minifycss())
    //     .pipe(livereload(server))
    //     .pipe(gulp.dest(cssDst));
});
gulp.task('css',function(){
	var cssSrc = './pre-public/pre-sass/*.css',
        cssDst = './public/css/';
        gulp.src(cssSrc)
        .pipe(concat('main.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(cssDst));
})

// 图片处理
gulp.task('images', function(){
    var imgSrc = './pre-public/pre-images/*',
        imgDst = './public/images';
    gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
})

// js处理
gulp.task('js', function () {
    var jsSrc = './pre-public/pre-js/*.js',
        jsDst ='./public/js/';

    gulp.src(jsSrc)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        // .pipe(concat('main.js'))
        // .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(stripDebug())
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));
});

// 清空图片、样式、js
gulp.task('clean', function() {
    gulp.src(['./public/css', './public/js', './public/images'], {read: false})
        .pipe(clean());
});

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['watch'], function(){
    gulp.start(/*'html',*/'sass','css','images','js');
});

// 监听任务 运行语句 gulp watch
gulp.task('watch',function(){

    server.listen(port, function(err){
        if (err) {
            return console.log(err);
        }

        // 监听html
        /*gulp.watch('./views/*.html', function(event){
            gulp.run('html');
        });*/

        // 监听sass
        gulp.watch('./pre-public/pre-sass/*.scss', function(){
            gulp.run('sass');
        });

        // 监听css
        gulp.watch('./pre-public/pre-sass/*.css', function(){
            gulp.run('css');
        });

        //监听images
        gulp.watch('./pre-public/pre-images/*', function(){
            gulp.run('images');
        });

        // 监听js
        gulp.watch('./pre-public/pre-js/*.js', function(){
            gulp.run('js');
        });

    });
});