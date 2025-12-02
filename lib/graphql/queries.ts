// GraphQL query strings

export const GET_USER_NAME_BY_ID = `
  query GetUserNameById($id: ID!) {
    user(id: $id) {
      id
      name
    }
  }
`;

export const SEARCH_PRODUCTS = `
  query SearchProducts($keyword: String, $category: String) {
    products(search: $keyword, category: $category) {
      id
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

export const PRODUCTS_BY_IDS = `
  query ProductsByIds($ids: [ID!]!) {
    productsByIds(ids: $ids) {
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

export const GET_CHAT_SESSIONS = `
  query ChatSessions($buyerId: ID, $sellerId: ID, $productId: ID) {
    chatSessions(
      buyerId: $buyerId
      sellerId: $sellerId
      productId: $productId
    ) {
      id
      productId
      buyerId
      sellerId
    }
  }
`;

export const GET_MESSAGES = `
  query Messages($sessionId: ID!) {
    messages(sessionId: $sessionId) {
      id
      sessionId
      senderId
      body
      createdAt
    }
  }
`;
