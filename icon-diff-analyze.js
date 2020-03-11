/**
 * 分析代码中不在引用的图标
 */

const fs = require('fs');

const readFile = function(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (error, data) => {
            if (error) return reject(error);

            resolve(data);
        });
    });
};

// 读取文件名键值对
(async function() {
    const data1 = await readFile('./iconfont.json');
    qysIconList = JSON.parse(data1.toString());

    const data2 = await readFile('./ali-iconfont.json');
    aliIconList = JSON.parse(data2.toString());

    // 筛选出代码中未引用的图标
    const result = aliIconList.filter(aliIcon => !qysIconList.includes(aliIcon));

    fs.writeFile('./private-sign@4.2-iconfont-unused.json', JSON.stringify(result), 'utf8', err => {
        if (err) return console.log(err);

        if (!err) {
            console.log('写入成功！');
        }
    });
})();
