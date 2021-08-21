import { GraphQLServer } from "graphql-yoga";

// Type definitions (schema)
const typeDefs = `
    type Query {
        id : ID!
        name: String!
        age: Int!
        employed: Boolean
        gpa: Float
    }
`;
// Resolvers

const resolvers = {
  Query: {
    id() {
      return "abc123";
    },
    name() {
      return "Harry";
    },
    age() {
      return 21;
    },
    employed() {
      return true;
    },
    gpa() {
      return 3.6;
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
