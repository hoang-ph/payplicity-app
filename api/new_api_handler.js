const fs = require('fs');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');

const GraphQLDate = require('./graphql_date.js');
const about = require('./about.js');
const expense = require('./expense.js');
const auth = require('./auth.js');

const resolvers = {
  Query: {
    about: about.getMessage,
    user: auth.resolveUser,
    expenseList: expense.list,
    expense: expense.get,
    expenseCounts: expense.counts,
  },
  Mutation: {
    setAboutMessage: about.setAboutMessage,
    expenseAdd: expense.add,
    expenseUpdate: expense.update,
  },
  GraphQLDate,
};

function getContext({ req }) {
  const user = auth.getUser(req);
  return { user };
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('new.schema.graphql', 'utf-8'),
  resolvers,
  context: getContext,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

function installHandler(app) {
  const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
  console.log('CORS setting:', enableCors);
  let cors;
  if (enableCors) {
    const origin = process.env.UI_SERVER_ORIGIN || 'http://localhost:8000';
    const methods = 'POST';
    cors = { origin, methods, credentials: true };
  } else {
    cors = 'false';
  }
  server.applyMiddleware({ app, path: '/graphql', cors });
}

module.exports = { installHandler };
