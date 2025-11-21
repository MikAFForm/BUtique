// GraphQL query strings

export const GET_USERS_NAME = `
  query GetUsersName {
    users {
      id
      name
    }
  }
`;

export const SEARCH_PRODUCTS = `
  query SearchProducts($keyword: String, $category: String) {
    products(search: $keyword, category: $category) {
      id
      name
      price
      condition
      status
      category
      location
      hashtags
      description
      createdAt
    }
  }
`;

export const GET_ALL_PRODUCTS = `
  query GetAllProducts {
    allProducts {
      id
      name
      price
      condition
      status
      category
      description
      location
      sellerId
      sellerName
      createdAt
      updatedAt
      imageUrls
      hashtags
    }
  }
`;
