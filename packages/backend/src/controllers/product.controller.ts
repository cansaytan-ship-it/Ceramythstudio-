import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { CreateProductDTO, ProductCategory } from '@ceramythstudio/shared';

export const getAllProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, featured, page = 1, limit = 20 } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (featured === 'true') {
      query += ' AND featured = true';
    }

    query += ' ORDER BY created_at DESC';

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limitNum);

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM products WHERE 1=1';
    const countParams: any[] = [];
    let countParamCount = 0;

    if (category) {
      countParamCount++;
      countQuery += ` AND category = $${countParamCount}`;
      countParams.push(category);
    }

    if (featured === 'true') {
      countQuery += ' AND featured = true';
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        data: result.rows.map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description,
          price: parseFloat(row.price),
          category: row.category,
          imageUrl: row.image_url,
          stock: row.stock,
          featured: row.featured,
          createdAt: row.created_at,
        })),
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, error: 'Error fetching products' });
  }
};

export const getProductById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        id: row.id,
        name: row.name,
        description: row.description,
        price: parseFloat(row.price),
        category: row.category,
        imageUrl: row.image_url,
        stock: row.stock,
        featured: row.featured,
        createdAt: row.created_at,
      },
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, error: 'Error fetching product' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { name, description, price, category, imageUrl, stock, featured }: CreateProductDTO =
      req.body;

    const result = await pool.query(
      'INSERT INTO products (name, description, price, category, image_url, stock, featured) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, price, category, imageUrl, stock, featured || false]
    );

    const row = result.rows[0];
    res.status(201).json({
      success: true,
      data: {
        id: row.id,
        name: row.name,
        description: row.description,
        price: parseFloat(row.price),
        category: row.category,
        imageUrl: row.image_url,
        stock: row.stock,
        featured: row.featured,
        createdAt: row.created_at,
      },
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, error: 'Error creating product' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    Object.keys(updates).forEach((key) => {
      paramCount++;
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      fields.push(`${dbKey} = $${paramCount}`);
      values.push(updates[key]);
    });

    if (fields.length === 0) {
      res.status(400).json({ success: false, error: 'No fields to update' });
      return;
    }

    paramCount++;
    values.push(id);

    const query = `UPDATE products SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        id: row.id,
        name: row.name,
        description: row.description,
        price: parseFloat(row.price),
        category: row.category,
        imageUrl: row.image_url,
        stock: row.stock,
        featured: row.featured,
        createdAt: row.created_at,
      },
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, error: 'Error updating product' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, error: 'Error deleting product' });
  }
};

export const createProductValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category')
    .isIn(Object.values(ProductCategory))
    .withMessage('Invalid category'),
  body('imageUrl').isURL().withMessage('Invalid image URL'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];
