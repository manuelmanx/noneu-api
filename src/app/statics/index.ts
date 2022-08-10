
import * as fs from "fs";

export enum $TemplatePathEnum {
    "emails"="emails",
    "pages"="pages"
};

export default async function readFileFromStatics(path:$TemplatePathEnum, fileName:string):Promise<string>{
    return new Promise((res:any,rej:any)=>{
        fs.readFile(`src/app/statics/${path}/${fileName}`,'utf-8',(err, resp)=>{
            if(err) throw new Error("Email reading error");
            res(resp);
        })
    })
}

/**
 * This method will change default parameters of email to new custom values.
 * @param emailFileName file name of the email to send in (templates/emails).
 * @param context email fields to change.
 */
export async function buildEmailHtmlContext(fileName:string, context:any):Promise<string>{
    /** Load the html string from templates */
    let html:string = await readFileFromStatics($TemplatePathEnum.emails,fileName);
    Object.keys(context).forEach((key:string)=>{
        html = html.replace(`{{${key}}}`, context[key]);
    })
    return html;
}

/**
 * Build the context for web pages.
 * @param fileName 
 * @param context 
 * @returns 
 */
export async function buildPageHtmlContext(fileName:string, context:any):Promise<string>{
    /** Load the html string from templates */
    let html:string = await readFileFromStatics($TemplatePathEnum.pages,fileName);
    Object.keys(context).forEach((key:string)=>{
        html = html.replace(`{{${key}}}`, context[key]);
    })
    return html;
}