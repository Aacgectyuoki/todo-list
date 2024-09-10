const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean } = require('graphql');
const UserType = require('./userSchema'); // Ensure correct import path
const CategoryType = require('./categorySchema'); // Ensure correct import path
const User = require('../models/User'); // Mongoose model
const Category = require('../models/Category'); // Mongoose model

const TodoType = new GraphQLObjectType({
  name: 'Todo',
  fields: () => ({
    id: { type: GraphQLID },
    task: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    user: {
      type: UserType,  // Ensure UserType is correctly defined and imported
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
    category: {
      type: CategoryType,  // Ensure CategoryType is correctly defined and imported
      resolve(parent, args) {
        return Category.findById(parent.categoryId);
      },
    },
  }),
});

module.exports = TodoType;  // Ensure correct export
