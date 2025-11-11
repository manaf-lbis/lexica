import { createApi } from "@reduxjs/toolkit/query/react";
import { basequery } from "../utils/baseQuery";

export const likesAndCommentApi = createApi({
    reducerPath: "likesAndCommentApi",
    baseQuery: basequery,
    tagTypes: ["Like", "Comment"],
    endpoints: (builder) => ({

        addComment: builder.mutation<any, { articleId: string, comment: string }>({
            query: ({ articleId, comment }) => ({
                url: `/interactions/${articleId}/comment`,
                method: "POST",
                body: { comment },
            }),
            invalidatesTags: ["Comment"],
        }),

        viewComments: builder.query<any, { articleId: string }>({
            query: ({ articleId }) => ({
                url: `/interactions/${articleId}/comments`,
                method: "GET",
            }),
            providesTags: ["Comment"],
            transformResponse: (response: any) => response.data
        }),

        addLike: builder.mutation<any, { articleId: string }>({
            query: ({ articleId }) => ({
                url: `/interactions/${articleId}/like`,
                method: "POST",
            }),
        }),
        
    }),
});

export const { 
    useAddCommentMutation,
    useViewCommentsQuery,
    useAddLikeMutation
} = likesAndCommentApi;