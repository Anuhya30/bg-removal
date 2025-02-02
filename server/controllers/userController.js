import {WebHook} from 'svix'
import userModel from '../models/userModel'

//API Controller Function to manage clerk user with database
//https://localhost:4000/api/user/webhooks
const clerkWebhooks=async(req,res)=>{


    try{
        const whook =new WebHook(process.env.CLERK_WEBHOOK_SECRET)
        await whook.verfy(JSON.stringify(req.body),{
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"]
        })
         const {data,type}=req.body
         switch (type){
            case "user.created":{

                const userData={
                    clerkId:data.id,
                    email:data.email_addresses[0].email_addresses,
                    firstName:data.first_name,
                    lastName:data.last_name,
                    photo:data.image_url
                }
                await userModel.create(userData)
                res.json({})
                break;
            }
            case "user.updated":{

                const userData={
                   
                    email:data.email_addresses[0].email_addresses,
                    firstName:data.first_name,
                    lastName:data.last_name,
                    photo:data.image_url
                }
                await userModel.findOneAndUpdate({clerkId:data.id},userData)
                res.json({})
                break;
            }
            case "user.deleted":{ 
                await userModel.findOneAndDelete({clerkid:data.id})
                res.json({})
                break;
         }
        }
    }catch(error){
        console.log(error.message)
        res,json({success:false,message:error.message})
    }

}

export {clerkWebhooks}