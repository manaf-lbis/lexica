import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import { profileApi } from "../api/profileApi";
import {articleApi} from "../api/articleApi";
import authReducer from "../slice/authSlice";

export const store = configureStore({
    reducer: {
        auth:authReducer,


        [authApi.reducerPath]: authApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [articleApi.reducerPath]: articleApi.reducer
    },

    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(
            authApi.middleware,
            profileApi.middleware,
            articleApi.middleware

        )
    }

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;