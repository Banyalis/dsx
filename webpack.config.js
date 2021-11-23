const webpack = require('webpack');

const {StatsWriterPlugin} = require('webpack-stats-plugin');

const webpackConfig = {
    entry: {
        bundle: "./src/js/app.js",
        credentials: "./src/js/credentials.js"
    },

    output: {
        path: __dirname,
        filename: "[name].js",
        chunkFilename: '[name].js',
        publicPath: "/homepage/assets/js/"
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /(node_modules|bower_components)/,
                options: {
                    compact: true,
                    presets: ['env'],
                    plugins: [
                        ['transform-runtime', {
                            polyfill: true,
                            regenerator: true
                        }],
                        'transform-object-rest-spread'
                    ]
                }
            },
            {
                test: /\.js$/,
                loader: 'imports-loader?define=>false'
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader' // creates style nodes from JS strings
                }, {
                    loader: 'css-loader' // translates CSS into CommonJS
                }, {
                    loader: 'sass-loader' // compiles Sass to CSS
                }]
            }
        ]
    },

    resolve: {
        modules: ['./src/js', 'node_modules']
    },

    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },

    plugins: [
        new StatsWriterPlugin({
          filename: 'stats.json'
        }),
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery'
        })
    ],

    devtool: "eval-source-map",
    mode: "development"
};

if (!global.isDev) {
    webpackConfig.mode = "production";
    webpackConfig.devtool = "source-map";
}

module.exports = webpackConfig;
