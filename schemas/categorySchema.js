const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql');

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  }),
});

module.exports = CategoryType;