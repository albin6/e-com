import mail_sender from "./mailSender.js";

const sendVerificationEmail = async (email, otp) => {
  console.log("sendVerificationEmail ", email);
  try {
    const mail_response = await mail_sender(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: ${otp}</p>`
    );
    console.log("Email response :", mail_response);
  } catch (error) {
    console.log(error);
  }
};

export default sendVerificationEmail;
