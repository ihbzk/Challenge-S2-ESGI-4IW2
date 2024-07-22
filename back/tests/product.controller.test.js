import { describe, it, expect, vi } from 'vitest';
import * as productController from '../src/controllers/product.controller';
import Product from '../src/models/product.model';
import Category from '../src/models/category.model';
import Brand from '../src/models/brand.model';

vi.mock('../src/models/product.model');
vi.mock('../src/models/category.model');
vi.mock('../src/models/brand.model');

describe('Product Controller', () => {
    it('should create a product', async () => {
        const req = { body: { name: 'Test Product' } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        Product.create.mockResolvedValue(req.body);

        await productController.createProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('should get all products', async () => {
        const req = {};
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const products = [{ name: 'Product1' }, { name: 'Product2' }];
        Product.findAll.mockResolvedValue(products);

        await productController.getAllProducts(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(products);
    });

    it('should get a product by id', async () => {
        const req = { params: { id: 1 } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const product = { name: 'Test Product' };
        Product.findByPk.mockResolvedValue(product);

        await productController.getProductById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(product);
    });

    it('should update a product by id', async () => {
        const req = { params: { id: 1 }, body: { name: 'Updated Product' } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const product = { update: vi.fn() };
        Product.findByPk.mockResolvedValue(product);

        await productController.updateProductById(req, res);

        expect(product.update).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(product);
    });

    it('should delete a product by id', async () => {
        const req = { params: { id: 1 } };
        const res = { status: vi.fn().mockReturnThis(), end: vi.fn() };

        const product = { destroy: vi.fn() };
        Product.findByPk.mockResolvedValue(product);

        await productController.deleteProductById(req, res);

        expect(product.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.end).toHaveBeenCalled();
    });

    it('should update product stock', async () => {
        const req = { body: { id: 1, stock: 10 } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const product = { save: vi.fn() };
        Product.findByPk.mockResolvedValue(product);

        await productController.updateProductStock(req, res);

        expect(product.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(product);
    });

    it('should update product promotion', async () => {
        const req = { body: { id: 1, promotion: 20 } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const product = { save: vi.fn() };
        Product.findByPk.mockResolvedValue(product);

        await productController.updateProductPromotion(req, res);

        expect(product.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(product);
    });

    it('should search products', async () => {
        const req = { query: { q: 'Test' } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const products = [{ name: 'Product1' }, { name: 'Product2' }];
        Product.findAll.mockResolvedValue(products);

        await productController.searchProducts(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(products);
    });

    it('should suggest products', async () => {
        const req = { query: { q: 'Test' } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const suggestions = [{ name: 'Product1' }, { name: 'Product2' }];
        Product.findAll.mockResolvedValue(suggestions);

        await productController.suggestProducts(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(suggestions);
    });
});