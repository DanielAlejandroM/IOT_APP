import apiClient from "./apiClient";
import { AlertsResponse } from "../types/alerts";

export const getNearbyAlerts = async (
  token: string,
  lat: number,
  lng: number
) => {
  const response = await apiClient.get<AlertsResponse>("/alerts/nearby", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      lat,
      lng,
    },
  });

  return response.data;
};