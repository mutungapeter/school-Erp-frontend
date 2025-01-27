import { apiSlice } from "@/redux/api/apiSlice";

interface GetClassPerformance {
 
  class_level_id?: any;
  term_id?:any;
  exam_type?: string;
}

export const studentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClassPerformance: builder.query({
      query: ({
       
        class_level_id,
        term_id,
        exam_type,
      }: GetClassPerformance = {}) => {
        const queryParams: Record<string, any> = {};

       if (class_level_id){
         queryParams.class_level_id = class_level_id;
        }
        if (term_id) {
          queryParams.term_id = term_id;
        }
        if (exam_type) {
          queryParams.exam_type = exam_type;
        }
        
        return {
          url: `class-performance/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
   
  }),
});

export const {
  useGetClassPerformanceQuery
 
} = studentsApi;
