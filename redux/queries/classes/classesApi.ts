import { apiSlice } from "@/redux/api/apiSlice";
interface GetClassesInterface {
  page?: number;
  page_size?: number;
}
export const classesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query({
      query: ({ page, page_size }: GetClassesInterface = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `class-levels/`,
          method: "GET",
          params: queryParams,
        };
      }
    }),
    createClass: builder.mutation({
      query: (data) => ({
        url: `class-levels/`,
        method: "POST",
        body: data,
      }),
    }),
  
  }),
});

export const {useGetClassesQuery, useCreateClassMutation } = classesApi;
