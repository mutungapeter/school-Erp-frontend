import { apiSlice } from "@/redux/api/apiSlice";
interface GetStreamsInterface {
  page?: number;
  page_size?: number;
}
export const streamsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStreams: builder.query({
      query: ({ page, page_size }: GetStreamsInterface = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `streams/`,
          method: "GET",
          params: queryParams,
        };
      }
    }),
    createStream: builder.mutation({
        query: (data) => ({
          url: `streams/`,
          method: "POST",
          body: data,
        }),
      }),
    
  }),
});

export const { useGetStreamsQuery, useCreateStreamMutation } = streamsApi;
