import { Api } from "./api";

interface SandboxConfig {
  groupId: number;
  tableId: number;
  fieldId: number;
  groupAttribute: string;
}

interface SandboxResponse {
  id: number;
  group_id: number;
  table_id: number;
  field_id: number;
  group_attribute: string;
}

export const SandboxApi = Api.injectEndpoints({
  endpoints: (builder) => ({
    getSandbox: builder.query<SandboxResponse, { groupId: number; tableId: number }>({
      query: ({ groupId, tableId }) => ({
        method: "GET",
        url: `/api/sandbox/group/${groupId}/table/${tableId}`,
      }),
    }),
    createSandbox: builder.mutation<SandboxResponse, SandboxConfig>({
      query: ({ groupId, tableId, fieldId, groupAttribute }) => ({
        method: "POST",
        url: `/api/sandbox/group/${groupId}/table/${tableId}`,
        body: {
          field_id: fieldId,
          group_attribute: groupAttribute,
        },
      }),
    }),
    deleteSandbox: builder.mutation<void, { groupId: number; tableId: number }>({
      query: ({ groupId, tableId }) => ({
        method: "DELETE",
        url: `/api/sandbox/group/${groupId}/table/${tableId}`,
      }),
    }),
    getGroupSandboxes: builder.query<SandboxResponse[], { groupId: number }>({
      query: ({ groupId }) => ({
        method: "GET",
        url: `/api/sandbox/group/${groupId}`,
      }),
    }),
  }),
});

export const {
  useGetSandboxQuery,
  useCreateSandboxMutation,
  useDeleteSandboxMutation,
  useGetGroupSandboxesQuery,
} = SandboxApi;

// Legacy API interface for compatibility
export const SandboxApi_Legacy = {
  get: ({ groupId, tableId }: { groupId: number; tableId: number }) =>
    fetch(`/api/sandbox/group/${groupId}/table/${tableId}`)
      .then(response => response.ok ? response.json() : null),
  
  create: ({ groupId, tableId, fieldId, groupAttribute }: SandboxConfig) =>
    fetch(`/api/sandbox/group/${groupId}/table/${tableId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field_id: fieldId, group_attribute: groupAttribute }),
    }).then(response => response.json()),
  
  delete: ({ groupId, tableId }: { groupId: number; tableId: number }) =>
    fetch(`/api/sandbox/group/${groupId}/table/${tableId}`, {
      method: "DELETE",
    }),
};