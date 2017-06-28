import { gql } from 'react-apollo';

export default gql`
    mutation stopBox($id: String!) {
        stopBox(id: $id)
    }
`;
