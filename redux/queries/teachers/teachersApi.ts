import { apiSlice } from "@/redux/api/apiSlice";
interface GetTeachersQueryArgs {
  page?: number;
  page_size?: number;
}
export const teachersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query({
      query: ({ page, page_size }: GetTeachersQueryArgs = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `teachers/`,
          method: "GET",
          params: queryParams,
        };
      }
    }),
    createTeacher: builder.mutation({
      query: (data) => ({
        url: `teachers/`,
        method: "POST",
        body: data,
      }),
    }),
    assignTeacherToSubjectsAndClasses: builder.mutation({
      query: (data) => ({
        url: `assign-teachers-to-subject/`,
        method: "POST",
        body: data,
      }),
    }),
    updateTeacherSubjects: builder.mutation({
      query: (data) => ({
        url: `assign-teachers-to-subject/`,
        method: "PUT",
        body: data,
      }),
    }),
    getTeacher: builder.query({
      query: (id: any) => ({
        url: `teachers/${id}/`,
        method: "GET",
      }),
    }),
    updateTeacher: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `teachers/${id}/`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteTeacher: builder.mutation({
      query: (id) => ({
        url: `teachers/${id}/`,
        method: "DELETE",
      }),
    }),    
    getTeacherSubjects: builder.query({
      query: (teacher_id: number) => ({
        url: `teacher-subjects/?teacher_id=${teacher_id}`,
        method: "GET",
      }),
    }),
    
  }),
});

export const { 
  useGetTeachersQuery, 
  useCreateTeacherMutation, 
  useUpdateTeacherMutation, 
  useGetTeacherQuery,
   useGetTeacherSubjectsQuery, 
   useAssignTeacherToSubjectsAndClassesMutation, 
   useUpdateTeacherSubjectsMutation,
   useDeleteTeacherMutation,
  } = teachersApi;
