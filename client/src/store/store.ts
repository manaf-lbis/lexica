import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import { profileApi } from "../api/profileApi";
import {articleApi} from "../api/articleApi";
import { likesAndCommentApi } from "../api/likesAndCommentApi";
import authReducer from "../slice/authSlice";

export const store = configureStore({
    reducer: {
        auth:authReducer,


        [authApi.reducerPath]: authApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [articleApi.reducerPath]: articleApi.reducer,
        [likesAndCommentApi.reducerPath]: likesAndCommentApi.reducer
    },

    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(
            authApi.middleware,
            profileApi.middleware,
            articleApi.middleware,
            likesAndCommentApi.middleware

        )
    }

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;