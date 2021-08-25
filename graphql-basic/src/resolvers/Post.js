const Post = {
  author(parent, args, { db }, info) {
    return db.users.find(({ id }) => {
      return id === parent.author;
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter(({ post }) => post === parent.id);
  },
};

export { Post as default };
