import { gql } from "@apollo/client";

export const GET_MY_LIBRARY = gql`
  query GetMyLibrary($first: Int, $after: String, $where: UserBookFilterInput, $order: [UserBookSortInput!]) {
    myLibrary(
      first: $first
      after: $after
      where: $where
      order: $order
    ) {
      # 1. Add pageInfo here
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          bookId
          status
          book {
            title
            year
            author {
              name
            }
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
            description
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