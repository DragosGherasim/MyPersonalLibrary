import { gql } from '@apollo/client';

export const GET_BOOKS = gql`
    query GetBooks($first: Int, $where: BookFilterInput, $order: [BookSortInput!]) {
        books(first: $first, where: $where, order: $order) {
            totalCount
            edges {
                node {
                    id
                    title
                    author {
                        name
                    }
                }
            }
        }
    }
`;

export const GET_BOOK_DETAILS = gql`
    query GetBookDetails($id: Int!) {
        bookById(id: $id) {
            id
            title
            year
            status
            author {
                id
                name
                books {
                    title
                }
            } 
        }
    }
`;