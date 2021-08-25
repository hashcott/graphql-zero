const Query = {
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
};

export { Query as default };
