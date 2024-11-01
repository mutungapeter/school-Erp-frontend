import { apiSlice } from "@/redux/api/apiSlice";

export const reportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
   getReportForms: builder.query({
      query: (params: {  class_level: any; term:any;   admission_number?: any }) => {
        const queryParams: { class_level: any; term: any; admission_number?: any } = {
          class_level: params.class_level,
          term: params.term,  
          ...(params.admission_number && { admission_number: params.admission_number })  
        };
        return {
          url: `reports/`,
          method: "GET",
          params: queryParams,
        };
      }
    }),
    
    
    
  }),
});

export const {
   useGetReportFormsQuery
    } = reportsApi;
