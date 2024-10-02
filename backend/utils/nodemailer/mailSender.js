import nodemailer from "nodemailer";

const mail_sender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "cellsphere.shop@gmail.com",
        pass: "rhbs iora tpfr zwef",
      },
    });

    let info = await transporter.sendMail({
      from: "cell sphere - shop",
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info", info);
    return info;
  } catch (error) {
    console.log(error);
  }
};

export default mail_sender;
