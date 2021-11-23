## Before build
1. `npm install` - install dependencies
2. `cp .env.default .env` - copy the default env variables for server
3. `cp src/js/credentials.js.default src/js/credentials.js` - copy the default variables for client

## Development

Build a deveploment version of the client and start server + watchers:

```
npm run start
```

or with browsersync:

```
npm run start:browserSync
```

## Testing (local)

Build a production version of the client and start the server:

```
npm run b
```

## Staging (build & deployment)

Build a staging version of the client, copy files to staging server & restart the server:

```
npm run deploy:staging
```

## Production

Build a production version of the client:

```
npm run build
```

## How to debug

Add these enviromental variables to the .env file:

- `DEBUG=app:dsxApi` - log responses from dsx server
- `DEBUG=app:error` - log catched errors
- `DEBUG=app:*` - log both

#### Example `.env` file

```
DSX_HP_PORT=8080
DSX_HP_MYSQL_HOST="ghost.dsx.cool"
DSX_HP_MYSQL_PORT="3306"
DSX_HP_MYSQL_USER="root"
DSX_HP_MYSQL_PASS="root"
DSX_HP_MYSQL_DB_NAME="ghost_prod"
DSX_HP_BLOG_POST_TABLE="posts"
DSX_HP_BLOG_PAGE_SIZE=10
DSX_HP_BLOG_HOST="ghost.dsx.cool"
DSX_API_TICKER_URL="https://dsx.uk/api/ticker"
DSX_API_SYSTEM_HEALTH_URL="https://dsx.uk/api/systemHealth"
DSX_API_FEE_SCHEDULE_URL="https://dsx.uk/exapi/getPaymentCommissions"
DSX_API_CHECK_AUTH="https://dsx.uk/api/checkAuth"
```

## Configuration

Build settings are conveniently exposed in `config.js`.

## File structure

```bash
├── /dist/                      # Production directory (minified, optimized and compiled files)
└── /src/                       # The source code of the application
    ├── /icons/                 # SVG only icons
    ├── /js/                    # Javascript source
    ├── /locales/               # JSON localizations strings
    ├── /pug/                   # Pug templates
        └── /_includes/         # Pug partials that are included / extended
    ├── /scss/                  # SCSS styles
        └── /templates/         # SCSS templates for generator tasks (icons, sprites, etc..)
        └── /generates/         # Generated styles
    ├── /sprites/               # Sprites raster images
    ├── /static/                # Static files (fonts, images, videos, etc..)
├── /tmp/                       # Deploy temporary served files
├── .babelrc                    # Babel config file
├── .editorconfig               # EditorConfig.org file
├── config.json                 # Build config
├── package.json                # Dependencies for NPM/Yarn
├── webpack.config              # Webpack config file
├── yarn.lock                   # Yarn lock file
```

## Other gulp tasks

`gulp sass` compile SASS files

`gulp js` proceed all JS files

`gulp js:copy` just copy and compress all JS files

`gulp icons` proceed all icons and sprites

`gulp icons:sprites` compile spritesheet and style based on sprites in /src/sprites

`gulp icons:svgsprite` compile svg spritesheet and style based on images in /src/icons

`gulp copy:static` copy static files from /src to /dist

`gulp browsersync` start a browser sync server

`gulp watch` start watching stream

`gulp clean` remove temporary files

`gulp clean:dist` clean /dist directory
