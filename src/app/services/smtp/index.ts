import Mailjet from "node-mailjet";
import readFile, { $TemplatePathEnum } from "../../statics";
import loadEnv from "../env";
const env = loadEnv()
const mailjet = Mailjet.apiConnect(env.SMTP_API_KEY,env.SMTP_SECRET_KEY)

/**
 * This method will 
 * @param senderEmail Email of the sender
 * @param html Html Body of the email.
 * @param subject 
 * @param reciverEmail 
 * @param customID 
 */
export function sendSimpleEmail(senderEmail:string, html:string, subject:string, reciverEmail:string, customID:string){
    return new Promise((res,rej)=>{
        const request = mailjet.post("send", {version:'v3.1'}).request({
            Messages:[
                {
                    From:{
                        Email: senderEmail
                    },
                    To:[
                        {
                            Email: reciverEmail
                        }
                    ],
                    Subject: subject,
                    HtmlPart: html,
                    CustomID: customID
                }
            ]
        })
        request.then((result)=>{
            res(result.response)
        }).catch(err=>{
            rej({status:err.status})
        })
    })
    
}
