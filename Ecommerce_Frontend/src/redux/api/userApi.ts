import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "./../store.ts";

export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/user/`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<string,number>({
      query: (user) =>( {
        url: "new",
        method: "POST",
        body: user,
      }),
    }),
  }),
})
