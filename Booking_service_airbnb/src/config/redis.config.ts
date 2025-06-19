import IORedis from 'ioredis';
import Redlock from 'redlock';
import { Redis } from 'ioredis';
import { serverconfig } from './server';

// export const redisClient =new IORedis(serverconfig.REDIS_SERVER_URL);
// //this is client which us to connect to redis server

function connectToRedis() {
    try {

let connection: Redis;
        
     
        return () => {
            if (!connection) {
                connection = new IORedis(serverconfig.REDIS_SERVER_URL);
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


//redlock is alogrithm which is used to create distributed locks
//here we will have redlock on redis client
export const redlock = new Redlock([getRedisConnObject()], {
  driftFactor: 0.01, // time in ms
  retryCount: 10,
  retryDelay: 200, // time in ms
  retryJitter: 200 // time in ms
}); 

