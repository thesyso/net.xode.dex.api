import express from "express";
import boardFileController from "../../../../controllers/boards/board.file";

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

    const { success, data, message, count } = await boardFileController.acList(sParams);
    res.status(200).json({ success, data, message, count });
});

router.get('/:fileId', async (req, res) => {
    const fileId = parseInt(req.params.fileId);
    const { success, data, message, count } = await boardFileController.acDetail(fileId);
    res.status(200).json({ success, data, message, count });
});

router.post('/', async (req, res) => {
    const sParams = {
        board_id: req.body.boardId,
        file_name: req.body.fileName,
        origin_name: req.body.originName,
    };

    const { success, data, message, count } = await boardFileController.acSave(sParams);
    res.status(200).json({ success, data, message, count });
});

router.delete('/:fileId', async (req, res) => {
    const fileId = parseInt(req.params.fileId);
    const { success, data, message, count } = await boardFileController.acRemove(fileId);
    res.status(200).json({ success, data, message, count });
});

export default router;