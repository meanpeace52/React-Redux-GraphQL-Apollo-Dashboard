export const typeDef = `
input subscribeWorkspaceFilter {
  server: String
  creator: String
}

type WorkspaceSubscriptionPayload {
  value: BoxType
  mutation: WorkspaceMutationEvent
}

type Subscription {
    subscribeToWorkspace(filter: subscribeWorkspaceFilter
                  mutations: [WorkspaceMutationEvent]!
                  ): WorkspaceSubscriptionPayload
}

enum WorkspaceMutationEvent {
  createWorkspace
  updateWorkspace
  deleteWorkspace
  startWorkspace
  stopWorkspace
}
`;

export const resolver = {
  Subscription: {
    subscribeToWorkspace: data => data,
  },
};
