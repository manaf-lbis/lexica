import { createApi } from "@reduxjs/toolkit/query/react";
import { basequery } from "../utils/baseQuery";

export const articleApi = createApi({
    reducerPath: "articleApi",
    baseQuery: basequery,

    endpoints: (builder) => ({
        imageUpload: builder.mutation<string, string>({
            query: (image) => ({
                url: "/article/image-upload",
                method: "POST",
                body: {image},
            }),
            transformResponse: (response:any) => response?.data?.publicId
        }),

        getCategories: builder.query<any, any>({
            query: () => "/article/categories",
            transformResponse: (response:any) => response.data
        }),

        publish: builder.mutation<any, { title: string, about: string, content: string, category: string }>({
            query: (data) => ({
                url: "/article/publish",
                method: "POST",
                body: data,
            }),
        }),



    }),
});


export const {
    useImageUploadMutation,
    useGetCategoriesQuery,
    usePublishMutation
} = articleApi