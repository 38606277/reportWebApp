const path = require("path");
const merge = require("webpack-merge");
const webpackConfigBase = require("./webpack.base.config");
 
const webpackConfigDev = {
    devtool: 'source-map',
    mode:'development',

    devServer:{
        port: 8087,
        host: '0.0.0.0',
        disableHostCheck: true,
        
    }
    
}
module.exports = merge(webpackConfigBase, webpackConfigDev);

