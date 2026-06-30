import express from "express";
import boardImageController from "../../../../controllers/boards/board.image";

const router = express.Router();

router.get('/', async (req, res) => {
    let sParams = {
        page: req.query?.page ? parseInt(req.query.page.toString()) : 1,
        pageRow: req.query?.pageRow ? parseInt(req.query.pageRow.toString()) : 10,
        sr: req.query?.sr ? parseInt(req.query.sr.toString()) : 0,
        srTxt: req.query?.srTxt ? req.query.srTxt.toString() : "",
        srBeginDate: req.query?.srBeginDate ? req.query.srBeginDate.toString() : "",
        srEndDate: req.query?.srEndDate ? req.query.srEndDate.toString() : "",
        srUsed: req.query?.srUsed ? req.query.srUsed.toString() : "",
    };

    const { success, data, message, count } = await boardImageController.acList(sParams);
    res.status(200).json({ success, data, message, count });
});

router.get('/:imageId', async (req, res) => {
    const imageId = parseInt(req.params.imageId);
    const { success, data, message, count } = await boardImageController.acDetail(imageId);
    res.status(200).json({ success, data, message, count });
});

router.post('/', async (req, res) => {
    const sParams = {
        board_id: req.body.boardId,
        image_name: req.body.imageName,
        origin_name: req.body.originName,
    };

    const { success, data, message, count } = await boardImageController.acSave(sParams);
    res.status(200).json({ success, data, message, count });
});

router.delete('/:imageId', async (req, res) => {
    const imageId = parseInt(req.params.imageId);
    const { success, data, message, count } = await boardImageController.acRemove(imageId);
    res.status(200).json({ success, data, message, count });
});

export default router;