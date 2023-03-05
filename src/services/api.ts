import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'
import { AuthTokenError } from './errors/AuthTokenError'

import { signOut } from '../contexts/AuthContext'
import {GetServerSidePropsContext} from "next";
import {ParsedUrlQuery} from "querystring";

export function setupAPIClient(ctx?: GetServerSidePropsContext){
  let cookies = parseCookies(ctx);
  const url = "https://manager-project-backend.vercel.app";
  //const url = "http://localhost:3333";
  if (url === undefined) {
    const message = `The environment variable "${url}" cannot be "undefined".`;
    throw new Error(message);
  }
  const api = axios.create({
    baseURL: url,
    headers: {
      Authorization: `Bearer ${cookies['@nextauth.token']}`
    }
  })

  api.interceptors.response.use((response: any) => {
    return response;
  }, (error: AxiosError) => {
    if(error.response!==undefined)
    if(error.response.status === 401){
      // qualquer erro 401 (nao autorizado) devemos deslogar o usuario
      if(typeof window !== undefined){
        // Chamar a funçao para deslogar o usuario
        signOut();
      }else{
        return Promise.reject(new AuthTokenError())
      }
    }

    return Promise.reject(error);

  })

  return api;

}