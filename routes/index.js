var express = require('express');
var router = express.Router();
const ImageController = require('../controllers/image.controller');


// // const path = 'public/images/input.jpeg';
// // const path = 'public/images/input2.jpeg';
// // const path = 'public/images/input.jpeg';
// const path = 'public/images/input2.jpeg';
// // const data = 'eyJoZWlnaHQiOjY3NCwid2lkdGgiOjkzNCwibGVmdCI6LTI4MSwidG9wIjotMTYyLCJtaW5ab29tIjoxMzguNDk1MzU5MDYyMDQyLCJjdXJyZW50U2l6ZSI6Mjg0fQ==';
// // const data = 'eyJoZWlnaHQiOjE0MjAsIndpZHRoIjoxMDI1LCJsZWZ0IjotNTM5LCJ0b3AiOi00MjYsIm1pblpvb20iOjEzOC40OTUzNTkwNjIwNDIsImN1cnJlbnRTaXplIjoyODR9';
// // const data = 'eyJoZWlnaHQiOjIzNiwid2lkdGgiOjMyNywibGVmdCI6LTEsInRvcCI6NDgsIm1pblpvb20iOjEzOC40OTUzNTkwNjIwNDIsImN1cnJlbnRTaXplIjoyODR9';
// // const data = 'eyJoZWlnaHQiOjI5MCwid2lkdGgiOjIwOSwibGVmdCI6MCwidG9wIjowLCJtaW5ab29tIjoxMzguNDk1MzU5MDYyMDQyLCJjdXJyZW50U2l6ZSI6Mjg0fQ==';
// const data = 'eyJ3aWR0aCI6MjY0LCJoZWlnaHQiOjM2NiwiY3VycmVudFNpemUiOjI4NCwibGVmdCI6MTEsInRvcCI6LTIyfQ==';
// new ImageController(path).crop(data, 1024);

/* GET home page. */
router.post('/api/crop', async function (req, res, next) {
    const pathInput = req.body.pathInput;
    const pathOutput = req.body.pathOutput;
    const cropData = req.body.cropData;
    const sizeOutput = req.body.sizeOutput;
    console.log({
        pathInput, pathOutput, cropData, sizeOutput
    });
    const imageController = new ImageController(pathInput, pathOutput);
    const result = await imageController.crop(cropData, sizeOutput).catch(err => {
        console.log(err);
        return null;
    });
    res.send({
        success: !!result
    });
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
