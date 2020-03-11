/**
 * 将代码中不再引用的图标生成可视化界面
 */

const fs = require("fs");

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
    const data = await readFile("./private-sign@4.2-iconfont-unused.json"); // 读取不再使用的icon
    fileDataMap = JSON.parse(data.toString());

    let htmlContent = "";
    let iconHtml = "";

    fileDataMap.map((icon, index) => {
        iconHtml += `
            <li class="dib">
                <span class="icon iconfont ${icon}"></span>
                <div class="code-name">${icon}</div>
            </li>
        \n`;
    });

    htmlContent = `<ul class="icon_lists dib-box">
                        ${iconHtml}
                    </ul>`;

    // 将图标列表html写入文件
    fs.writeFile("./private-sign@4.2-iconfont-unused.html", htmlContent, "utf8", err => {
        if (err) return console.log(err);

        if (!err) {
            console.log("写入成功！");
        }
    });
})();
