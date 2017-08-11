/*
 * ./webpack.config.js
 */

const path = require('path');
const fs = require('fs')

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './app/index.js',
        faq: './app/faq.js'
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
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
            template: './app/faq.html',
            chunks: ['faq'],
            filename: 'faq.html',
            inject: 'body'
        })
    ],
    node: {
        fs: 'empty'
    }
}