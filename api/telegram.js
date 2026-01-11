// Vercel Serverless Function for sending messages to Telegram
// This solves the CORS problem by handling requests server-side
// File: /api/telegram.js (Vercel automatically creates /api/telegram endpoint)

export default async function handler(req, res) {
    // Enable CORS for all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get configuration from environment variables (set in Vercel dashboard)
        // Fallback to request body for development
        const BOT_TOKEN = process.env.BOT_TOKEN || req.body.botToken;
        const CHAT_ID = process.env.CHAT_ID || req.body.chatId;

        if (!BOT_TOKEN || !CHAT_ID) {
            console.error('Telegram configuration missing');
            return res.status(500).json({ 
                error: 'Server configuration error: BOT_TOKEN or CHAT_ID not set',
                hint: 'Set BOT_TOKEN and CHAT_ID in Vercel environment variables'
            });
        }

        // Get form data from request
        const { name, phone, email, message, address } = req.body;

        // Validate required fields
        if (!name || !phone) {
            return res.status(400).json({ 
                error: 'Missing required fields: name and phone are required' 
            });
        }

        // Build formatted message for Telegram
        let telegramMessage = `🆕 <b>New Contact Form Submission</b>\n\n`;
        telegramMessage += `👤 <b>Name:</b> ${escapeHtml(name)}\n`;
        telegramMessage += `📞 <b>Phone:</b> ${escapeHtml(phone)}\n`;
        
        if (email) {
            telegramMessage += `📧 <b>Email:</b> ${escapeHtml(email)}\n`;
        }
        
        if (address) {
            telegramMessage += `📍 <b>Address:</b> ${escapeHtml(address)}\n`;
        }
        
        if (message) {
            telegramMessage += `\n💬 <b>Message:</b>\n${escapeHtml(message)}\n`;
        }
        
        telegramMessage += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        telegramMessage += `🕐 ${new Date().toLocaleString()}`;

        // Send to Telegram
        const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: telegramMessage,
                parse_mode: 'HTML',
            }),
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
            console.error('Telegram API error:', data);
            return res.status(response.status || 500).json({
                error: 'Failed to send message to Telegram',
                details: data.description || 'Unknown error',
                telegramResponse: data
            });
        }

        // Success
        return res.status(200).json({ 
            success: true,
            message: 'Message sent successfully to Telegram',
            telegramResponse: data
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}

/**
 * Escapes HTML special characters to prevent XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}


