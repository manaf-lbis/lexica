import { createApi } from "@reduxjs/toolkit/query/react";
import { basequery } from "../utils/baseQuery";

export interface ProfileData {
    name: string;
    email: string;
    dateOfBirth: string; 
    aboutMe?: string;
    avatar?: string | null;
    categories?: string[];
}

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: basequery,
    tagTypes: ["Profile"],
    endpoints: (builder) => ({

        getProfile: builder.query<ProfileData, void>({
            query: () => "/profile",
            keepUnusedDataFor: 0,
            transformResponse: (response: { data: ProfileData }) => response.data,
            providesTags: ["Profile"],
        }),

        updateProfile: builder.mutation<ProfileData, Partial<ProfileData>>({
            query: (data) => ({
                url: "/profile",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Profile"],
        }),

        updateAvatar: builder.mutation<ProfileData, { avatar: string }>({
            query: (data) => ({
                url: "/profile/avatar",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Profile"],
        }),
    }),
});

export const { useGetProfileQuery, useUpdateProfileMutation, useUpdateAvatarMutation } = profileApi;