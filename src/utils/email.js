const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SEND_GRID_API)


const sendConfirmEmail = async(user)=>{
    const msg = {
        to: user.email, // Change to your recipient
        from: 'supunkularatne@gmail.com', // Change to your verified sender
        subject: 'Please confirm your email',
        
        html: `<p>Please click below link to confirm your email</p>
                <a href="${process.env.DOMAIN}/confirm_account?userid=${user._id}">Confirm</a>`,
      }
      try{
        await sgMail.send(msg)
        return "Email send sccuessfully"
      }catch(error){
        return {error:"Unable to send email.please try again"}
      }
}



  module.exports = {
      sendConfirmEmail:sendConfirmEmail
    };