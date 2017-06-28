import { PubSub, SubscriptionManager } from 'graphql-subscriptions';
import { schema } from './schema';

const pubsub = new PubSub();
const subscriptionManager = new SubscriptionManager({
    schema,
    pubsub,
    setupFunctions: {
        subscribeToWorkspace: (options, { filter: { creator, server }, mutations }) => ({
            subscribeToWorkspace: {
                filter: (workspacePayload) => {
                    // const ret = mutations.some(event => workspacePayload.mutation === event) &&
                    //     (workspacePayload.value.creator === creator || workspacePayload.value.server === server);
                    // return ret;

                    return true;
                },
            },
        }),
    },
});

export { subscriptionManager, pubsub };
