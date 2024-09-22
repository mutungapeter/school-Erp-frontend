import { apiSlice } from "@/redux/api/apiSlice";
interface GetSubjectsQueryArgs {
  page?: number;
  page_size?: number;
}
export const subjectCategories = apiSlice.injectEndpoints({
  endpoints: (builder) => ({


    getSubjectCategories: builder.query({
      query: ({ page, page_size }: GetSubjectsQueryArgs = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `subject-categories/`,
          method: "GET",
          params: queryParams,
        };
      }

    }),
    
    
  }),
});

export const { useGetSubjectCategoriesQuery } = subjectCategories;
