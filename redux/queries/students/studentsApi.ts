import { apiSlice } from "@/redux/api/apiSlice";
interface GetStudentsBySubjectAndClassParams {
  subject_id: any;
  class_level_id: any;
    
}
interface GetSubjectsQueryArgs {
  page?: number;
  page_size?: number;
}
export const studentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: ({ page, page_size }: GetSubjectsQueryArgs = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `students/`,
          method: "GET",
          params: queryParams,
        };
      }
    }),
    createStudent: builder.mutation({
      query: (data) => ({
        url: `students/`,
        method: "POST",
        body: data,
      }),
    }),
    getStudentsBySubjectAndClass: builder.query({
      query: (params: { subject_id: any; class_level_id: any;   admission_number?: any }) => {
        const queryParams: { subject_id: any; class_level_id: any;   admission_number?: any } = {
          subject_id: params.subject_id,
          class_level_id: params.class_level_id,
        };
    
      
        if (params.admission_number) {
          queryParams.admission_number = params.admission_number;
        }
    
       
        return {
          url: `filter-students/`,
          method: "GET",
          params: queryParams,
        };
      }
    }),

    
    
  }),
});

export const {useGetStudentsQuery, useGetStudentsBySubjectAndClassQuery, useCreateStudentMutation } = studentsApi;
