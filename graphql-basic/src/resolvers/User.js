const User = {
  posts(parent, args, { db }, info) {
    return db.posts.filter(({ author }) => {
      return author === parent.id;
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter(({ author }) => author === parent.id);
  },
};

export { User as default };
