import { describe, it, expect, vi } from 'vitest';
import * as widgetController from '../src/controllers/widget.controller';
import Widget from '../src/models/widget.model';

vi.mock('../src/models/widget.model');

describe('Contrôleur de Widget', () => {
    it('devrait créer un widget', async () => {
        const req = { body: { title: 'Test Widget' } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        Widget.create.mockResolvedValue(req.body);

        await widgetController.createWidget(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('devrait mettre à jour un widget', async () => {
        const req = { params: { id: 1 }, body: { title: 'Updated Widget' } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const widget = { update: vi.fn() };
        Widget.findByPk.mockResolvedValue(widget);

        await widgetController.updateWidget(req, res);

        expect(widget.update).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(widget);
    });

    it('devrait supprimer un widget', async () => {
        const req = { params: { id: 1 } };
        const res = { status: vi.fn().mockReturnThis(), end: vi.fn() };

        const widget = { destroy: vi.fn() };
        Widget.findByPk.mockResolvedValue(widget);

        await widgetController.deleteWidget(req, res);

        expect(widget.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.end).toHaveBeenCalled();
    });

    it('devrait obtenir tous les widgets', async () => {
        const req = {};
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        const widgets = [{ title: 'Widget1' }, { title: 'Widget2' }];
        Widget.findAll.mockResolvedValue(widgets);
        await widgetController.getWidgets(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(widgets);
    });
});