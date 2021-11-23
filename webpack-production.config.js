const webpack = require('webpack');

const {StatsWriterPlugin} = require('webpack-stats-plugin');

const webpackConfig = {
    entry: {
        bundle: "./src/js/app.js"
    },

    output: {
        path: __dirname,
        filename: "[name]-[chunkhash].js",
        chunkFilename: '[name]-[chunkhash].js',
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

    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },

    mode: "development"
};

if (!global.isDev) {
    webpackConfig.mode = "production";
}

module.exports = webpackConfig;
