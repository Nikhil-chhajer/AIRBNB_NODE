import fs from 'fs/promises'
import path from 'path'
import Handlebars from 'handlebars';
import { InternalServerError } from '../utils/app.error';



export async function renderMailTemplate (templateId:string,params:Record<string,any>):Promise<string> {
    

    try {
       const templatePath=path.join(__dirname,'mailer',`${templateId}.hbs`);//source of the template file
    
        const content =await fs.readFile(templatePath, 'utf-8');//read the file content
        const finalTemplate = Handlebars.compile(content);
        return finalTemplate(params);//compile the template with the params


    } catch (error) {
        throw new InternalServerError("cant read file");
    }
        
} 