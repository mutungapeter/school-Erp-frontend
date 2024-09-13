import { apiSlice } from "@/redux/api/apiSlice";
interface GetClassesInterface {
  page?: number;
  page_size?: number;
}
export const formLevelsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFormLevels: builder.query({
      query: ({ page, page_size }: GetClassesInterface = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `form-levels/`,
          method: "GET",
          params: queryParams,
        };
      }
    }),
    createFormLevel: builder.mutation({
        query: (data) => ({
          url: `form-levels/`,
          method: "POST",
          body: data,
        }),
      }),
    
  }),
});

export const {useGetFormLevelsQuery, useCreateFormLevelMutation } = formLevelsApi;
