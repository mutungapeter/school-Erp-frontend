import { apiSlice } from "@/redux/api/apiSlice";
interface GetStreamsInterface {
  page?: number;
  page_size?: number;
}
export const termsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTerms: builder.query({
      query: ({ page, page_size }: GetStreamsInterface = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `terms/`,
          method: "GET",
          params: queryParams,
        };
      }
    }),
    getActiveTerms: builder.query({
      query: ({ page, page_size }: GetStreamsInterface = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `active-terms/`,
          method: "GET",
          params: queryParams,
        };
      }
    }),
    
  }),
});

export const { useGetTermsQuery, useGetActiveTermsQuery } = termsApi;
