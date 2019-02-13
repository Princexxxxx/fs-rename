const fs = require('fs');
const path = require('path');

let filePath = process.argv[2]; // 获取输入的参数
let fileObj = {};

// 执行
readFile(filePath);

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function readFile(filePath) {
    // 根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, (err, files) => {
        if (err) {
            console.warn(err);
        } else {
            // 遍历读取到的文件列表
            files.map(filename => {
                // 获取当前文件的绝对路径
                const filedir = path.join(filePath, filename);

                // 根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir, (error, stats) => {
                    if (error) {
                        console.warn('获取文件stats失败');
                    } else {
                        const isFile = stats.isFile(); // 是文件
                        const isDir = stats.isDirectory(); // 是文件夹
                        const isVue = filedir.split('.')[1] === 'vue'; // vue文件
                        const isCamelFile = checkCamelFile(filedir); // 驼峰文件

                        if (isFile) {
                            if(isVue && isCamelFile) {
                                // 写入file
                                writeFile(filename);

                                // 修改文件名
                                replaceName(filePath, filename);
                            }
                        }
                        if (isDir) {
                            if(!filedir.includes('/assets')) {
                                readFile(filedir); // 递归，如果是文件夹就继续遍历
                            }
                        }
                    }
                })
            });
        }
    });
}

/**
 * 检测驼峰文件名
 * @param fileName 文件名
 */
function checkCamelFile(fileName) {
    return /([a-z])([A-Z])/.test(fileName) || /([A-Z])/.test(fileName);
}

/**
 * 重命名文件 CamelCase || PascalCase => kebab-case
 * @param filePath 文件相对路径
 * @param fileName 文件名
 */
function replaceName(filePath, filename) {
    const oldPath = filePath + '/' + filename;
    const newPath = filePath + '/' + filename.toKebabCase();

    fs.rename(oldPath, newPath, err => {
        if (err) {
            console.warn(err)
        }

        if (!err) {
            console.log(filename + ' is done');
        }
    });
}

/**
 * 将修改的文件数据写入file
 * @param fileName 文件名
 */
function writeFile(filename) {
    const newFileName = filename.toKebabCase();
    fileObj[filename] = newFileName;

    fs.writeFile('./data.json', JSON.stringify(fileObj), 'utf8', err => {
        if(err) {
            console.warn(err);
        }
    });
}

String.prototype.toKebabCase = function() {
    const regex = /[A-Z]/g;

	return fistLetterLower(this).replace(regex, word => {
		return '-' + word.toLowerCase();
	});
}

/**
 * 将单个字符串的首字母小写
 * @param str 字符串
 */
function fistLetterLower (str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
};