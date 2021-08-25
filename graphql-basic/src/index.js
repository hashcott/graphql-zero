import { GraphQLServer } from "graphql-yoga";
import { nanoid } from "nanoid";
import db from "./db";
// Resolvers

const resolvers = {
  Query: {
    users(parent, args, { db }, info) {
      if (!args.query) {
        return db.users;
      }
      return db.users.filter(({ name }) => {
        return name.toLowerCase().includes(args.query);
      });
    },
    posts(parent, args, { db }, info) {
      if (!args.query) return db.posts;
      return db.posts.filter(({ title, body }) => {
        return (
          title.toLowerCase().includes(args.query) ||
          body.toLowerCase().includes(args.query)
        );
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments;
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
    createUser(parent, args, { db }, info) {
      const emailTaken = db.users.some(({ email }) => args.email === email);

      if (emailTaken) {
        throw new Error("Email taken.");
      }

      const user = {
        id: nanoid(),
        ...args.data,
      };
      db.users.push(user);
      return user;
    },
    deleteUser(_, args, { db }, info) {
      const userIndex = db.users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      const userDeleted = db.users.splice(userIndex, 1);

      posts = db.posts.filter((post) => {
        const match = post.author === args.id;
        if (match) {
          db.comments = db.comments.filter(
            (comment) => comment.post === post.id
          );
        }
        return !match;
      });
      db.comments = db.comments.filter((comment) => comment.author === args.id);

      return userDeleted;
    },
    createPost(parent, args, { db }, info) {
      const userExists = db.users.some(({ id }) => args.author === id);

      if (!userExists) {
        throw new Error("User not found.");
      }

      const post = {
        id: nanoid(),
        ...args.data,
      };

      db.posts.push(post);
      return post;
    },
    deletePost(_, args, { db }, info) {
      const postIndex = db.posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) {
        throw new Error("Post not found");
      }

      const deletedPost = db.posts.splice(postIndex, 1);
      db.comments = db.comments.filter((comment) => comment.post === args.id);

      return deletedPost;
    },
    createComment(parent, args, { db }, info) {
      const userExists = db.users.some(({ id }) => args.author === id);
      const postExists = db.posts.some(({ id, published }) => {
        return id === args.post && published === true;
      });
      if (!userExists || !postExists) {
        throw new Error("Unable to find user and post");
      }

      const comment = {
        id: nanoid(),
        ...args.data,
      };
      db.comments.push(comment);
      return comment;
    },
    deleteComment(_, args, { db }, info) {
      const indexComment = db.comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (indexComment === -1) {
        throw new Error("Comment not found");
      }

      const deletedComment = db.comments.splice(indexComment, 1);

      return deletedComment[0];
    },
  },
  Post: {
    author(parent, args, { db }, info) {
      return db.users.find(({ id }) => {
        return id === parent.author;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(({ post }) => post === parent.id);
    },
  },
  User: {
    posts(parent, args, { db }, info) {
      return db.posts.filter(({ author }) => {
        return author === parent.id;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(({ author }) => author === parent.id);
    },
  },
  Comment: {
    author(parent, args, { db }, info) {
      return db.users.find(({ id }) => {
        return id === parent.author;
      });
    },
    post(parent, args, { db }, info) {
      return db.posts.find(({ id }) => id === parent.post);
    },
  },
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    db,
  },
});

server.start(() => {
  console.log("The server is up!");
});
