import { apiSlice } from "@/redux/api/apiSlice";

export const marksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    recorMark: builder.mutation({
      query: (data) => ({
        url: `marks/`,
        method: "POST",
        body: data,
      }),
    }),
    getMarksData: builder.query({
      query: (params: { subject: any; class_level: any;   admission_number?: any }) => {
        const queryParams: { subject: any; class_level: any;   admission_number?: any } = {
          subject: params.subject,
          class_level: params.class_level,
        };
    
      
        if (params.admission_number) {
          queryParams.admission_number = params.admission_number;
        }
    
       
        return {
          url: `filter-marks/`,
          method: "GET",
          params: queryParams,
        };
      }
    }),
    
    updateMarksData: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `marks/${id}/`,
        method: "PUT",
        body: data,
      }),
    }),  
    getMarkData: builder.query({
      query: (id) => ({
        url: `marks/${id}/`,
        method: "GET",
      }),
    }),  
    deleteMarksData: builder.mutation({
      query: (id) => ({
        url: `marks/${id}/`,
        method: "DELETE",
      }),
    }), 
    
  }),
});

export const {
   useRecorMarkMutation,
   useGetMarksDataQuery,
   useGetMarkDataQuery,
   useUpdateMarksDataMutation,
   useDeleteMarksDataMutation,
    } = marksApi;
