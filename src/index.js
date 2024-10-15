export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      // Handle CORS preflight request
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }
    // Check if the request method is POST
    if (request.method === "POST") {
      try {
        // Extract 'name', 'mail', and 'message' from the request body
        const { name, mail, message } = await request.json();

        // Send an email using Postmark API
        const response = await fetch("https://api.postmarkapp.com/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Postmark-Server-Token": env.POSTMARK_API_TOKEN, // Use the API token from the environment
          },
          body: JSON.stringify({
            From: "contact@ulyssebouchet.fr", // Sender email address
            To: "contact@ulyssebouchet.fr", // Recipient email address (same as sender in this case)
            Subject: `New message from ${name}`, // Subject line containing the sender's name
            HtmlBody: `
					<p>${name} (<a href="mailto:${mail}">${mail}</a>) : </p>
					<p>${message}</p>`, // Email body formatted as HTML, including the sender's name, email and message
          }),
        });

        // Handle the response from Postmark API
        if (response.ok) {
          return new Response(JSON.stringify({ status: "success" }), {
            status: 200,
            headers: {
              "Access-Control-Allow-Origin": "*", // Allow access from any origin
            },
          });
        } else {
          return new Response(
            JSON.stringify({
              status: "error",
              message: "Failed to send email.",
            }),
            {
              status: 500,
              headers: {
                "Access-Control-Allow-Origin": "*", // Allow access from any origin
              },
            }
          );
        }
      } catch (error) {
        return new Response(
          JSON.stringify({ status: "error", message: error.message }),
          {
            status: 500,
            headers: {
              "Access-Control-Allow-Origin": "*", // Allow access from any origin
            },
          }
        );
      }
    } else {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow access from any origin
        },
      });
    }
  },
};
