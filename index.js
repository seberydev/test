import { gql, ApolloServer } from "apollo-server";

const items = [
  {
    id: "b717d505-5cfa-4825-8f4c-5fee02bb817c",
    name: "Joshua",
    path: "first.second.third",
  },
  {
    id: "80d0e819-0ecc-4e06-8b1a-5aa60aedbb25",
    name: "Daniel",
    path: "one.two.three",
  },
  {
    id: "77f7562e-56a2-4acb-9f85-3b23d6bd7b05",
    name: "Jake",
    path: "test.test.test",
  },
];

const typeDefs = gql`
  type Item {
    id: ID!
    name: String!
    path: String!
  }

  type Query {
    items: [Item]
  }

  type Mutation {
    AddItem(id: ID!, name: String!, path: String!): Item
  }
`;

const resolvers = {
  Query: {
    items: () => items,
  },

  Mutation: {
    AddItem: (root, args) => {
      const newItem = { ...args };

      if (newItem.path.includes(" ")) {
        throw new Error("Invalid Path");
      }

      items.push(newItem);

      return newItem;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`${url}`);
});
