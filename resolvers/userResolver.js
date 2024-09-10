const { GraphQLList, GraphQLID, GraphQLString } = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Mongoose model for User
const UserType = require('../schemas/userSchema'); // GraphQL type for User
require('dotenv').config(); // Load environment variables

// Queries for fetching users
const userQueries = {
  users: {
    type: new GraphQLList(UserType),  // Return a list of users
    resolve(parent, args) {
      try {
        return User.find({});
      } catch (error) {
        throw new Error('Error fetching users');
      }
    },
  },
  user: {
    type: UserType,  // Return a single user
    args: { id: { type: GraphQLID } },  // Argument for user ID
    resolve(parent, args) {
      try {
        return User.findById(args.id);
      } catch (error) {
        throw new Error('Error fetching user');
      }
    },
  },
};

// Mutations for modifying users
const userMutations = {
  registerUser: {
    type: UserType,  // Return the newly created user
    args: {
      username: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
    },
    async resolve(parent, args) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: args.email });
        if (existingUser) {
          throw new Error('User already exists with that email.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(args.password, 12);

        // Create new user
        const user = new User({
          username: args.username,
          email: args.email,
          password: hashedPassword,
        });

        return await user.save();
      } catch (err) {
        throw new Error('Error registering user');
      }
    },
  },
  loginUser: {
    type: GraphQLString,  // Return a JWT token as a string
    args: {
      email: { type: GraphQLString },
      password: { type: GraphQLString },
    },
    async resolve(parent, args) {
      try {
        const user = await User.findOne({ email: args.email });
        if (!user) {
          throw new Error('User does not exist.');
        }

        const isMatch = await bcrypt.compare(args.password, user.password);
        if (!isMatch) {
          throw new Error('Invalid credentials.');
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return token;
      } catch (err) {
        throw new Error('Error logging in user');
      }
    },
  },
};

module.exports = {
  userQueries,
  userMutations,
};
