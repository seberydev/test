import { GraphQLScalarType } from "graphql";
import pkg from "apollo-server";
const { gql, ApolloServer, Kind } = pkg;

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
  scalar Path

  type Item {
    id: ID!
    name: String!
    path: Path!
  }

  type Query {
    items: [Item]
  }

  type Mutation {
    AddItem(id: ID!, name: String!, path: String!): Item
  }
`;

const pathScalar = new GraphQLScalarType({
  name: "Path",
  description: "Path Custom Scalar Type",
  serialize(value) {
    if (value.includes(" ")) {
      throw new Error("Invalid Path");
    }
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast;
    }
    return null;
  },
});

const resolvers = {
  Path: pathScalar,
  Query: {
    items: () => items,
  },

  Mutation: {
    AddItem: (root, args) => {
      const newItem = { ...args };

      items.push(newItem);

      return newItem;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`${url}`);
});
