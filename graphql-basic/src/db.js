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
const db = {
  users,
  posts,
  comments,
};
export default db;
