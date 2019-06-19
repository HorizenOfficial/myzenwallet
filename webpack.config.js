/*
 * ./webpack.config.js
 */

const webpack = require("webpack");
const path = require('path');
const fs = require('fs')

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: "source-map",
    entry: {
        index: './app/index.js',
        faq: './app/faq.js',
        guide: './app/guide.js'
    },
    output: {
        path: path.resolve('dist'),
        filename: 'js/[name].js'
    },
    module: {
        rules: [
            { test: /\.jsx?$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ["@babel/preset-env", "@babel/preset-react"]
                }
              }
            },
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
            {
                test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
                loader: 'file-loader?name=[name].[ext]'  // <-- retain original file name
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: 'assets/images/favicon.ico',
            template: './app/index.html',
            chunks: ['index'],
            filename: 'index.html',
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            favicon: 'assets/images/favicon.ico',
            template: './app/index.html',
            chunks: ['faq'],
            filename: 'faq.html',
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            favicon: 'assets/images/favicon.ico',
            template: './app/index.html',
            chunks: ['guide'],
            filename: 'guide.html',
            inject: 'body'
        }),
        new webpack.DefinePlugin({
            global: 'window'		// Placeholder for global used in any node_modules
        })
    ],
    node: {
        fs: 'empty',
        global: false
    }
}
