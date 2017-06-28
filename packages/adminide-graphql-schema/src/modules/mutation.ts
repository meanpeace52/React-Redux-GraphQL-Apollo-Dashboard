export const typeDef = `
# Mutations
type Mutation {
    addPerson(name: String!, sex: String!): PersonType
    addBox(name: String!, language: String!, description: String!): BoxType
    updateBox(_id: String!, name: String, language: String, description: String): BoxType
    removeBox(id: String!): Boolean
    startBox(id: String!): Boolean
    stopBox(id: String!): Boolean
}
`;

export const resolver = {
    Mutation: {
        addPerson(root, args, ctx) {
            return ctx.addPerson(ctx.persons, {
                id: Math.random().toString(16).substr(2),
                name: args.name,
                sex: args.sex,
            });
        },
        addBox(root, args, ctx) {
            return ctx.createBox(args)
                .then(box => {
                    ctx.pubsub.publish('subscribeToWorkspace', { value: box, mutation: 'createWorkspace' });
                    return box;
                });
        },
        updateBox(root, { _id, ...data }, ctx) {
            return ctx.updateBox(_id, data)
                .then(box => {
                    ctx.pubsub.publish('subscribeToWorkspace', { value: box, mutation: 'updateWorkspace' });
                    return box;
                });
        },
        startBox(root, { id }, ctx) {
            return ctx.setBoxStatus(id)
                .then(box => {
                    ctx.pubsub.publish('subscribeToWorkspace', { value: box, mutation: 'updateWorkspace' });
                    ctx.pubsub.publish('workspaceStart', { workspace: box._id });
                })
                .then(() => true)
                .catch(() => false);
        },
        stopBox(root, { id }, ctx) {
            return ctx.setBoxStatus(id)
                .then(box => {
                    ctx.pubsub.publish('subscribeToWorkspace', { value: box, mutation: 'updateWorkspace' });
                    ctx.pubsub.publish('workspaceStop', { workspace: box._id });
                })
                .then(() => true)
                .catch(() => false);
        },
        removeBox(root, { id }, ctx) {
            return ctx.removeBox(id)
                .then(box => ctx.pubsub.publish('subscribeToWorkspace', { value: { _id: id }, mutation: 'deleteWorkspace' }))
                .then(() => true)
                .catch(() => false);
        },
    },
};
