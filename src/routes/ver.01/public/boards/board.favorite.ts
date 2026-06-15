import express from 'express';

import { IResult } from '../../../../libs/interface/result.interface.js';
import boardFavoriteControllers from '../../../../controllers/boards/board.favorite.js';

const router = express.Router();


router.get('/', async (req, res) => {
  let sParams = {
    page: req.query?.page ? parseInt(req.query.page.toString()) : 1,
    pageRow: req.query?.pageRow ? parseInt(req.query.pageRow.toString()) : 10,
    sr: req.query?.sr ? parseInt(req.query.sr.toString()) : 0,
    srTxt: req.query?.srTxt ? req.query.srTxt.toString() : "",
    srBeginDate: req.query?.srBeginDate ? req.query.srBeginDate.toString() : "",
    srEndDate: req.query?.srEndDate ? req.query.srEndDate.toString() : "",
  }

  let board_id = req.query?.board_id ? parseInt(req.query.board_id.toString()) : "";
  if(board_id) {
    sParams.sr = 1;
    sParams.srTxt = board_id.toString();
  }

  const result: IResult = await boardFavoriteControllers.acList(sParams);
  res.status(200).send(result);
});

export default router;