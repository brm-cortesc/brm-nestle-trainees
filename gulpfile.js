const gulp      = require('gulp'),
  browserSync = require('browser-sync').create(),
  concat      = require('gulp-concat'),
  rename      = require('gulp-rename'),
  minifyCSS   = require('gulp-minify-css'),
  uglify      = require('gulp-uglify'),
  data        = require('gulp-data'),
  header      = require('gulp-header'),
  sourcemaps  = require('gulp-sourcemaps'),
  stylus      = require('gulp-stylus'),
  nib         = require('nib'),
  stylint     = require('gulp-stylint'),
  path        = require('path'),
  cache       = require('gulp-cache'),
  babel       = require('gulp-babel'),
  purify      = require('gulp-purifycss'),
  pug         = require('gulp-pug'),
  plumber     = require('gulp-plumber'),
  argv        = require('yargs').argv;

//data
const pkg   = require('./frontend.json'),
      debug = argv.debug;


//Rutas
const routes = {
  app: path.join(__dirname, 'publication/'),
  src: path.join(__dirname, 'src/'),
  css: 'css/',
  stylus: 'stylus/',
  views: 'views/',
  templates: 'templates/',
  js: 'js/',
  es5: 'es5/',
};

/**Routes

  routes.app + routes.js = 'publication/js/'
  routes.src + routes.es5 = 'src/es5/'
  routes.app + routes.css = 'publication/css/'
  routes.src + routes.stylus = 'src/stylus/'
  routes.src + routes.views = 'src/views/'
  routes.src + routes.templates = 'src/templates/'

**/


const banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @link <%= pkg.author.name %> - <%= pkg.author.email %>',
  ' * @license <%= pkg.license %>',
  ' *<%= new Date() %>',
  ' */',
  ''
].join('\n');


const baseDir = (debug)?'':routes.app;
//arreglo concatenar JS en el orden en el que se cargan
const jsLibs = [
  baseDir + routes.js +'libs/bootstrap.min.js',
  baseDir + routes.js +'libs/slick.js',
  baseDir + routes.js +'libs/jquery.validate.js',
];

//Tarea para comprimir las libreriras JS
gulp.task('libs',  () =>{
     return gulp.src(jsLibs)
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(plumber())
        .pipe(concat('concat.libs.js'))
        .pipe(gulp.dest(routes.app + routes.js))
        .pipe(rename('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(routes.app + routes.js));
});

//Tarea para compilar Coffeescript
// gulp.task('coffee',  () =>{
//   return gulp.src( routes.src + routes.coffee +  '*.coffee')
//   .pipe(plumber())
//   .pipe(sourcemaps.init()) //cargamos tarea de sourcemaps
//   .pipe(coffee({
//     bare:true
//    }))
//   // .on('error', onError)
//   .pipe(sourcemaps.write('../maps')) //creamos sourcemap aparte
//   .pipe(gulp.dest(routes.app + routes.js))
//   .pipe(browserSync.reload({
//       stream: true
//   }))
// });


//Babel transpailer
gulp.task('js', ()=>{
  return gulp.src(routes.src + routes.es5+ '*js')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(babel({
   'presets': ['es2015']
  }))
  .pipe(sourcemaps.write('../maps')) //creamos sourcemap aparte
  .pipe(gulp.dest(routes.app + routes.js))
  // .pipe(uglify())
  .pipe(gulp.dest(routes.app + routes.js))
  .pipe(browserSync.reload({
      stream: true
    }))

});

//js compiler
gulp.task('js:ugly', ()=>{
  return gulp.src([routes.app + routes.js + '*js', '!'+routes.app + routes.js + 'libs/**', '!'+routes.app + routes.js + 'libs.min.js' ])
  .pipe(uglify())
  .pipe(gulp.dest(routes.app + routes.js))

});

//tarea para compilar stylus
gulp.task('css',  () =>{
  return gulp.src(routes.src + routes.stylus + 'main.styl')
  .pipe(header(banner, { pkg : pkg } ))
  .pipe(plumber())
  .pipe(sourcemaps.init()) //cargamos tarea de sourcemaps
  .pipe(stylus({ //iniciamos stylus
    use: nib(), // cargamos nib para uso de css3
    compress: false
  }))
  // .on('error', onError)
  .pipe(rename('style.css')) //renombramos el archivo
  .pipe(gulp.dest(routes.app + routes.css)) // destino del archivo
  .pipe(sourcemaps.write('../maps')) //creamos sourcemap aparte
  .pipe(gulp.dest(routes.app + routes.css))
  .pipe(browserSync.reload({
      stream: true
    }))

});

gulp.task('csslint', () =>{
  return gulp.src(routes.src + routes.stylus + '**/*.styl')
        .pipe(stylint.reporter({
          verbose: true
         }))

});

//Concatenar y minificar CSS
gulp.task('minicss',  () =>{
  return gulp.src([routes.app + routes.css + '**/*.css', '!'+routes.app + routes.css +'/**/'+pkg.name+'.min.css'])
  .pipe(concat(pkg.name +'.min.css'))
  // .pipe(purify([ routes.src + '/**/*.**'],
  //   {info:true} ))
  .pipe(minifyCSS())
  .pipe(gulp.dest(routes.app + routes.css))

});


//Render de pug
gulp.task('views',  () =>{
  return gulp.src(routes.src + routes.views + '*.pug')
    .pipe(data( function (file) {
      return {
        debug: debug,
        name: pkg.name,
        libs: jsLibs
      };
    }))
  .pipe(plumber())
  .pipe(pug({
    pretty: true
    }))
  // .on('error', onError)
  .pipe(gulp.dest(routes.app))
  .pipe(browserSync.reload({
      stream: true
    }))
});

//Tarea base de browsersync para crear el servidor
gulp.task('browserSync',  () =>{
  browserSync.init({
    server: {
      baseDir: routes.app
    },
  })
});

gulp.task('limpiar', (done) =>{
  return cache.clearAll(done);
});


//tarea que observa cambios para recargar el navegador
gulp.task('watch', ['browserSync', 'views', 'css', 'js'],  () =>{

  gulp.watch( routes.src + routes.stylus +'**/*.styl',{cwd:'./'} , ['css', 'csslint']); //Stylus
  gulp.watch([routes.src + routes.views + '*.pug', routes.src + routes.templates + '**/*.pug'], {cwd:'./'} ,   ['views']); //Pug
  gulp.watch([routes.src + routes.es5 + '*.js'], {cwd:'./'} ,   ['js']); //JS ES6
  // gulp.watch('publication/js/**/*.js', browserSync.reload);
  gulp.watch(routes.app + 'images/**/*.{gif,svg,jpg,png}', {cwd:'./'} ,  browserSync.reload); //Images
  gulp.watch(routes.app + 'fonts/**/*.{svg,eot,ttf,woff,woff2}',{cwd:'./'} ,  browserSync.reload); //Fonts

});

//watch para babelJS y uglify de JS
gulp.task('js:watch', ['js','js:ugly'], ()=>{
  gulp.watch([routes.src + routes.es5 + '*.js'], ['js']); //JS ES6
  gulp.watch([routes.app + routes.js + '*.js'], ['js:ugly']); //JS MINI

});
