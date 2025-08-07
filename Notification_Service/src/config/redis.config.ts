import Redis from 'ioredis';
import { serverConfig } from './server';






function connectToRedis() {
    try {

let connection: Redis;
        
     
        const redisConfig = {
            port: serverConfig.REDIS_PORT,
            host: serverConfig.REDIS_HOST,
            maxRetriesPerRequest :null, // Disable automatic retries
        }
        return () => {
            if (!connection) {
                connection = new Redis(redisConfig);
             
                return connection;
            }
            console.log('Connecting to Redis...');

            return connection;
        }


    } catch (error) {
        console.error('Error connecting to Redis:', error);
        throw error;
    }
}

export const getRedisConnObject = connectToRedis(); 
