const express = require("express");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
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

// Middleware
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

// Increase payload size limit
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
  } catch (error) {
    console.log(error.message);
  }
};
connectDB();

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ mongoDataMethods }),
});

// Start Apollo Server
async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
}
startApolloServer();

// Router
route(app);

// Listen to the server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`GraphQL playground at http://localhost:${port}/graphql`);
});
