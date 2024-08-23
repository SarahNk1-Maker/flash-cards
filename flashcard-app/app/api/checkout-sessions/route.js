import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

const BASE_URL = 'http://localhost:3000'; // Update this with your production URL if needed

export async function POST(req) {
  try {
    const { subscriptionType } = await req.json();
    if (!subscriptionType) {
      return NextResponse.json({ error: 'Subscription type is required' }, { status: 400 });
    }

    const params = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pro subscription',
            },
            unit_amount: 1000, // $10.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${BASE_URL}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/result?session_id={CHECKOUT_SESSION_ID}`,
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);
    return NextResponse.json(checkoutSession, { status: 200 });
  } catch (error) {
    console.error('Error creating checkout session:', error.message);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}

export async function GET(req) {
  const session_id = req.nextUrl.searchParams.get('session_id');

  try {
    if (!session_id) {
      throw new Error('Session ID is required');
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    return NextResponse.json(checkoutSession);
  } catch (error) {
    console.error('Error retrieving checkout session:', error.message);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
