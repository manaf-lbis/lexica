import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const basequery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
})