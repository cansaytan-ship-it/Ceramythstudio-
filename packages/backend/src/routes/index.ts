import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

export default router;
