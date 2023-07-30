const express = require("express");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const session = require("express-session");
const { ApolloServer } = require("apollo-server-express");
const route = require("./routes");
const sequelize = require("./config/db");
const cors = require("cors");
const port = process.env.PORT || 8000;
const mongoDataMethods = require("./config/graphql/graphql");
const typeDefs = require("./schema/schema");
const resolvers = require("./resolvers/resolvers");
dotenv.config();
const app = express();

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(methodOverride("_method"));
// Create an async function to start the Apollo Server and apply the middleware

// Connect to the database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.log(error.message);
  }
};
connectDB();

// Router

// Listen to the server

async function startApolloServer() {
  const app = express();
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ mongoDataMethods }),
  });
  await server.start();
  server.applyMiddleware({ app });
  route(app);

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
    console.log(`GraphQL playground at http://localhost:${port}/graphql`);
  });
}
startApolloServer();
