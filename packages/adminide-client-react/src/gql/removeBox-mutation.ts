import { gql } from 'react-apollo';

export default gql`
    mutation removeBox($id: String!) {
        removeBox(id: $id)
    }
`;
