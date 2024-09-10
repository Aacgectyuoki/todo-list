const { GraphQLList, GraphQLID, GraphQLString, GraphQLBoolean } = require('graphql');
const Todo = require('../models/Todo'); // Mongoose model for Todo
const TodoType = require('../schemas/todoSchema'); // GraphQL type for Todo

// Queries for fetching todos
const todoQueries = {
  todos: {
    type: new GraphQLList(TodoType),  // Return a list of todos
    resolve(parent, args) {
      try {
        return Todo.find({});
      } catch (error) {
        throw new Error('Error fetching todos');
      }
    },
  },
  todo: {
    type: TodoType,  // Return a single todo
    args: { id: { type: GraphQLID } },  // Argument for todo ID
    resolve(parent, args) {
      try {
        return Todo.findById(args.id);
      } catch (error) {
        throw new Error('Error fetching todo');
      }
    },
  },
};

// Mutations for modifying todos
const todoMutations = {
  addTodo: {
    type: TodoType,  // Return the newly created todo
    args: {
      task: { type: GraphQLString },
      completed: { type: GraphQLBoolean },
      userId: { type: GraphQLID },  // Associate with a user
      categoryId: { type: GraphQLID },  // Associate with a category
    },
    resolve(parent, args) {
      const todo = new Todo({
        task: args.task,
        completed: args.completed,
        userId: args.userId,
        categoryId: args.categoryId,
      });
      return todo
        .save()
        .then((result) => result)
        .catch((err) => {
          throw new Error('Error adding todo');
        });
    },
  },
  // Update a todo by ID
  updateTodo: {
    type: TodoType,
    args: {
      id: { type: GraphQLID },
      task: { type: GraphQLString },
      completed: { type: GraphQLBoolean },
    },
    resolve(parent, args) {
      return Todo.findByIdAndUpdate(
        args.id,
        { task: args.task, completed: args.completed },
        { new: true }
      )
        .then((updatedTodo) => updatedTodo)
        .catch((err) => {
          throw new Error('Error updating todo');
        });
    },
  },
  // Delete a todo by ID
  deleteTodo: {
    type: TodoType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return Todo.findByIdAndDelete(args.id)
        .then((deletedTodo) => deletedTodo)
        .catch((err) => {
          throw new Error('Error deleting todo');
        });
    },
  },
};

module.exports = {
  todoQueries,
  todoMutations,
};
