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
    isUserInterested
    interestedCount
    interestedBuyers {
      userId
      name
    }
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

export const IS_USER_INTERESTED = `
  query IsUserInterested($userId: ID!, $productId: ID!) {
    isUserInterested(userId: $userId, productId: $productId)
  }
`;

export const GET_INTERESTED_PRODUCTS = `
  query InterestedProducts($userId: ID!) {
    interestedProducts(userId: $userId) {
      id
      name
      price
      sellerName
      condition
      status
      category
      imageUrls
      interestedCount
      createdAt
    }
  }
`;

export const GET_INTERESTED_BUYERS = `
  query ProductInterest($productId: ID!) {
    productsByIds(ids: [$productId]) {
      id
      name
      interestedCount
      interestedBuyers {
        userId
        name
      }
    }
  }
`;

export const SELLER_PRODUCT_DETAIL = `
  query SellerProductDetail($productId: ID!) {
    sellerProductDetail(productId: $productId) {
      id
      name
      price
      description
      location
      sellerId
      sellerName
      createdAt
      updatedAt
      imageUrls
      hashtags
      interestedCount
      interestedBuyers {
        userId
        name
      }
    }
  }
`;
