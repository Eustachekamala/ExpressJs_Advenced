import { Router } from "express";
import usersRouter from './usersRouter.mjs';
import productsRouter from './productsRouter.mjs';
import usersMongodb from './usersMongodb.mjs';

const router = Router();

router.use(usersRouter)
router.use(productsRouter)
router.use(usersMongodb)

export default router;