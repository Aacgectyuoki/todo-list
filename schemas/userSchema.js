const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = require('graphql');
const TodoType = require('./todoSchema'); // Ensure correct import path
const Todo = require('../models/Todo'); // Mongoose model

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    todos: {
      type: new GraphQLList(TodoType),  // Ensure TodoType is correctly defined and imported
      resolve(parent, args) {
        return Todo.find({ userId: parent.id });
      },
    },
  }),
});

module.exports = UserType;  // Ensure correct export
