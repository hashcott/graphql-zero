import { GraphQLServer } from "graphql-yoga";

// Type definitions (schema)
const typeDefs = `
    type Query {
        greeting(name: String!, position: String!): String!
        add(a: Int!, b: Int!) : Int!
        user: User!
        post: Post!
    }
    type User {
      id : ID!
      name: String!
      email: String!
      age: Int
    }
    type Post {
      id: ID!
      title: String!
      body: String!
      published: String!
    }
`;
// Resolvers

const resolvers = {
  Query: {
    greeting(parent, args, ctx, info) {
      if (args.name && args.position) {
        return `Hello ${args.name} ! You are my favorite ${args.position}.`;
      }
      return "Hello !";
    },
    add(parent, args, ctx, info) {
      return args.a + args.b;
    },
    user() {
      return {
        id: "123",
        name: "Harry",
        email: "harry@me.com",
      };
    },
    post() {
      return {
        id: "2e28727",
        title: "GraphQL 101",
        body: "",
        published: true,
      };
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
