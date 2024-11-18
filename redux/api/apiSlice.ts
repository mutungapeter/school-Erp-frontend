import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
    prepareHeaders: (headers) => {
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");
     
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      if (refreshToken) {
        headers.set("x-refresh-token", refreshToken);
      }
      return headers;
    },
    credentials: 'include',
  }),
  endpoints: (builder) => ({
  }),
});

export const { } = apiSlice;
