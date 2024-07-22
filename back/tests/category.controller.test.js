import { describe, it, expect, vi } from 'vitest';
import * as categoryController from '../src/controllers/category.controller';
import Category from '../src/models/category.model';
import Product from '../src/models/product.model';

vi.mock('../src/models/category.model');
vi.mock('../src/models/product.model');

describe('Category Controller', () => {
    it('should create a category', async () => {
        const req = { body: { name: 'Test Category' } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        Category.create.mockResolvedValue(req.body);

        await categoryController.createCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('should get all categories', async () => {
        const req = {};
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const categories = [{ name: 'Category1' }, { name: 'Category2' }];
        Category.findAll.mockResolvedValue(categories);

        await categoryController.getAllCategories(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(categories);
    });

    it('should get a category by id', async () => {
        const req = { params: { id: 1 } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const category = { name: 'Test Category' };
        Category.findByPk.mockResolvedValue(category);

        await categoryController.getCategoryById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(category);
    });

    it('should update a category by id', async () => {
        const req = { params: { id: 1 }, body: { name: 'Updated Category' } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const category = { update: vi.fn() };
        Category.findByPk.mockResolvedValue(category);

        await categoryController.updateCategoryById(req, res);

        expect(category.update).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(category);
    });

    it('should delete a category by id', async () => {
        const req = { params: { id: 1 } };
        const res = { status: vi.fn().mockReturnThis(), end: vi.fn() };

        const category = { destroy: vi.fn() };
        Category.findByPk.mockResolvedValue(category);

        await categoryController.deleteCategoryById(req, res);

        expect(category.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.end).toHaveBeenCalled();
    });

    it('should get products by category id', async () => {
        const req = { params: { id: 1 } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const products = [{ name: 'Product1' }, { name: 'Product2' }];
        Product.findAll.mockResolvedValue(products);

        await categoryController.getCategoryProducts(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(products);
    });
});