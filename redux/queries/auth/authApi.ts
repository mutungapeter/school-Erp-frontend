
import { apiSlice } from "@/redux/api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";
import Cookies from "js-cookie";
import React from "react";


export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    login: builder.mutation({
      query: ({ username, password }) => ({
        url: `login/`,
        method: "POST",
        body: {
        username,
        password,
        },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          Cookies.set("accessToken", result.data.accessToken);
          Cookies.set("refreshToken", result.data.refreshToken);
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              refreshToken: result.data.refreshToken,
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  
  }),
});
export const {
 
  useLoginMutation,

} = authApi;
