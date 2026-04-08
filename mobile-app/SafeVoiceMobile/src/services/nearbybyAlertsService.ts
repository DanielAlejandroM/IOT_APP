import apiClient from "./apiClient";
import { AlertsResponse } from "../types/alerts";

export const getNearbyAlerts = async (token: string) => {
  const response = await apiClient.get<AlertsResponse>("/alerts/nearby", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};