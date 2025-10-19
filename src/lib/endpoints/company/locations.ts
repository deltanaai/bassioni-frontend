import { API_URL } from "@/constants";
import { fetchHandler } from "@/lib/handlers/fetch";

export const locationsEndpoints = {
  getAll: ({ payload }: { payload: PaginatedSearchPayload }) =>
    fetchHandler(`${API_URL}company/dashboard/locations/index`, {
      method: "POST",
      auth: true,
      body:
        payload && Object.keys(payload).length
          ? JSON.stringify(payload)
          : undefined,
    }),

  addLocation: ({ payload }: { payload: AddLocationPayload }) =>
    fetchHandler(`${API_URL}company/dashboard/locations`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),

  getById: ({ locationId }: GetLocationParams) =>
    fetchHandler(`${API_URL}company/dashboard/locations/${locationId}`, {
      method: "GET",
      auth: true,
    }),

  update: ({
    locationId,
    payload,
  }: {
    locationId: number;
    payload: UpdateLocationPayload;
  }) =>
    fetchHandler(`${API_URL}company/dashboard/locations/${locationId}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    }),

  delete: ({ payload }: { payload: DeleteLocationPayload }) =>
    fetchHandler(`${API_URL}company/dashboard/locations/delete`, {
      method: "DELETE",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
