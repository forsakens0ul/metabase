import { createApi } from "metabase/api";

export const sandboxApi = createApi({
  reducerPath: "sandbox",
  endpoints: (build) => ({
    getSandboxPolicies: build.query({
      query: () => ({
        url: "/api/sandbox",
        method: "GET",
      }),
    }),
    getSandboxPolicy: build.query({
      query: (id) => ({
        url: `/api/sandbox/${id}`,
        method: "GET",
      }),
    }),
    createSandboxPolicy: build.mutation({
      query: (policy) => ({
        url: "/api/sandbox",
        method: "POST",
        body: policy,
      }),
    }),
    updateSandboxPolicy: build.mutation({
      query: ({ id, policy }) => ({
        url: `/api/sandbox/${id}`,
        method: "PUT",
        body: policy,
      }),
    }),
    deleteSandboxPolicy: build.mutation({
      query: (id) => ({
        url: `/api/sandbox/${id}`,
        method: "DELETE",
      }),
    }),
    getGroups: build.query({
      query: () => ({
        url: "/api/permissions/group",
        method: "GET",
      }),
    }),
    getTables: build.query({
      query: () => ({
        url: "/api/table",
        method: "GET",
      }),
    }),
  }),
});
