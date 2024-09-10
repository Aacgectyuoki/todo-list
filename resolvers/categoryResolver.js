const { GraphQLList, GraphQLID, GraphQLString } = require('graphql');
const Category = require('../models/Category'); // Mongoose model
const CategoryType = require('../schemas/categorySchema'); // GraphQL type

// Queries for fetching categories
const categoryQueries = {
  categories: {
    type: new GraphQLList(CategoryType),  // Return a list of categories
    resolve(parent, args) {
      try {
        return Category.find({});
      } catch (error) {
        throw new Error('Error fetching categories');
      }
    },
  },
  category: {
    type: CategoryType,  // Return a single category
    args: { id: { type: GraphQLID } },  // Argument for category ID
    resolve(parent, args) {
      try {
        return Category.findById(args.id);
      } catch (error) {
        throw new Error('Error fetching category');
      }
    },
  },
};

// Mutations for modifying categories
const categoryMutations = {
  addCategory: {
    type: CategoryType,  // Return the newly created category
    args: { name: { type: GraphQLString } },  // Argument for category name
    resolve(parent, args) {
      const category = new Category({
        name: args.name,
      });
      return category
        .save()
        .then((result) => result)
        .catch((err) => {
          throw new Error('Error adding category');
        });
    },
  },
  // Update a category by ID
  updateCategory: {
    type: CategoryType,
    args: {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
    },
    resolve(parent, args) {
      return Category.findByIdAndUpdate(args.id, { name: args.name }, { new: true })
        .then((updatedCategory) => updatedCategory)
        .catch((err) => {
          throw new Error('Error updating category');
        });
    },
  },
  
  // Delete a category by ID
  deleteCategory: {
    type: CategoryType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return Category.findByIdAndDelete(args.id)
        .then((deletedCategory) => deletedCategory)
        .catch((err) => {
          throw new Error('Error deleting category');
        });
    },
  },
  
};

module.exports = {
  categoryQueries,
  categoryMutations,
};
