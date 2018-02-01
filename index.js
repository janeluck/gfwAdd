#!/usr/bin/env node
const {exec, execSync} = require('child_process')
const clipboardy = require('clipboardy')
// 从剪贴板中获得url
const url = clipboardy.readSync().match(/https?:\/\/[^/]+/)[0]
// 处理成sed命令所需要的格式
const sedUrl = '\\"' + url + '\\"'
// 向gfwlist.js的rules添加网址
exec(`sed -i "" "6 a\\ \n  ${sedUrl},\n"       ~/.ShadowsocksX/gfwlist.js`, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`)
        return;
    }else {
        console.log(`${url}添加成功`)
    }
    // 重启ShadowsocksX
    exec(`osascript -e 'quit app "ShadowsocksX"'  && sleep 1 &&  open -a 'ShadowsocksX'`, (error, stdout, stderr) => {
        console.log(stdout)
        if (error) {
            console.error(`exec error: ${error}`)
            return
        } else {
            console.log('ShadowsocksX已经重启')
        }
    })
})