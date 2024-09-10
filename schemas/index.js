const { GraphQLObjectType, GraphQLSchema } = require('graphql');
const { categoryQueries, categoryMutations } = require('../resolvers/categoryResolver');
const { todoQueries, todoMutations } = require('../resolvers/todoResolver');
const { userQueries, userMutations } = require('../resolvers/userResolver');

// Combine all root queries
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    ...categoryQueries,
    ...todoQueries,
    ...userQueries,
  },
});

// Combine all mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...categoryMutations,
    ...todoMutations,
    ...userMutations,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
