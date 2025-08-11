import dotenv from 'dotenv'
dotenv.config();



type Serverconfig={
    PORT:Number
    REDIS_SERVER_URL:string,
    TTL:number,
    HOTEL_SERVICE_URL:string
}
type DBConfig={
    DB_HOST:string,
    DB_USER:string,
    DB_PASSWORD:string,
    DB_NAME:string
}
export const dbConfig:DBConfig={
    DB_HOST:process.env.DB_HOST||'localhost',
    DB_USER:process.env.DB_USER||'root',
    DB_PASSWORD:process.env.DB_PASSWORD||'9214',
    DB_NAME:process.env.DB_NAME||'test_db'
}
export const serverconfig:Serverconfig={

    PORT:Number(process.env.PORT)||3001,
    REDIS_SERVER_URL:process.env.REDIS_SERVER_URL||'redis://localhost:6379',
    TTL:Number(process.env.TTL)||50000,
    HOTEL_SERVICE_URL:process.env.HOTEL_SERVICE_URL||'http://localhost:3000/api/v1/'
}