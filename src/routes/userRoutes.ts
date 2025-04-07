import express, { Router, RequestHandler } from 'express';
import * as userController from '../controllers/userController';

const router: Router = express.Router();

router.get('/', userController.getAllUsers as unknown as RequestHandler);
router.get('/:id', userController.getUserById as unknown as RequestHandler);
router.post('/', userController.createUser as unknown as RequestHandler);
router.put('/:id', userController.updateUser as unknown as RequestHandler);
router.delete('/:id', userController.deleteUser as unknown as RequestHandler);

export default router;
