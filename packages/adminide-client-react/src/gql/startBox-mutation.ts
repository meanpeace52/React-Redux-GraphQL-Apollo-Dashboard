import { gql } from 'react-apollo';

export default gql`
    mutation startBox($id: String!) {
        startBox(id: $id)
    }
`;
