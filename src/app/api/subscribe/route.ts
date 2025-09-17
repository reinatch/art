import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, name } = await req.json();
  const MailchimpKey = process.env.MAILCHIMP_API_KEY;
  const MailchimpServer = process.env.MAILCHIMP_SERVER_PREFIX;
  const MailchimpAudience = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!MailchimpKey || !MailchimpServer || !MailchimpAudience) {
    // console.error('Missing Mailchimp environment variables');
    return NextResponse.json({ error: 'Missing Mailchimp environment variables' }, { status: 500 });
  }

  const customUrl = `https://${MailchimpServer}.api.mailchimp.com/3.0/lists/${MailchimpAudience}/members`;

  try {
    const response = await fetch(customUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `apikey ${MailchimpKey}`,
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: name,
        },
      }),
    });

    if (response.ok) {
      return NextResponse.json({ message: 'Successfully subscribed' }, { status: 200 });
    } else {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.detail || 'Subscription failed' }, { status: response.status });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}