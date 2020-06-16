var express = require('express');
var router = express.Router();
const ImageController = require('../controllers/image.controller');
const download = require('download');
const fs = require('fs');

/* GET home page. */
router.post('/api/crop', async function (req, res, next) {
    let url = req.body.pathInput;
    const id = (new Date()).getTime();
    const pathOutput = 'public/images/output_' + id + '.jpeg';
    const pathInput = 'public/images/input_.' + id + url.split('.')[url.split('.').length - 1];

    fs.writeFileSync(pathInput, await download(url));

    const cropData = req.body.cropData;
    const sizeOutput = req.body.sizeOutput;
    const imageController = new ImageController(pathInput, pathOutput);
    const result = await imageController.crop(cropData, sizeOutput).catch(err => {
        console.log(err);
        return null;
    });
    fs.unlinkSync(pathInput);
    res.send({
        path: 'https://learn-call.herokuapp.com/images/output_' + id + '.jpeg',
        success: !!result
    });
});

router.get('/api/delete', function () {
    let url = req.query.url;
    const id = url.replace('https://learn-call.herokuapp.com/images/output_', '').replace('.jpeg', '');
    const pathOutput = 'public/images/output_' + id + '.jpeg';
    fs.unlinkSync(pathOutput);
});

router.post('/api/resize', async function (req, res, next) {
    const pathInput = req.body.pathInput;
    const pathOutput = req.body.pathOutput;
    const sizeOutput = req.body.sizeOutput;
    const imageController = new ImageController(pathInput, pathOutput);
    const result = await imageController.resize(sizeOutput).catch(err => {
        console.log(err);
        return null;
    });
    res.send({
        success: !!result
    });
});

module.exports = router;
