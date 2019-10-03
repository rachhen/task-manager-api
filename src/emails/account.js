const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: "rachhen.it@gmail.com",
		subject: "Thanks for joining in!",
		text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
	});
};

const sendCancelationEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: "rachhen.it@gmail.com",
		subject: "Cancel account",
		text: `Goodbye, ${name}!`
	});
};

module.exports = {
	sendWelcomeEmail,
	sendCancelationEmail
};
