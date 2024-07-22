import { describe, it, expect, vi } from 'vitest';
import * as brandController from '../src/controllers/brand.controller';
import Brand from '../src/models/brand.model';
import Product from '../src/models/product.model';

vi.mock('../src/models/brand.model');
vi.mock('../src/models/product.model');

describe('Brand Controller', () => {
    it('should create a brand', async () => {
        const req = { body: { name: 'Test Brand' } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        Brand.create.mockResolvedValue(req.body);

        await brandController.createBrand(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('should get all brands', async () => {
        const req = {};
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const brands = [{ name: 'Brand1' }, { name: 'Brand2' }];
        Brand.findAll.mockResolvedValue(brands);

        await brandController.getAllBrands(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(brands);
    });

    it('should get a brand by id', async () => {
        const req = { params: { id: 1 } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const brand = { name: 'Test Brand' };
        Brand.findByPk.mockResolvedValue(brand);

        await brandController.getBrandById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(brand);
    });

    it('should update a brand by id', async () => {
        const req = { params: { id: 1 }, body: { name: 'Updated Brand' } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const brand = { update: vi.fn() };
        Brand.findByPk.mockResolvedValue(brand);

        await brandController.updateBrandById(req, res);

        expect(brand.update).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(brand);
    });

    it('should delete a brand by id', async () => {
        const req = { params: { id: 1 } };
        const res = { status: vi.fn().mockReturnThis(), end: vi.fn(), json: vi.fn() };

        const brand = { destroy: vi.fn() };
        Brand.findByPk.mockResolvedValue(brand);
        Product.findAll.mockResolvedValue([]);
        Brand.findOne.mockResolvedValue({ id: 2 });

        await brandController.deleteBrandById(req, res);

        expect(brand.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.end).toHaveBeenCalled();
    });
});