export const productRoutes={
    ADD_PRODUCT:"/add-product",
    GET_ALL_PRODUCTS:"/",
    GET_PRODUCT:"/get-product",
    GET_PRODUCTS_BY_SELLER:"/get-products-by-seller",
    UPDATE_PRODUCT:"/update-product",
    DELETE_PRODUCT:"/delete-product",
    SEARCH_PRODUCTS:"/search-products",
    MARK_AS_SOLD:"/mark-sold",
}

export const userRoutes={
    REGISTER_USER:"/register",
    LOGIN_USER:"/login",
    GET_USER_PROFILE:"/profile",
    UPDATE_USER_PROFILE:"/update-profile",
    CHANGE_PASSWORD:"/change-password",
    GET_ALL_USERS:"/",
    DELETE_USER:"/delete-user",
    VERIFY_OTP:"/verify-otp",
    RESEND_OTP:"/resend-otp",
    GOOGLE_AUTH:"/google-auth",
    FORGOT_PASSWORD:"/forgot-password",
    RESET_PASSWORD:"/reset-password",
}

export const categoryRoutes={
    CREATE_CATEGORY:"/add-category",
    GET_ALL_CATEGORIES:"/",
    GET_CATEGORY_BY_ID:"/get-category",
    UPDATE_CATEGORY:"/update-category",
    DELETE_CATEGORY:"/delete-category",
}

export const messageRoutes={
    SEND_MESSAGE:"/send-message",
    GET_MESSAGES_BETWEEN_USERS:"/get-messages-between-users",
    GET_MESSAGES_BY_PRODUCT:"/get-messages-by-product",
    DELETE_MESSAGE:"/delete-message",
    MARK_AS_READ:"/mark-as-read",
    GET_UNREAD_COUNT:"/get-unread-count",
    GET_USER_CONVERSATIONS:"/get-conversations",
}

export const favoriteRoutes={
    ADD_TO_FAVORITES:"/add/:productId",
    REMOVE_FROM_FAVORITES:"/remove/:productId",
    TOGGLE_FAVORITE:"/toggle/:productId",
    GET_USER_FAVORITES:"/",
    GET_RECENT_FAVORITES:"/recent",
    GET_FAVORITES_COUNT:"/count",
    CHECK_FAVORITE_STATUS:"/check/:productId",
    CHECK_MULTIPLE_FAVORITES:"/check-multiple",
    CLEAR_ALL_FAVORITES:"/clear",
}