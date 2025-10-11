import nodemailer from "nodemailer";
import dotenv from "dotenv";

export const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
    }
})

export const sendEmail=async(receiverEmail,subject,html)=>{
    try{
        const mailOptions={
            from: `"MyApp" <${process.env.EMAIL_USER}>`,
            to:receiverEmail,
            subject,
            html
        }
        await transporter.sendMail(mailOptions)
        return {
            success:true,
            message:"Email sent successfully"
        }
    }catch(error){
        return {
            success:false,
            message:error.message
        }
    }
}