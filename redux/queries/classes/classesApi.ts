import { apiSlice } from "@/redux/api/apiSlice";
interface GetClassesInterface {
  page?: number;
  page_size?: number;
}
interface GetAllClassesInterface {
  page?: number;
  page_size?: number;
  calendar_year?: any;
}
export const classesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query({
      query: ({ page, page_size }: GetClassesInterface = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `class-levels/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    getAllActiveClasses: builder.query({
      query: ({ page, page_size }: GetClassesInterface = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `all-active-class-levels/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    getAllClasses: builder.query({
      query: ({ page, page_size,calendar_year }: GetAllClassesInterface = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (calendar_year) queryParams.calendar_year = calendar_year;

        return {
          url: `all-class-levels/`,
          method: "GET",
          params: queryParams,
          
        };
      },
    }),
    getCurrentCompletedClassesWaitingPromotiong: builder.query({
      query: () => {
        return {
          url: `current-class-levels/`,
          method: "GET",
        };
      },
    }),
    getTargetCLassesReadyForStudentPromotion: builder.query({
      query: () => {
        return {
          url: `target-class-levels/`,
          method: "GET",
        };
      },
    }),
    getGraduatingClasses: builder.query({
      query: ({ page, page_size }: GetClassesInterface = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `graduating-classes/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    createClass: builder.mutation({
      query: (data) => ({
        url: `class-levels/`,
        method: "POST",
        body: data,
      }),
    }),
    getCLassLevel: builder.query({
      query: (id) => ({
        url: `class-levels/${id}/`,
        method: "GET",
      }),
    }),
    updateClassLevel: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `class-levels/${id}/`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteCLassLevel: builder.mutation({
      query: (id) => ({
        url: `class-levels/${id}/`,
        method: "DELETE",
      }),
    }),
    deleteClassLevels: builder.mutation({
      query: (data) => ({
        url: `class-levels/`,
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetAllActiveClassesQuery,
  useGetAllClassesQuery,
  useGetCLassLevelQuery,
  useUpdateClassLevelMutation,
  useDeleteCLassLevelMutation,
  useGetGraduatingClassesQuery,
  useCreateClassMutation,
  useDeleteClassLevelsMutation,
  useGetCurrentCompletedClassesWaitingPromotiongQuery,
  useGetTargetCLassesReadyForStudentPromotionQuery,
} = classesApi;
