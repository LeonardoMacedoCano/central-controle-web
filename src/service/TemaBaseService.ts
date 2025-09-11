import DefaultService from "./DefaultService";
import { Tema } from "../types";

interface TemaBaseApi {
  getTema: (token: string, id: string | number) => Promise<Tema | undefined>;
  getTemas: (token: string) => Promise<Tema[] | undefined>;
  getTemaPadrao: () => Promise<Tema | undefined>;
}

const TemaBaseService = (): TemaBaseApi => {
  const { request } = DefaultService();

  const getTema = async (token: string, id: string | number): Promise<Tema | undefined> => {
      try {
        return await request<Tema>('get', `tema/${id}`, token);
      } catch (error) {
        return undefined;
      }
    };

  const getTemas = async (token: string): Promise<Tema[] | undefined> => {
    try {
      return await request<Tema[]>('get', `tema`, token);
    } catch (error) {
      return undefined;
    }
  };

  const getTemaPadrao = async (): Promise<Tema | undefined> => {
    try {
      return await request<Tema>('get', `tema/default`);
    } catch (error) {
      return undefined;
    }
  };

  return {
    getTema,
    getTemas,
    getTemaPadrao
  };
};

export default TemaBaseService;