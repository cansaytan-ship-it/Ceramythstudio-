import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductValidation,
} from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@ceramythstudio/shared';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, authorize(UserRole.ADMIN), createProductValidation, createProduct);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), updateProduct);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteProduct);

export default router;
