import Redis from 'ioredis';
import { serverconfig } from './server';

function connectToRedis(){
    try {
        let connection :Redis;
        const redisConfig={
            port:serverconfig.REDIS_PORT,
            host:serverconfig.REDIS_HOST,
            maxRetriesPerRequest:null
        }
        return ()=>{
            if(!connection){
                connection=new Redis(redisConfig);
                return connection;
            }
            return connection;
        }

    } catch (error) {
         console.error('Error connecting to Redis:', error);
        throw error;
    }
}
export const getRedisConnObject=connectToRedis();