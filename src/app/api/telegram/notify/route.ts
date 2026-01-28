import { NextResponse } from 'next/server';

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TG_CHAT_ID = process.env.TG_CHAT_ID;

export async function POST(request: Request) {
    if (!TG_BOT_TOKEN || !TG_CHAT_ID) {
        console.error('Telegram credentials missing');
        return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    try {
        const order = await request.json();

        const message = `
📦 *NOUVELLE COMMANDE REÇUE !*

👤 *Client:* ${order.firstName} ${order.lastName}
📱 *Téléphone:* ${order.phone}
📍 *Ville:* ${order.city === 'autre' ? order.otherCity : order.city}
🏠 *Adresse:* ${order.address}

🛒 *Articles:*
${order.cartItems.map((item: any) => `- ${item.quantity}x ${item.name} (${item.brand})`).join('\n')}

💰 *Total:* ${order.totalPrice.toFixed(2)} DH

_Veuillez vérifier le dashboard admin pour plus de détails._
        `.trim();

        const response = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TG_CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Telegram API Error:', error);
            return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing notification:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
