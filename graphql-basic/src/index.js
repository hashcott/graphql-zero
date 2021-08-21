import { GraphQLServer } from "graphql-yoga";

// Demo user date
const users = [
  {
    id: "1",
    name: "Harry",
    email: "harry@me.com",
  },
  {
    id: "2",
    name: "John",
    email: "john@me.com",
  },
  {
    id: "3",
    name: "Lyly",
    email: "lyly@me.com",
  },
];

// Demo posts data

const posts = [
  {
    id: 10,
    title: "GraphQL 101",
    body: "This is how to use GraphQL",
    published: true,
    author: "1",
  },
  {
    id: 11,
    title: "GraphQL",
    body: "This is an advanced GraphQL post",
    published: false,
    author: "2",
  },
];

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query : String): [User]!
        posts(query : String): [Post]!
        me: User!
        post: Post!
    }
    type User {
      id : ID!
      name: String!
      email: String!
      age: Int
      posts : [Post]!
    }
    type Post {
      id: ID!
      title: String!
      body: String!
      published: String!
      author : User!
    }
`;
// Resolvers

const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter(({ name }) => {
        return name.toLowerCase().includes(args.query);
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) return posts;
      return posts.filter(({ title, body }) => {
        return (
          title.toLowerCase().includes(args.query) ||
          body.toLowerCase().includes(args.query)
        );
      });
    },
    me() {
      return {
        id: "1",
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
  Post: {
    author(parent, args, ctx, info) {
      return users.find(({ id }) => {
        return id === parent.author;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(({ author }) => {
        return author == parent.id;
      });
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
