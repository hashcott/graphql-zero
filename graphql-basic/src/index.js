import { GraphQLServer } from "graphql-yoga";
import { nanoid } from "nanoid";
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
    id: "10",
    title: "GraphQL 101",
    body: "This is how to use GraphQL",
    published: true,
    author: "1",
  },
  {
    id: "11",
    title: "GraphQL",
    body: "This is an advanced GraphQL post",
    published: false,
    author: "2",
  },
];

// Demo comments data
const comments = [
  {
    id: "101",
    text: "This worked well for me. Thanks",
    author: "1",
    post: "10",
  },
  {
    id: "102",
    text: "Glad you enjoyed it.",
    author: "1",
    post: "11",
  },
  {
    id: 104,
    text: "This did not work",
    author: "2",
    post: "11",
  },
  {
    id: "105",
    text: "Nevermind. I got it to work. Thank lyly",
    author: "2",
    post: "10",
  },
];

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query : String): [User]!
        posts(query : String): [Post]!
        comments: [Comment]!
        me: User!
        post: Post!
    }
    type Mutation {
      createUser(data : CreateUserInput) : User!
      deleteUser(id : ID!) : User!
      deletePost(id : ID!) : Post!
      deleteComment(id : ID!) : Comment!
      createPost(data : CreatePostInput) : Post!
      createComment(data : CreateCommentInput) : Comment!
    }

    input CreateUserInput {
      name: String!
      email : String!
      age : Int
    }
    input CreatePostInput {
      title : String!
      body: String!
      published: Boolean!
      author: ID!
    }

    input CreateCommentInput {
      text: String!
      author: ID!
      post : ID!
    }

    type User {
      id : ID!
      name: String!
      email: String!
      age: Int
      posts : [Post!]!
      comments: [Comment!]!
    }
    type Post {
      id: ID!
      title: String!
      body: String!
      published: String!
      author : User!
      comments: [Comment!]!
    }
    type Comment {
      id : ID!
      text: String!
      author : User!
      post: Post!
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
    comments(parent, args, ctx, info) {
      return comments;
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(({ email }) => args.email === email);

      if (emailTaken) {
        throw new Error("Email taken.");
      }

      const user = {
        id: nanoid(),
        ...args.data,
      };
      users.push(user);
      return user;
    },
    deleteUser(_, args) {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      const userDeleted = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.author === args.id;
        if (match) {
          comments = comments.filter((comment) => comment.post === post.id);
        }
        return !match;
      });
      comments = comments.filter((comment) => comment.author === args.id);

      return userDeleted;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(({ id }) => args.author === id);

      if (!userExists) {
        throw new Error("User not found.");
      }

      const post = {
        id: nanoid(),
        ...args.data,
      };

      posts.push(post);
      return post;
    },
    deletePost(_, args) {
      const postIndex = posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) {
        throw new Error("Post not found");
      }

      const deletedPost = posts.splice(postIndex, 1);
      comments = comments.filter((comment) => comment.post === args.id);

      return deletedPost;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some(({ id }) => args.author === id);
      const postExists = posts.some(({ id, published }) => {
        return id === args.post && published === true;
      });
      if (!userExists || !postExists) {
        throw new Error("Unable to find user and post");
      }

      const comment = {
        id: nanoid(),
        ...args.data,
      };
      comments.push(comment);
      return comment;
    },
    deleteComment(_, args) {
      const indexComment = comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (indexComment === -1) {
        throw new Error("Comment not found");
      }

      const deletedComment = comments.splice(indexComment, 1);

      return deletedComment[0];
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(({ id }) => {
        return id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      console.log(parent.id);
      return comments.filter(({ post }) => post === parent.id);
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(({ author }) => {
        return author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(({ author }) => author === parent.id);
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(({ id }) => {
        return id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find(({ id }) => id === parent.post);
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
