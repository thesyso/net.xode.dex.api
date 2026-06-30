import express from "express";
import assetController from "../../../../controllers/assets/asset";

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

    const { success, data, message, count } = await assetController.acList(sParams);
    res.status(200).json({ success, data, message, count });
});

router.get('/:assetId/:assetNode', async (req, res) => {
    const assetId = req.params.assetId;
    const assetNode = req.params.assetNode;

    const { success, data, message, count } = await assetController.acDetail(assetId, assetNode);
    res.status(200).json({ success, data, message, count });
});

router.post('/', async (req, res) => {
    let sParams = {
        asset_id: req.body.assetId,
        asset_node: req.body.assetNode,
        asset_name: req.body.assetName,
        asset_symbol: req.body.assetSymbol,
        asset_status: req.body.assetStatus,
        asset_decimal: req.body.assetDecimal,
    };

    const { success, data, message, count } = await assetController.acSave(sParams);
    res.status(200).json({ success, data, message, count });
});

router.put('/:assetId/:assetNode', async (req, res) => {
    let sParams = {
        asset_id: req.params.assetId,
        asset_node: req.params.assetNode,
        asset_name: req.body.assetName,
        asset_symbol: req.body.assetSymbol,
        asset_decimal: req.body.assetDecimal,
    };

    const { success, data, message, count } = await assetController.acChange(sParams);
    res.status(200).json({ success, data, message, count });
});

router.patch('/:assetId/:assetNode/status', async (req, res) => {
    let sParams = {
        asset_id: req.params.assetId,
        asset_node: req.params.assetNode,
        asset_status: req.body.assetStatus,
    };

    const { success, data, message, count } = await assetController.acPatchStatus(sParams);
    res.status(200).json({ success, data, message, count });
});

router.delete('/:assetId/:assetNode', async (req, res) => {
    const assetId = req.params.assetId;
    const assetNode = req.params.assetNode;

    const { success, data, message, count } = await assetController.acRemove(assetId, assetNode);
    res.status(200).json({ success, data, message, count });
});

export default router;