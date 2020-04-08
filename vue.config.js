"use strict";
const path = require('path');
const defaultSettings = require('./src/settings.js');

function resolve(dir) {
    return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template';

const port = process.env.port || process.env.npm_config_port || 8080;

module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
        port: port,
        open: false,
        overlay: {
            warnings: false,
            errors: true
        },
        before: require('./mock/mock-server.js')
    },
    chainWebpack(config){
        //svg 加载规则
        config.module.rule("svg").exclude.add(resolve("src/icons")).end();
        config.module.rule("icons").test(/\.svg$/).include.add(resolve("src/icons")).end()
            .use("svg-sprite-loader").loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]"
            }).end();
    }
};