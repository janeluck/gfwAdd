#!/usr/bin/env node
const {exec, execSync} = require('child_process')
const chalk = require('chalk')
const clipboardy = require('clipboardy')
const r = /https?:\/\/[^/]+/
const argUrl = process.argv[2]
let url = ''
// 先从命令行提取参数
if (argUrl) {
    url = argUrl.match(r)[0]
} else {
    // 从剪贴板中获得url
    url = clipboardy.readSync().match(r)[0]
}

// 处理成sed命令所需要的格式
const sedUrl = '\\"' + url + '\\"'
// 向gfwlist.js的rules添加网址
exec(`sed -i "" "6 a\\ \n  ${sedUrl},\n"       ~/.ShadowsocksX/gfwlist.js`, (error, stdout, stderr) => {
    if (error) {
        console.error(`${chalk.red('✘')}  exec error: ${error}`)
        return;
    } else {
        console.log(`${chalk.green('✔')}  success:  ${url}添加成功`)
    }
    // 重启ShadowsocksX
    exec(`osascript -e 'quit app "ShadowsocksX"'  && sleep 1 &&  open -a 'ShadowsocksX'`, (error, stdout, stderr) => {
        console.log(stdout)
        if (error) {
            console.error(`${chalk.red('✘')}  exec error: ${error}`)
            return
        } else {
            console.log(`${chalk.green('✔')}  ShadowsocksX已经重启`)
        }
    })
})
