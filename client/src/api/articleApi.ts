import { createApi } from "@reduxjs/toolkit/query/react";
import { basequery } from "../utils/baseQuery";

export const articleApi = createApi({
    reducerPath: "articleApi",
    baseQuery: basequery,
    tagTypes: ["Article"],

    endpoints: (builder) => ({
        imageUpload: builder.mutation<string, string>({
            query: (image) => ({
                url: "/article/image-upload",
                method: "POST",
                body: { image },
            }),
            transformResponse: (response: any) => response?.data?.publicId
        }),

        getCategories: builder.query<any, any>({
            query: () => "/article/categories",
            transformResponse: (response: any) => response.data
        }),

        publish: builder.mutation<any, { title: string, about: string, content: string, category: string }>({
            query: (data) => ({
                url: "/article/publish",
                method: "POST",
                body: data,
            }),
        }),

        trendingArticles: builder.query<any, any>({
            query: () => "/article/trending",
            transformResponse: (response: any) => response.data
        }),

        getArticleById: builder.query<any, any>({
            query: (id) => `/article/${id}`,
            transformResponse: (response: any) => response.data
        }),

        myArticles: builder.query<any, { page: number; limit: number }>({
            query: ({ page, limit }) => ({
                url: "/article/my-articles",
                params: { page, limit },
            }),
            transformResponse: (response: any) => response.data,
            serializeQueryArgs: ({ endpointName }) => endpointName,
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page || currentArg?.limit !== previousArg?.limit;
            },
            providesTags: ["Article"],
        }),

        getArticleForEdit: builder.query<any, any>({
            query: (id) => `/article/edit/${id}`,
            transformResponse: (response: any) => response.data
        }),

        editArticle: builder.mutation<any, { _id: string, title: string, about: string, content: string, category: string }>({
            query: (data) => ({
                url: `/article/${data._id}/update`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Article"],
        }),

        articleVisiblity: builder.mutation<any, { _id: string, visibility: boolean }>({
            query: (data) => ({
                url: `/article/${data._id}/visibility`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Article"],
        }),



    }),
});


export const {
    useImageUploadMutation,
    useGetCategoriesQuery,
    usePublishMutation,
    useTrendingArticlesQuery,
    useGetArticleByIdQuery,
    useEditArticleMutation,
    useGetArticleForEditQuery,
    useArticleVisiblityMutation,
    useMyArticlesQuery
} = articleApi