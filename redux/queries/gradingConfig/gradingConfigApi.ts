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
    getGradinConfig: builder.query({
      query: (id) => ({
        url: `grading-configs/${id}/`,
        method: "GET",
      }),
    }), 
  
    createGradingConfig: builder.mutation({
        query: (data) => ({
          url: `grading-configs/`,
          method: "POST",
          body: data,
        }),
      }),
      updateConfig: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `grading-configs/${id}/`,
        method: "PUT",
        body: data,
      }),
    }), 
      deleteConfig: builder.mutation({
        query: (id) => ({
          url: `grading-configs/${id}/`,
          method: "DELETE",
        }),
      }),  
    
  }),
});

export const {  
  useGetGradingConfigsQuery, 
  useGetGradinConfigQuery, 
  useUpdateConfigMutation,
  useCreateGradingConfigMutation,
  useDeleteConfigMutation,
} = gradingConfigApi;
