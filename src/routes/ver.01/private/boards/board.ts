import express from "express";
import boardController from "../../../../controllers/boards/board";

const router = express.Router();

router.get('/', async (req, res) => {
    let sParams = {
        page: req.query?.page ? parseInt(req.query.page.toString()) : 1,
        pageRow: req.query?.pageRow ? parseInt(req.query.pageRow.toString()) : 10,
        sr: req.query?.sr ? parseInt(req.query.sr.toString()) : 0,
        srTxt: req.query?.srTxt ? req.query.srTxt.toString() : "",
        srBeginDate: req.query?.srBeginDate ? req.query.srBeginDate.toString() : "",
        srEndDate: req.query?.srEndDate ? req.query.srEndDate.toString() : "",
        cago: req.query?.cago ? req.query.cago.toString() : "",
        srStatus: req.query?.srStatus ? req.query.srStatus.toString() : "1",
        srUsed: req.query?.srUsed ? req.query.srUsed.toString() : "",
    };

    const { success, data, message, count } = await boardController.acList(sParams);
    res.status(200).json({ success, data, message, count });
});

router.get('/:boardId', async (req, res) => {
    const boardId = parseInt(req.params.boardId);
    const { success, data, message, count } = await boardController.acDetail(boardId);
    res.status(200).json({ success, data, message, count });
});

router.post('/', async (req, res) => {
    let sParams = {
        cago: req.body.cago,
        depth: req.body.depth ?? 0,
        status: req.body.status ?? 1,
        writer: req.body.writer,
        subject: req.body.subject,
        contents: req.body.contents,
        user_id: req.body.userId ?? null,
        wallet_id: req.body.walletId,
        images: Array.isArray(req.body.images) ? req.body.images : [],
        files: Array.isArray(req.body.files) ? req.body.files : [],
    };

    const { success, data, message, count } = await boardController.acSave(sParams);
    res.status(200).json({ success, data, message, count });
});

router.put('/:boardId', async (req, res) => {
    const boardData = req.body;

    let sParams = {
        board_id: parseInt(req.params.boardId),
        subject: boardData.subject,
        contents: boardData.contents,
    };

    const { success, data, message, count } = await boardController.acChange(sParams);
    res.status(200).json({ success, data, message, count });
});

router.delete('/:boardId', async (req, res) => {
    const boardId = parseInt(req.params.boardId);
    const { success, data, message, count } = await boardController.acRemove(boardId);
    res.status(200).json({ success, data, message, count });
});

export default router;