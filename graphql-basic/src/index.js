import { GraphQLServer } from "graphql-yoga";

// Type definitions (schema)
const typeDefs = `
    type Query {
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`;
// Resolvers

const resolvers = {
  Query: {
    title() {
      return "Brixon 150";
    },
    price() {
      return 56000000.0;
    },
    releaseYear() {
      return 2021;
    },
    rating() {
      return 4.9;
    },
    inStock() {
      return true;
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("The server is up!");
});
