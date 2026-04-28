import { Router } from 'express';
import { deleteUser } from '../controllers/user.controller';

const router = Router();

router.delete('/user/delete', deleteUser);

export default router;
