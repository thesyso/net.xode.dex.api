import express from "express";
import boardHitController from "../../../../controllers/boards/board.hit";

const router = express.Router();

router.get('/', async (req, res) => {
    let sParams: any = {
        page: req.query?.page ? parseInt(req.query.page.toString()) : 1,
        pageRow: req.query?.pageRow ? parseInt(req.query.pageRow.toString()) : 10,
        sr: req.query?.sr ? parseInt(req.query.sr.toString()) : 0,
        srTxt: req.query?.srTxt ? req.query.srTxt.toString() : "",
        srBeginDate: req.query?.srBeginDate ? req.query.srBeginDate.toString() : "",
        srEndDate: req.query?.srEndDate ? req.query.srEndDate.toString() : "",
    };

    const boardId = req.query?.boardId ? parseInt(req.query.boardId.toString()) : 0;
    if (boardId) {
        sParams.sr = 1;
        sParams.srTxt = boardId.toString();
    }

    const { success, data, message, count } = await boardHitController.acList(sParams);
    res.status(200).json({ success, data, message, count });
});

router.get('/:hitId', async (req, res) => {
    const hitId = parseInt(req.params.hitId);
    const { success, data, message, count } = await boardHitController.acDetail(hitId);
    res.status(200).json({ success, data, message, count });
});

router.post('/', async (req, res) => {
    const sParams = {
        board_id: req.body.boardId,
        wallet_id: req.body.walletId,
    };

    const { success, data, message, count } = await boardHitController.acSave(sParams);
    res.status(200).json({ success, data, message, count });
});

router.delete('/:hitId', async (req, res) => {
    const hitId = parseInt(req.params.hitId);
    const { success, data, message, count } = await boardHitController.acRemove(hitId);
    res.status(200).json({ success, data, message, count });
});

export default router;