import { apiSlice } from "@/redux/api/apiSlice";
interface GetStudentsBySubjectAndClassParams {
  subject_id: any;
  class_level_id: any;
}
interface GetStudentsQueryArgs {
  page?: number;
  page_size?: number;
  class_level_id?: any;
  admission_number?: any;
}
interface GetAlumins {
  page?: number;
  page_size?: number;
  graduation_year: any;
}
interface GetPromotionRecords {
  page?: number;
  page_size?: number;
  year: any;
  source_class_level: any;
}
interface GetStudentPerformance {
  id: number;
  term_id?:any;
  
}
interface GetStudentSubjects {
  student_id: any;
  class_level?:any;
  
}
export const studentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: ({
        page,
        page_size,
        class_level_id,
        admission_number,
      }: GetStudentsQueryArgs = {}) => {
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
    getStudentPerformance: builder.query({
      query: ({
        id,
        term_id
      }: GetStudentPerformance) => {
       
        return {
          url: `students/${id}/performance/`,
          method: "GET",
          params: term_id ? { term_id } : {},
        };
      },
    }),
    getStudentSubjects: builder.query({
      query: ({
        student_id,
        class_level
      }: GetStudentSubjects) => {
        const queryParams: Record<string, any> = {};

       
        if (student_id) queryParams.student_id = student_id;
        if (class_level) queryParams.class_level = class_level;
        return {
          url: `student-subjects-list/`,
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
    uploadStudents: builder.mutation({
      query: (formData) => ({
         url: `upload-students/`, 
         method: 'POST',
         body: formData, 
       }),
 
     }),
    promoteStudents: builder.mutation({
      query: (data) => ({
        url: `promote-students/`,
        method: "POST",
        body: data,
      }),
    }),
    promoteStudentsToAlumni: builder.mutation({
      query: (data) => ({
        url: `promote-students-to-alumni/`,
        method: "POST",
        body: data,
      }),
    }),
    promoteStudentsToNextTerm: builder.mutation({
      query: (data) => ({
        url: `promote-students-to-next-term/`,
        method: "POST",
        body: data,
      }),
    }),
    getAlumniRecords: builder.query({
      query: ({ page, page_size, graduation_year }: GetAlumins) => {
        const queryParams: Record<string, any> = {};

        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (graduation_year) queryParams.graduation_year = graduation_year;

        return {
          url: `promote-students-to-alumni/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    getPromotionRecords: builder.query({
      query: ({ page, page_size, year, source_class_level }: GetPromotionRecords) => {
        const queryParams: Record<string, any> = {};

        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (source_class_level) queryParams.source_class_level = source_class_level;
        if (year) queryParams.year = year;

        return {
          url: `promote-students/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `students/${id}/`,
        method: "DELETE",
      }),
    }),
    deleteStudents: builder.mutation({
      query: (data) => ({
      
        url: `students/`,
        method: "DELETE",
        body: data
      }),
    }),
    updateStudent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `students/${id}/`,
        method: "PUT",
        body: data,
      }),
    }),
    editStudent: builder.query({
      query: (id) => ({
        url: `students/${id}/`,
        method: "GET",
      }),
    }),
    getStudent: builder.query({
      query: (params: { id: number; class_level_id?: any }) => {
        const queryParams: { id: number; class_level_id?: any } = {
          id: params.id,
        };
        
     
        if (params.class_level_id) {
          queryParams.class_level_id = params.class_level_id;
        }
    
        return {
          url: `students/${params.id}/`, 
          method: "GET",
          params: queryParams,  
        };
      },
    }),
    
    getStudentsBySubjectAndClass: builder.query({
      query: (params: {
        subject_id: any;
        class_level_id: any;
        term_id: any;
        admission_number?: any;
      }) => {
        const queryParams: {
          subject_id: any;
          class_level_id: any;
          term_id: any;
          admission_number?: any;
        } = {
          subject_id: params.subject_id,
          class_level_id: params.class_level_id,
          term_id: params.term_id,
        };
        if (params.admission_number) {
          queryParams.admission_number = params.admission_number;
        }
        return {
          url: `filter-students/`,
          method: "GET",
          params: queryParams,
        };
      },
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

export const {
  useGetStudentsQuery,
  usePromoteStudentsMutation,
  usePromoteStudentsToAlumniMutation,
  useAssignElectiveSubjectsMutation,
  useUpdateAssignedElectiveSubjectsMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetStudentQuery,
  useGetStudentsBySubjectAndClassQuery,
  useCreateStudentMutation,
  useGetAlumniRecordsQuery,
  useGetPromotionRecordsQuery,
  useGetStudentPerformanceQuery,
  useUploadStudentsMutation,
  useDeleteStudentsMutation,
  usePromoteStudentsToNextTermMutation,
  useEditStudentQuery,
  useGetStudentSubjectsQuery
} = studentsApi;
