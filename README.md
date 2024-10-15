# Email Notification Service with Cloudflare Workers and Postmark API

This project is a simple email notification service built using **Cloudflare Workers** and the **Postmark API**. It is designed to handle incoming requests and send email notifications seamlessly when the contact form is filled on [my website](https://ulyssebouchet.fr/).

## Overview

The application processes `POST` requests containing user information (name, email, and message) and sends an email using Postmark. The logic is implemented in a Cloudflare Worker, making it lightweight, scalable, and efficient.

## Technologies Used

- **Cloudflare Workers**: Serverless computing platform for deploying lightweight, low-latency applications.
- **Postmark API**: A reliable email service API for sending transactional emails.
- **JavaScript/ES6**: The main language used for the implementation.

## Code Structure

The main logic for handling email notifications is in the `fetch` function, which:

1. Listens for `POST` requests.
2. Extracts user data (name, email, and message) from the request body.
3. Constructs the email payload and sends it to the Postmark API.
4. Returns appropriate success or error responses based on the API response.

## src/index.js

```javascript
export default {
	async fetch(request, env) {
		// Check if the request method is POST
		if (request.method === 'POST') {
			// Extract 'name', 'mail', and 'message' from the request body
			const { name, mail, message } = await request.json();

			// Send an email using Postmark API
			const response = await fetch('https://api.postmarkapp.com/email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Postmark-Server-Token': env.POSTMARK_API_TOKEN, // Use the API token from the environment
				},
				body: JSON.stringify({
					From: 'contact@ulyssebouchet.fr', // Sender email address
					To: 'contact@ulyssebouchet.fr', // Recipient email address (same as sender in this case)
					Subject: `New message from ${name}`, // Subject line containing the sender's name
					HtmlBody: `
					<p>${name} (<a href="mailto:${mail}">${mail}</a>) : </p>
					<p>${message}</p>`, // Email body formatted as HTML, including the sender's name, email and message
				}),
			});

			// Handle the response from Postmark API
			if (response.ok) {
				// If successful, return a response with status 'success'
				return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
			} else {
				// If there's an error, return a response with status 'error'
				return new Response(JSON.stringify({ status: 'error', message: 'Failed to send email.' }), { status: 500 });
			}
		} else {
			// If the request method is not POST, return a 405 Method Not Allowed response
			return new Response('Method Not Allowed', { status: 405 });
		}
	},
};
```

## Setup Instructions

> Note: This project is tailored to be used for my personal website; the instructions below are for showcasing the setup process. Feel free to adapt the code to your needs.

1. Clone the repository:
   ```bash
   git clone https://github.com/ulysse-bouchet/email-notification-service.git
   ```
2. Set up your environment variables using the Cloudflare Wrangler CLI:

   ```bash
   wrangler secret put POSTMARK_API_TOKEN
   ```

   You'll be prompted to enter your Postmark API token. This securely stores the token as a secret in your Cloudflare Workers environment.

3. Deploy the worker using the Cloudflare CLI:
   ```bash
   wrangler publish
   ```

## Purpose

This project handles the contact form of my website. When someone fills it up with correct information, I get notified by email of the message received. 
It is also a demonstration of my ability to build, deploy, and manage serverless applications using modern cloud platforms. It showcases my expertise in integrating third-party APIs such as Postmark for sending transactional emails.

## Contact

Feel free to reach out if you'd like to discuss my work further or if you have any feedback:

- **Email**: [ulysse.bouchet@pm.me](mailto:ulysse.bouchet@pm.me)
- **LinkedIn**: [Ulysse Bouchet](https://www.linkedin.com/in/ulysse-bouchet/)

> Note : This README has been redacted with the help of the AI model gpt-4o.
