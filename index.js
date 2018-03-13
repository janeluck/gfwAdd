#!/usr/bin/env node
const {exec} = require('child_process'),
    chalk = require('chalk'),
    clipboardy = require('clipboardy'),
    meow = require('meow'),
    r = /https?:\/\/[^/]+/
let url = ''
const inputMsg = meow(`
	Usage
	  $ gfwadd <input>

	Options
	  --all, -a  match all domain
	  --reload, -r auto reload current chrome tab

	Examples
	  $ gfwadd http://janeluck.github.io -a
	    push *.github.io to rules
	  $ gfwadd http://janeluck.github.io 
	    push  http://janeluck.github.io to rules
	  $ gfwadd
	    push clipboard url to rules
`, {
    flags: {
        all: {
            type: 'boolean',
            alias: 'a'
        },
        reload: {
            type: 'boolean',
            alias: 'r'
        },
        allreload: {
            type: 'boolean',
            alias: 'ar'
        }
    }
})

const argUrl = inputMsg.input[0]

// 先从命令行提取url
if (argUrl) {
    url = argUrl.match(r)[0]
} else {
    try {
        // 从剪贴板中获得url
        url = clipboardy.readSync().match(r)[0]
    } catch (e) {
        console.error(`${chalk.red('✘')}  Error: 剪贴板中没有合法的url`)
        return
    }
}


if (inputMsg.flags.a || inputMsg.flags.ar) {
    url = url.replace(/https?:\/\/[^\\.]+/, '*')
}

// 可能会出现*.com的情况, return

if (/\*\.[a-zA-Z]+$/.test(url)) {
    console.error(`${chalk.red('✘')}  Error: 不能添加${url}, 请不要使用-a`)
    return
}


// 处理成sed命令所需要的格式
const sedUrl = '\\"' + url + '\\"'
// 向gfwlist.js的rules添加网址
exec(`sed -i "" "6 a\\ \n  ${sedUrl},\n"       ~/.ShadowsocksX/gfwlist.js`, (error, stdout, stderr) => {
    if (error) {
        console.error(`${chalk.red('✘')}  Error: ${error}`)
        return;
    } else {
        console.log(`${chalk.green('✔')}  Success:  ${url}添加成功`)
    }
    // 重启ShadowsocksX
    exec(`osascript -e 'quit app "ShadowsocksX"'  && sleep 1 &&  open -a 'ShadowsocksX'`, (error, stdout, stderr) => {
        console.log(stdout)
        if (error) {
            console.error(`${chalk.red('✘')}  Error: ${error}`)
            return
        } else {
            console.log(`${chalk.green('✔')}  ShadowsocksX已经重启`)


            // 自动刷新浏览器页面
            if (inputMsg.flags.r || inputMsg.flags.ar) {
                exec(`osascript -e 'tell application "Google Chrome" to tell the active tab of its first window to reload'`, (error, stdout, stderr) => {

                    if (error) {
                        console.error(`${chalk.red('✘')}  Error: ${error}`)
                        return
                    } else {
                        console.log(`${chalk.green('✔')}  Chrome页面已经刷新`)
                    }
                })
            }


        }
    })
})
