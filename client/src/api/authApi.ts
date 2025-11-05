import { createApi } from "@reduxjs/toolkit/query/react";
import { basequery } from "../utils/baseQuery";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: basequery,
    endpoints: (builder) => ({

        validateUser: builder.query({
            query: () => "/auth/validate",
            keepUnusedDataFor: 0,
        }),

        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
        }),

        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),

        forgotPassword: builder.mutation({
            query: (email) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body: email,
            }),
        }),

        signup: builder.mutation({
            query: (userData) => ({
                url: "/auth/signup",
                method: "POST",
                body: userData,
            }),
        }),

        verifySignupOtp: builder.mutation({
            query: (otpData: { otp: string }) => ({
                url: "/auth/verify-otp",
                method: "POST",
                body: otpData,
            }),
        }),

        resentOtp: builder.mutation({
            query: (email) => ({
                url: "/auth/resent-otp",
                method: "POST",
                body: { email },
            }),
        }),

    })

})

export const {
    useValidateUserQuery,
    useLoginMutation,
    useLogoutMutation,
    useForgotPasswordMutation,
    useSignupMutation,
    useVerifySignupOtpMutation,
    useResentOtpMutation
} = authApi;


