/*!
 * Gulp SMPL Layout Builder
 *
 * @version 5.0.2 (DSX edition)
 * @author Artem Dordzhiev (Draft)
 * @type Module gulp
 * @license The MIT License (MIT)
 */

require('dotenv').config();

const {spawn} = require('child_process');
const path = require('path');

const gulp = require('gulp');
const browserSync = require('browser-sync');
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('./package.json'));
const $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del', 'merge-stream', 'vinyl-buffer']
});
const webpack = require('webpack-stream');
// const nodemon = require('gulp-nodemon');
const rev = require('gulp-rev');
const chalk = require('chalk');

/* Environment */
global.isDev = process.env.NODE_ENV !== "production";

/* Helpers */
function errorHandler(task, title) {
    return function (err) {
        console.log(task ? chalk.red('[' + task + (title ? ' -> ' + title : '') + ']') : "", err.toString());
        this.emit('end');
    };
}

function getConfig() {
    return JSON.parse(fs.readFileSync('./config.json'));
}

/* Sass task */
function sass() {
    const config = getConfig();
    const dist = global.isDev ? './tmp/homepage/assets/css/' : './dist/homepage/assets/css/';

    return gulp.src('./src/scss/{main,loaders}.scss')
        .pipe($.if(global.isDev, $.sourcemaps.init())).on('error', errorHandler('sass', 'sourcemaps:init'))
        .pipe($.sass({includePaths: "node_modules"})).on('error', errorHandler('sass', 'compile'))
        .pipe($.autoprefixer({
            "browsers": [
                "> 1%",
                "IE 11"
            ]
        })).on('error', errorHandler('sass', 'autoprefixer'))
        .pipe($.if(config.rtl, $.rtlcss())).on('error', errorHandler('sass', 'rtl'))
        .pipe($.if(!global.isDev, $.cleanCss())).on('error', errorHandler('sass', 'cleanCSS'))
        .pipe($.if(!global.isDev, rev())).on('error', errorHandler('sass', 'rev'))
        .pipe($.if(global.isDev, $.sourcemaps.write('.'))).on('error', errorHandler('sass', 'sourcemaps:write'))
        .pipe(gulp.dest(dist))
        .pipe($.if(!global.isDev, rev.manifest())).on('error', errorHandler('sass', 'rev:manifest'))
        .pipe(gulp.dest(dist))
        .pipe(browserSync.stream({match: '**/*.css'}));
}
gulp.task('sass', sass);

/* JS task */
function js() {
    const dist = global.isDev ? './tmp/homepage/assets/js' : './dist/homepage/assets/js';

    return gulp.src(['./src/js/**/*'])
        .pipe(webpack(require('./webpack.config.js'))).on('error', errorHandler('js', 'webpack'))
        .pipe(gulp.dest(dist))
        .pipe(browserSync.stream({match: '**/*.js'}));
}
gulp.task('js', js);

function jsProduction(done) {
    const dist = './dist/homepage/assets/js';

    return gulp.src(['./src/js/**/*'])
        .pipe(webpack(require('./webpack-production.config.js'))).on('error', errorHandler('js', 'webpack'))
        .pipe(gulp.dest(dist));
}
gulp.task('js:production', jsProduction);

/* Icon tasks */
gulp.task('icons:svgsprites', () => {
    if (fs.existsSync('./src/icons/')) {
        const dist = global.isDev ? './tmp/' : './dist/';
        const svgSpriteOptions = {
            mode: {
                symbol: {
                    dest: "homepage/assets/img/sprites/",
                    sprite: "svgsprites.svg",
                    render: {
                        scss: {
                            dest: '../../../../../src/scss/generated/svgsprites.scss',
                            template: "./src/scss/templates/svgsprites.scss"
                        }
                    }
                }
            }
        };

        return gulp.src('./src/icons/*.svg')
            .pipe($.svgSprite(svgSpriteOptions))
            .pipe(gulp.dest(dist));
    }
});


gulp.task('images:sizes', () => {
    const dist = global.isDev ? './tmp/homepage/assets/img/' : './dist/homepage/assets/img/';
    const result = {};

    const files = [dist];
    do {
        const filepath = files.pop();
        const stat = fs.lstatSync(filepath);
        if (stat.isDirectory()) {
            fs
                .readdirSync(filepath)
                .forEach(f => files.push(path.join(filepath, f)));
        } else if (stat.isFile()) {
            result[path.relative(dist, filepath).replace(/\\/g, '/')] = stat.size;
        }
    } while (files.length !== 0);

    const jsDist = global.isDev ? './tmp/homepage/assets/js' : './dist/homepage/assets/js';
    const gulpHeader = require('gulp-header');

    return gulp.src(['./src/js/loader.js'])
        .pipe(gulpHeader('const filesSizes = ' + JSON.stringify(result)))
        .pipe(gulp.dest(jsDist));
});


gulp.task('icons:sprites', () => {
    if (fs.existsSync('./src/sprites/')) {
        const dist = global.isDev ? './tmp/homepage/assets/img/sprites/' : './dist/homepage/assets/img/sprites/';
        const spriteData = gulp.src('./src/sprites/**/*.png').pipe($.spritesmith({
            imgPath: '../img/sprites/sprites.png',
            imgName: 'sprites.png',
            retinaImgPath: '../img/sprites/sprites@2x.png',
            retinaImgName: 'sprites@2x.png',
            retinaSrcFilter: ['./src/sprites/**/**@2x.png'],
            cssName: 'sprites.scss',
            cssTemplate: "./src/scss/templates/sprites.scss",
            padding: 1
        }));

        const imgStream = spriteData.img
            .pipe(gulp.dest(dist));

        const cssStream = spriteData.css
            .pipe(gulp.dest('./src/scss/generated'));

        return $.mergeStream(imgStream, cssStream);
    }
});

gulp.task('icons', gulp.parallel(['icons:svgsprites', 'icons:sprites']));

/* Browsersync Server */
gulp.task('browsersync', (done) => {
    browserSync.init({
        proxy: `localhost:${process.env.DSX_HP_PORT || 3000}`,
        notify: false,
        port: 64999,
        ui: false,
        online: false,
        ghostMode: {
            clicks: false,
            forms: false,
            scroll: false
        }
    });

    done();
});

/* Watcher */
gulp.task('watch', (done) => {
    global.isWatching = true;

    $.watch("./src/scss/**/*.scss", sass);
    $.watch("./src/js/**/*.js", js);

    done();
});

gulp.task('nodemon', (done) => {
    const env = Object.create(process.env);
    env.NODE_ENV = 'development';
    spawn('node', ['server/index.js'], {
        env,
        stdio: 'inherit',
    });
    // nodemon({
    //     script: 'server/index.js',
    //     ext: 'js',
    //     cwd: __dirname,
    //     ignore: [],
    //     watch: 'server/**/*.js',
    //     env: {
    //         'NODE_ENV': 'development',
    //     },
    // });

    done();
});

gulp.task('nodemon:prod', (done) => {
    const env = Object.create(process.env);
    env.NODE_ENV = 'production';

    spawn('node', ['server/index.js'], {
        env,
        stdio: 'inherit',
    });
    // nodemon({
    //     script: 'server/index.js',
    //     ext: 'js',
    //     cwd: __dirname,
    //     ignore: [],
    //     watch: 'server/**/*.js',
    //     env: {
    //         'NODE_ENV': 'production',
    //     },
    // });

    done();
});

/* FS tasks */
gulp.task('clean', () => {
    return $.del(['./dist/**/*', './tmp/**/*']);
});

gulp.task('clean:dist', () => {
    return $.del(['./dist/**/*']);
});

gulp.task('copy:static', () => {
    return gulp.src(['./src/static/**/*'])
        .pipe(gulp.dest('./dist/homepage'));
});

gulp.task('copy:credentials', () => {
    return gulp.src(['./src/js/credentials.js'])
        .pipe(gulp.dest('./dist/homepage/assets/js/'));
});

gulp.task('copy:tmp', () => {
    return gulp.src(['./src/static/**/*'])
        .pipe(gulp.dest('./tmp/homepage'));
});

gulp.task('build:staging', (done) => {
    global.isDev = false;

    gulp.series(
        'clean:dist',
        'icons',
        gulp.parallel([sass, 'js']),
        'copy:static',
        'images:sizes'
    )(done);
});
gulp.task('build', (done) => {
    global.isDev = false;

    gulp.series(
        'clean:dist',
        'icons',
        gulp.parallel([sass, 'js:production']),
        'copy:static',
        'images:sizes'
    )(done);
});
gulp.task('serve', gulp.series(
    'clean',
    'icons',
    'copy:tmp',
    gulp.parallel([sass, 'js']),
    'images:sizes',
    'nodemon',
    'watch'
));
gulp.task('serve:browserSync', gulp.series(
    'clean',
    'icons',
    'copy:tmp',
    gulp.parallel([sass, 'js']),
    'images:sizes',
    'nodemon',
    'browsersync',
    'watch'
));
gulp.task('serve:testing', (done) => {
    global.isDev = false;

    gulp.series(
        'clean',
        'icons',
        'copy:static',
        gulp.parallel([sass, 'js:production']),
        'images:sizes',
        'copy:credentials',
        `nodemon:prod`,
        'watch'
    )(done);
});
gulp.task('default', gulp.series(['build']));
