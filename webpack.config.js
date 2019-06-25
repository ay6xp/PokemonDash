const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWepbackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: ['babel-polyfill' ,'./public/js/main.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },  
    devServer: {
        contentBase : './dist'
    },
    plugins : [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './public/index.html'
        }),
        new CopyWepbackPlugin([
            {
                from : './public/img',
                to : './img'
            }, 
            {
                from : './public/levels',
                to : './levels'
            },
            {
                from : './public/sounds',
                to : './sounds'
            },
            {
                from : './public/sprites',
                to : './sprites'
            }
        ])
    ],
    module : {
        rules : [
            {
                test: /\.js$/,
                exclude : /node_modules/,
                use : [
                    {
                        loader : 'babel-loader'
                    }                    
                ]
            }
            
        ]
    }
}
