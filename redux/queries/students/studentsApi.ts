import { apiSlice } from "@/redux/api/apiSlice";
interface GetStudentsBySubjectAndClassParams {
  subject_id: any;
  class_level_id: any;
    
}
interface GetSubjectsQueryArgs {
  page?: number;
  page_size?: number;
  subject_id: any;
  class_level_id: any;
  admission_number?: any;
}
export const studentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: ({
        page,           
        page_size,     
        class_level_id,
        admission_number,
      }: GetSubjectsQueryArgs) => {
        const queryParams: Record<string, any> = {}; 

        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (class_level_id) queryParams.class_level_id = class_level_id;
        if (admission_number) queryParams.admission_number = admission_number;

        return {
          url: `students/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
 
    createStudent: builder.mutation({
      query: (data) => ({
        url: `students/`,
        method: "POST",
        body: data,
      }),
    }),
    promoteStudents: builder.mutation({
      query: (data) => ({
        url: `promote-students/`,
        method: "POST",
        body: data,
      }),
    }),
   
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `students/${id}/`,
        method: "DELETE",
      }),
    }),  
    updateStudent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `students/${id}/`,
        method: "PUT",
        body: data,
      }),
    }),  
    getStudent: builder.query({
      query: (id) => ({
        url: `students/${id}/`,
        method: "GET",
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

    assignElectiveSubjects: builder.mutation({
      query: (data) => ({
        url: `assign-electives/`,
        method: "POST",
        body: data,
      }),
    }),
    updateAssignedElectiveSubjects: builder.mutation({
      query: (data) => ({
        url: `assign-electives/`,
        method: "PUT",
        body: data,
      }),
    }),  
    
  }),
});

export const {useGetStudentsQuery,usePromoteStudentsMutation, useAssignElectiveSubjectsMutation, useUpdateAssignedElectiveSubjectsMutation, useUpdateStudentMutation, useDeleteStudentMutation, useGetStudentQuery, useGetStudentsBySubjectAndClassQuery, useCreateStudentMutation } = studentsApi;
