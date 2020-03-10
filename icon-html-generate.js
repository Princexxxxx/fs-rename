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
    const data = await readFile("./icon.json");
    fileDataMap = JSON.parse(data.toString());

    let htmlContent = "";
    let iconHtml = "";

    fileDataMap.map((icon, index) => {
        iconHtml += `
            <p>
                <a>[${++index}] ${icon} : </a>
                <i class="${icon}"></i>
            </p>
        \n`;
    });

    htmlContent = `<!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <meta http-equiv="X-UA-Compatible" content="ie=edge">
                            <title>Document</title>
                            <link rel="stylesheet" href="https://unpkg.com/element-ui@2.11.0/lib/theme-chalk/index.css">

                            <style>
                                .container a {
                                    display: inline-block;
                                    width: 240px;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                ${iconHtml}
                            </div>
                        </body>
                    </html>`;

    fs.writeFile("./private-sign@4.2-icon.html", htmlContent, "utf8", err => {
        if (err) return console.log(err);

        if (!err) {
            console.log("写入成功！");
        }
    });
})();
