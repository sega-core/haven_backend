import { Router } from 'express';
import { deleteUser, updateUser } from '../controllers/user.controller';

const router = Router();

router.delete('/user/delete', deleteUser);
router.put('/user/update', updateUser);

export default router;
