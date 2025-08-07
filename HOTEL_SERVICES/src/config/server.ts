import dotenv from 'dotenv'
dotenv.config();



type Serverconfig = {
    PORT: Number,
     REDIS_PORT: number
    REDIS_HOST: string
}
type DBConfig = {
    DB_HOST: string,
    DB_USER: string,
    DB_PASSWORD: string,
    DB_NAME: string
   
}
export const dbConfig: DBConfig = {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '9214',
    DB_NAME: process.env.DB_NAME || 'test_db',

}
export const serverconfig: Serverconfig = {

    PORT: Number(process.env.PORT) || 3001,
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
    REDIS_HOST: process.env.REDIS_HOST || "localhost"
}