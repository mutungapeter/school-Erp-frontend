import { apiSlice } from "@/redux/api/apiSlice";

interface PaginationArguments {
  page?: number;
  page_size?: number;
}
export const gradingConfigApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGradingConfigs: builder.query({
      query: ({ page, page_size }: PaginationArguments = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `grading-configs/`,
          method: "GET",
          params: queryParams,
        };
      }
    }),
    createGradingConfig: builder.mutation({
        query: (data) => ({
          url: `grading-configs/`,
          method: "POST",
          body: data,
        }),
      }),
    
  }),
});

export const {  useGetGradingConfigsQuery, useCreateGradingConfigMutation} = gradingConfigApi;
