import { gql } from "@apollo/client";

export const GET_MY_LIBRARY = gql`
  query GetMyLibrary(
    $first: Int,
    $where: UserBookFilterInput,
    $order: [UserBookSortInput!]
  ) {
    myLibrary(first: $first, where: $where, order: $order) {
      totalCount
      edges {
        node {
          bookId
          status
          book {
            id
            title
            author {
              id
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

export const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      id
      name
    }
  }
`;