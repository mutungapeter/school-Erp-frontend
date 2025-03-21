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
    uploadMarks: builder.mutation({
     query: (formData) => ({
        url: `upload-marks/`, 
        method: 'POST',
        body: formData, 
      }),

    }),
    getMarksData: builder.query({
      query: (params: {  class_level?: any; term:any;     admission_number?: any; subject?:any; exam_type?:any; }) => {
        const queryParams: { class_level: any; term: any; admission_number?: any; subject?:any; } = {
          term: params.term,
          ...(params.exam_type && {exam_type: params.exam_type}),
          ...(params.class_level && { class_level: params.class_level}),
          ...(params.admission_number && { admission_number: params.admission_number }),
          ...(params.subject && { subject: params.subject }), 
        };
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
    deleteMarks: builder.mutation({
      query: (data) => ({
      
        url: `marks/`,
        method: "DELETE",
        body: data
      }),
    }),  
    
  }),
});

export const {
   useRecorMarkMutation,
   useUploadMarksMutation,
   useGetMarksDataQuery,
   useGetMarkDataQuery,
   useUpdateMarksDataMutation,
   useDeleteMarksDataMutation,
   useDeleteMarksMutation,
    } = marksApi;
