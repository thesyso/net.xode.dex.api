import express from "express";
import boardFavoriteController from "../../../../controllers/boards/board.favorite";

const router = express.Router();

router.get('/', async (req, res) => {
    let sParams: any = {
        page: req.query?.page ? parseInt(req.query.page.toString()) : 1,
        pageRow: req.query?.pageRow ? parseInt(req.query.pageRow.toString()) : 10,
        sr: req.query?.sr ? parseInt(req.query.sr.toString()) : 0,
        srTxt: req.query?.srTxt ? req.query.srTxt.toString() : "",
        srBeginDate: req.query?.srBeginDate ? req.query.srBeginDate.toString() : "",
        srEndDate: req.query?.srEndDate ? req.query.srEndDate.toString() : "",
        srUsed: req.query?.srUsed ? req.query.srUsed.toString() : "",
    };

    const boardId = req.query?.boardId ? parseInt(req.query.boardId.toString()) : 0;
    if (boardId) {
        sParams.sr = 1;
        sParams.srTxt = boardId.toString();
    }

    const { success, data, message, count } = await boardFavoriteController.acList(sParams);
    res.status(200).json({ success, data, message, count });
});

router.get('/:favoriteId', async (req, res) => {
    const favoriteId = parseInt(req.params.favoriteId);
    const { success, data, message, count } = await boardFavoriteController.acDetail(favoriteId);
    res.status(200).json({ success, data, message, count });
});

router.post('/', async (req, res) => {
    const sParams = {
        board_id: req.body.boardId,
        wallet_id: req.body.walletId,
    };

    const { success, data, message, count } = await boardFavoriteController.acSave(sParams);
    res.status(200).json({ success, data, message, count });
});

router.delete('/:favoriteId', async (req, res) => {
    const favoriteId = parseInt(req.params.favoriteId);
    const { success, data, message, count } = await boardFavoriteController.acRemove(favoriteId);
    res.status(200).json({ success, data, message, count });
});

export default router;