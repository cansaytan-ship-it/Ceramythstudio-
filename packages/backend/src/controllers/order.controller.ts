import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { CreateOrderDTO, OrderStatus } from '@ceramythstudio/shared';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await pool.connect();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const userId = req.user?.id;
    const { items, shippingAddress }: CreateOrderDTO = req.body;

    await client.query('BEGIN');

    // Calculate total and validate stock
    let total = 0;
    for (const item of items) {
      const productResult = await client.query('SELECT * FROM products WHERE id = $1', [
        item.productId,
      ]);

      if (productResult.rows.length === 0) {
        await client.query('ROLLBACK');
        res.status(404).json({ success: false, error: `Product ${item.productId} not found` });
        return;
      }

      const product = productResult.rows[0];

      if (product.stock < item.quantity) {
        await client.query('ROLLBACK');
        res.status(400).json({
          success: false,
          error: `Insufficient stock for product ${product.name}`,
        });
        return;
      }

      total += parseFloat(product.price) * item.quantity;
    }

    // Create order
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total, status, shipping_address) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, total, OrderStatus.PENDING, JSON.stringify(shippingAddress)]
    );

    const order = orderResult.rows[0];

    // Create order items and update stock
    for (const item of items) {
      const productResult = await client.query('SELECT * FROM products WHERE id = $1', [
        item.productId,
      ]);
      const product = productResult.rows[0];

      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.productId, item.quantity, product.price]
      );

      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [
        item.quantity,
        item.productId,
      ]);
    }

    // Clear cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      data: {
        id: order.id,
        total: parseFloat(order.total),
        status: order.status,
        createdAt: order.created_at,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ success: false, error: 'Error creating order' });
  } finally {
    client.release();
  }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limitNum, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM orders WHERE user_id = $1', [
      userId,
    ]);
    const total = parseInt(countResult.rows[0].count);

    const orders = await Promise.all(
      result.rows.map(async (order) => {
        const itemsResult = await pool.query(
          `SELECT oi.*, p.name, p.image_url 
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = $1`,
          [order.id]
        );

        return {
          id: order.id,
          total: parseFloat(order.total),
          status: order.status,
          shippingAddress: order.shipping_address,
          items: itemsResult.rows.map((item) => ({
            id: item.id,
            productId: item.product_id,
            quantity: item.quantity,
            price: parseFloat(item.price),
            product: {
              name: item.name,
              imageUrl: item.image_url,
            },
          })),
          createdAt: order.created_at,
        };
      })
    );

    res.json({
      success: true,
      data: {
        data: orders,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, error: 'Error fetching orders' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [
      id,
      userId,
    ]);

    if (orderResult.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      `SELECT oi.*, p.name, p.image_url 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [order.id]
    );

    res.json({
      success: true,
      data: {
        id: order.id,
        total: parseFloat(order.total),
        status: order.status,
        shippingAddress: order.shipping_address,
        items: itemsResult.rows.map((item) => ({
          id: item.id,
          productId: item.product_id,
          quantity: item.quantity,
          price: parseFloat(item.price),
          product: {
            name: item.name,
            imageUrl: item.image_url,
          },
        })),
        createdAt: order.created_at,
      },
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, error: 'Error fetching order' });
  }
};

export const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('items.*.productId').isUUID().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.street').notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.country').notEmpty().withMessage('Country is required'),
];
