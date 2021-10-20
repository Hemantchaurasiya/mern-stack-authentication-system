const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transport = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    }
});

// send email for user verification (register time email verification)
const sendRegisterVerificationEmail = async(email,token)=>{
    const url = process.env.REGISTER_VERIFICATION_URL+token;
    await transport.sendMail({
        from:"Email",
        to:email,
        subject:"VERIFY YOUR ACCOUNT",
        text:'Click on VERIFICATION ACCOUNT button to verify your account',
        html: '<p>Click <a href="'+url+'">VERIFY ACCOUNT</a> to verify your account</p>'
    })
}

// send email for reset password
const sendResetPasswordEmail = async(email,token)=>{
    const url = process.env.VERIFY_EMAIL_RESET_PASSWORD_URL+token;
    await transport.sendMail({
    from:"Email",
    to:email,
    subject:"RESET YOUR PASSWORD",
    text:'Click on RESET PASSWORD button reset your password',
    html: '<p>Click <a href="'+url+'">RESET PASSWORD</a> to reset your password</p>'
    })
};

module.exports = {sendRegisterVerificationEmail,sendResetPasswordEmail};