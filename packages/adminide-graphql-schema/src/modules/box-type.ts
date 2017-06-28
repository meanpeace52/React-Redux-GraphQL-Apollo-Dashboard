export const typeDef = `
type SpecType {
  ram: Int
  hdd: Int
  cpu: Int
}

type BoxType {
    _id: String
    name: String
    language: String
    description: String
    status: String
    spec: SpecType
    matches: [BoxType]
}
`;

export const resolver = {
  BoxType: {
    matches(root, args, ctx) {
      return ctx.boxes.filter(box => box.name !== root.name);
    },
  },
};


