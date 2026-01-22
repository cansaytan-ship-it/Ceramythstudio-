import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(
      `SELECT ci.id, ci.product_id, ci.quantity, 
              p.name, p.price, p.image_url, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [userId]
    );

    const items = result.rows.map((row) => ({
      id: row.id,
      productId: row.product_id,
      quantity: row.quantity,
      product: {
        name: row.name,
        price: parseFloat(row.price),
        imageUrl: row.image_url,
        stock: row.stock,
      },
    }));

    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.json({
      success: true,
      data: {
        items,
        total,
      },
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, error: 'Error fetching cart' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const userId = req.user?.id;
    const { productId, quantity } = req.body;

    // Check if product exists and has enough stock
    const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);

    if (productResult.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    const product = productResult.rows[0];

    if (product.stock < quantity) {
      res.status(400).json({ success: false, error: 'Insufficient stock' });
      return;
    }

    // Check if item already in cart
    const existingItem = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    let result;
    if (existingItem.rows.length > 0) {
      // Update quantity
      result = await pool.query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [quantity, userId, productId]
      );
    } else {
      // Insert new item
      result = await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [userId, productId, quantity]
      );
    }

    res.json({
      success: true,
      data: {
        id: result.rows[0].id,
        productId: result.rows[0].product_id,
        quantity: result.rows[0].quantity,
      },
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, error: 'Error adding to cart' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.id;

    if (quantity <= 0) {
      res.status(400).json({ success: false, error: 'Quantity must be positive' });
      return;
    }

    const result = await pool.query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [quantity, id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Cart item not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        id: result.rows[0].id,
        quantity: result.rows[0].quantity,
      },
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ success: false, error: 'Error updating cart item' });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const result = await pool.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Cart item not found' });
      return;
    }

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, error: 'Error removing from cart' });
  }
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, error: 'Error clearing cart' });
  }
};

export const addToCartValidation = [
  body('productId').isUUID().withMessage('Invalid product ID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];
