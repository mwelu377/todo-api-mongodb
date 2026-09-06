const express = require('express');
const Article = require('../models/articleModel');
const articleValidation = require('../validation/articleValidation');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { error } = articleValidation.validate(req.body);

if (error) {
  return res.status(400).json({ error: error.details[0].message });
}
    const article = new Article(req.body);
    await article.save();

    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const articles = await Article.find();

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { error } = articleValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      });
    }

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({
        error: 'Article not found'
      });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        error: 'Article not found'
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;