import { apiSlice } from "@/redux/api/apiSlice";
interface GetStudentsBySubjectAndClassParams {
  subject_id: any;
  class_level_id: any;
  stream_id?: any;  
}
export const streamsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStreams: builder.query({
      query: () => {
       
        return {
          url: `streams/`,
          method: "GET",
          
        };
      }  
    }),
    
    
    
  }),
});

export const { useGetStreamsQuery } = streamsApi;
