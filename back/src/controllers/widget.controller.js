const dotenv = require('dotenv').config({ path: './.env.local' });
const Widget = require('../models/widget.model');

// Route pour créer un nouveau widget
exports.createWidget = async (req, res) => {
    try {
        const { x, y, width, height, type, dimensionsDatas, measuresDatas, title } = req.body;
        const newWidget = await Widget.create({
            x,
            y,
            width,
            height,
            type,
            dimensionsDatas,
            measuresDatas,
            title,
        });
        res.status(201).json(newWidget);
    } catch (error) {
        console.error('Error creating widget:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateWidget = async (req, res) => {
    try {
        const widget = await Widget.findByPk(req.params.id);
        if (!widget) {
            return res.status(404);
        }
        await widget.update(req.body);
        res.status(200).json(widget);
    } catch (error) {
        console.error('Error updating widget:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteWidget = async (req, res) => {
    try {
        const widget = await Widget.findByPk(req.params.id);
        if (!widget) {
            return res.status(404);
        }
        await widget.destroy();
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting widget:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getWidgets = async (req, res) => {
    try {
        const widgets = await Widget.findAll();
        res.status(200).json(widgets);
    } catch (error) {
        console.error('Error getting widgets:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
