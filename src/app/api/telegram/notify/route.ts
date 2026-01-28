import { NextResponse } from 'next/server';

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TG_CHAT_ID = process.env.TG_CHAT_ID;
const TG_CHAT_ID_MARWANE = process.env.TG_CHAT_ID_MARWANE;
const TG_CHAT_ID_SOUHAIL = process.env.TG_CHAT_ID_SOUHAIL;

export async function POST(request: Request) {
    if (!TG_BOT_TOKEN) {
        console.error('Telegram bot token missing');
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
${order.cartItems.map((item: any) => {
            let itemText = `- ${item.quantity}x ${item.name} (${item.brand})`;
            if (item.customization) {
                const custom = item.customization;
                const details = [];
                if (custom.ringSize) details.push(`Taille ${custom.ringSize}`);
                if (custom.perfumeType) {
                    details.push(custom.perfumeType === 'other'
                        ? `Parfum: ${custom.customPerfumeName} ⚠️`
                        : `Parfum: ${custom.perfumeType}`);
                }
                if (custom.loveLetterEnabled) {
                    details.push(`Lettre pour ${custom.loveLetterRecipientName}`);
                }
                if (details.length > 0) {
                    itemText += `\n  └ ${details.join(' | ')}`;
                }
            }
            return itemText;
        }).join('\n')}

💰 *Total:* ${order.totalPrice.toFixed(2)} DH

_Veuillez vérifier le dashboard admin pour plus de détails._
        `.trim();

        // Collect all chat IDs
        const chatIds = [TG_CHAT_ID, TG_CHAT_ID_MARWANE, TG_CHAT_ID_SOUHAIL].filter(Boolean);

        if (chatIds.length === 0) {
            console.error('No chat IDs configured');
            return NextResponse.json({ error: 'No chat IDs configured' }, { status: 500 });
        }

        // Send message to all chat IDs in parallel
        const sendPromises = chatIds.map(chatId =>
            fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown',
                }),
            })
        );

        const responses = await Promise.all(sendPromises);

        // Check if any failed
        const failures = responses.filter(r => !r.ok);
        if (failures.length > 0) {
            console.error(`Failed to send to ${failures.length} chat(s)`);
            // Still return success if at least one succeeded
            if (failures.length === responses.length) {
                return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
            }
        }

        return NextResponse.json({
            success: true,
            sent: responses.length - failures.length,
            failed: failures.length
        });
    } catch (error) {
        console.error('Error processing notification:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
