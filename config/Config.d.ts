/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    port: number
    database: Database
    authToken: AuthToken
  }
  interface AuthToken {
    secret: string
    expiration: number
  }
  interface Database {
    database: string
    username: string
    password: string
    host: string
    dialect: string
    logging: boolean
  }
  export const config: Config
  export type Config = IConfig
}
