import { apiSlice } from "@/redux/api/apiSlice";
interface GetSubjectsQueryArgs {
  page?: number;
  page_size?: number;
}
export const subjectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query({
      query: ({ page, page_size }: GetSubjectsQueryArgs = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `subjects/`,
          method: "GET",
          params: queryParams,
        };
      }

    }),
    
  }),
});

export const {useGetSubjectsQuery } = subjectsApi;
