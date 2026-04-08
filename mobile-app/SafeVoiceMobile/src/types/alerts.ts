export interface AlertUser {
  id: number;
  nombre: string;
  email: string;
}

export interface AlertItem {
  id: number;
  event_type: string;
  alert_type: "rojo" | "naranja" | string;
  lat: number;
  lng: number;
  timestamp: string;
  usuario: AlertUser;
}

export interface AlertsResponse {
  total: number;
  radio_metros: number;
  resultados: AlertItem[];
}