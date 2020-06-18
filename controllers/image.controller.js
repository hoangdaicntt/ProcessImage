const sharp = require('sharp');

module.exports = class ImageController {
    constructor(pathInput, pathOutput) {
        this.pathInput = pathInput;
        this.pathOutput = pathOutput;
    }

    crop(data, size) {
        return new Promise(async (resolve, reject) => {
            try {
                const dataString = new Buffer.from(data, 'base64').toString('utf8');
                const dataCropInput = JSON.parse(dataString);
                let imageInput = sharp(this.pathInput);
                const zoom = dataCropInput.currentSize / size;
                const dataCrop = {};
                dataCrop.width = Math.round(dataCropInput.width / zoom);
                dataCrop.height = Math.round(dataCropInput.height / zoom);
                dataCrop.top = Math.abs(Math.round(dataCropInput.top / zoom));
                dataCrop.left = Math.abs(Math.round(dataCropInput.left / zoom));
                // Chuyển về kích thước cắt
                const imageInputResize = await imageInput.resize({
                    width: dataCrop.width,
                    height: dataCrop.height
                }).toBuffer();
                let imageInputBuffer = imageInputResize;
                // Đệm ảnh
                if (dataCrop.width > dataCrop.height) {
                    imageInputBuffer = await sharp(imageInputBuffer).extend({
                        top: 0,
                        bottom: dataCrop.height * 2,
                        right: 0,
                        left: 0,
                        background: {r: 255, g: 255, b: 255, alpha: 1}
                    }).toBuffer();
                }
                if (dataCrop.width < dataCrop.height) {
                    imageInputBuffer = await sharp(imageInputBuffer).extend({
                        top: 0,
                        bottom: 0,
                        right: dataCrop.width * 2,
                        left: 0,
                        background: {r: 255, g: 255, b: 255, alpha: 1}
                    }).toBuffer();
                }
                // Nâng kích thước ảnh nếu là cắt trắng
                if (dataCropInput.top > 0) {
                    imageInputBuffer = await sharp(imageInputBuffer).extend({
                        top: dataCrop.top * 2,
                        bottom: 0,
                        right: 0,
                        left: 0,
                        background: {r: 255, g: 255, b: 255, alpha: 1}
                    }).toBuffer();
                }
                if (dataCropInput.left > 0) {
                    imageInputBuffer = await sharp(imageInputBuffer).extend({
                        left: dataCrop.left * 2,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: {r: 255, g: 255, b: 255, alpha: 1}
                    }).toBuffer();
                }

                const imageInputExtract = await sharp(imageInputBuffer).extract({
                    width: size,
                    height: size,
                    top: dataCrop.top,
                    left: dataCrop.left
                }).toBuffer();

                const imageInputExtractBorder = await sharp(imageInputExtract).extend({
                    left: 1,
                    right: 1,
                    top: 1,
                    bottom: 1,
                    background: {r: 254, g: 230, b: 243, alpha: 0}
                }).toBuffer();

                sharp(imageInputExtractBorder).toFile(this.pathOutput, (err, info) => {
                    if (!err) {
                        resolve(true);
                    } else {
                        reject(err);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    resize(size) {
        return new Promise(async (resolve, reject) => {
            try {
                let imageInput = sharp(this.pathInput);
                const imageInputResized = await imageInput.resize({width: size, fil: 'inside'}).toBuffer();
                sharp(imageInputResized).toFile(this.pathOutput, (err, info) => {
                    if (!err) {
                        resolve(true);
                    } else {
                        reject(err);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }
};


