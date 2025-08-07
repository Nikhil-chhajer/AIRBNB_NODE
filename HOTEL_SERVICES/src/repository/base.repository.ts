import {CreationAttributes, Model, ModelStatic, WhereOptions} from 'sequelize'
import { InternalServerError } from '../utils/app.error';

abstract class BaseRepository<T extends Model>{
    protected model:ModelStatic<T> 
    constructor(model :ModelStatic<T>){
        this.model = model;

    }
    async findById(id:number):Promise<T| null>{
        console.log("the id is",id);
        const record = await this.model.findByPk(id);
        if(!record){
            return null;
        }
        return record;

    }
    async findAll():Promise<T[]>{
        const record = await this.model.findAll({});
        if(!record){
            return [];
        }
        return record;


    }
    async delete(whereOptions:WhereOptions<T>):Promise<void>{
        const record = await this.model.destroy({
            where:{
                ...whereOptions
            }
        });
        if(!record){
            throw new InternalServerError("resource not found")
        }
        return ;

    }
    async create(data:CreationAttributes<T>): Promise<T> {
        const instance = await this.model.create(data);
        return instance;
    }
    async updateById(id:number, data:Partial<T>):Promise<T | null>{
        const record=await this.model.findByPk(id);
        if(!record){
            throw new InternalServerError("resource not found")
        }
        Object.assign(record,data);
        await record.save();
        return record;

    }

}

export default BaseRepository;