import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  createOrderValidation,
} from '../controllers/order.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createOrderValidation, createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

export default router;
