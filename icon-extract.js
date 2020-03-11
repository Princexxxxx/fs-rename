/**
 * 提取代码中iconfont引用
 */

const fs = require('fs');
const path = require('path');
let filePath = process.argv[2]; // 获取输入的参数
let iconResult = [];

const iconReg = /['"#\s]{1}icon-[a-zA-Z0-9-]+/g; // private-sign ali iconfont
// const iconReg = /[.]{1}icon-[a-zA-Z0-9-]+/g; // ali iconfont 269
// const iconReg = /el-icon-[a-z0-9]+(-[a-z0-9]+)?/g; // el-icon

// 执行
readDir(filePath);

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function readDir(filePath) {
    // 根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, (err, files) => {
        if (err) {
            console.warn(err);
        } else {
            // 遍历读取到的文件列表
            files.map(filename => {
                // 获取当前文件的绝对路径
                const fileDir = path.join(filePath, filename);

                // 根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(fileDir, (error, stats) => {
                    if (error) {
                        console.warn('获取文件stats失败');
                    } else {
                        const isFile = stats.isFile(); // 是文件
                        const isDir = stats.isDirectory(); // 是文件夹

                        if (isFile) {
                            (async function () {
                                let fileData = await readFile(fileDir);
                                fileData = fileData.toString();
                                let icons = fileData.match(iconReg);

                                if(icons) {
                                    icons = icons.map(item => {
                                        return item.replace(/'/g, '').replace(/"/g, '').replace(/#/g, '').replace(/\s/g, '');
                                    })

                                    iconResult = [...iconResult, ...icons];
                                }

                                iconResult = [...new Set(iconResult)];

                                // 更新file
                                fs.writeFile('./iconfont.json', JSON.stringify(iconResult), 'utf8', (err) => {
                                    if (err) return console.log(err);

                                    if(!err) {
                                        console.log(fileDir + '写入成功！');
                                    }
                                });
                            })();
                        }
                        if (isDir) {
                            if(!fileDir.includes('/assets')) {
                                readDir(fileDir); // 递归，如果是文件夹就继续遍历
                            }
                        }
                    }
                })
            });
        }
    });
}

/**
 * 异步读取文件方法
 * @param {fileName} fileName
 */
const readFile = function (fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (error, data) => {
            if (error) return reject(error);

            resolve(data);
        });
    });
};

// 附录：
// 网页抓取iconfont List
// var iconList = document.querySelectorAll('.block-icon-list li>.icon-code-show');
// var icons = Array.from(iconList).map(node => node.innerText);
// var iconStr = JSON.stringify(icons);