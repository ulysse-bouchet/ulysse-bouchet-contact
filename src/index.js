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
