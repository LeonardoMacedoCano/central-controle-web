export interface MicroserviceConfig {
  url: string;
  port: number;
}

export const MICROSERVICES: Record<string, MicroserviceConfig> = {
  usuario: { url: '/api/usuario', port: 8080 },
  fluxocaixa: { url: '/api/fluxocaixa', port: 8081 },
};

export type MicroserviceKey = keyof typeof MICROSERVICES;
