const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Practice - RxJS and Webpack'
        })
    ],
    output: {
        filename: '[name].bundles.js',
        path: path.resolve(__dirname, 'dist')
    }
};
