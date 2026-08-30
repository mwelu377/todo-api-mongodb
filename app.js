const express = require('express');
const Joi = require('joi');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
app.use(express.json()); // Parse JSON bodies

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
  });

  // Joi validation schema
const todoSchema = Joi.object({
  task: Joi.string().min(3).required(),
  completed: Joi.boolean()
});
const todoUpdateSchema = Joi.object({
  task: Joi.string().min(3),
  completed: Joi.boolean()
});

  // MongoDB Todo Schema

 const todoSchemaMongo = new mongoose.Schema({
  task: {
    type: String,
    required: true,
    minlength: 3
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const Todo = mongoose.model('Todo', todoSchemaMongo);


app.get('/todos', async (req, res, next) => {
  try {
     const filter = {};

    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === 'true';
    }

    const todos = await Todo.find(filter);
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
});


app.get('/todos/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

app.post('/todos', async (req, res, next) => {
  try {
    const { error } = todoSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      });
    }

    const newTodo = await Todo.create(req.body);

    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
});
app.patch('/todos/:id', async (req, res, next) => {
  try {
    const { error } = todoUpdateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      });
    }

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({
        message: 'Todo not found'
      });
    }

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

app.delete('/todos/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        error: 'Not found'
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  res.status(500).json({
    error: err.message
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
