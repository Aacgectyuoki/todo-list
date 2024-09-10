const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
//const schema = require('./schemas'); // Will combine all schemas here
const schema = require('./schemas/index');  // Corrected import

require('dotenv').config();

const app = express();
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// GraphQL Endpoint
app.use('/graphql', graphqlHTTP({
  schema,  // This will be the combined schema file
  graphiql: true,  // Enable GraphiQL interface for testing
}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
