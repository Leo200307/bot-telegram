const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// 🔐 Tu token del BotFather
const TOKEN = "8342423272:AAFtZ0PToF9JitbQkS2rr4QOH15mbrlIaoY";

const bot = new TelegramBot(TOKEN, { polling: true });

// Servidor web para Railway/Replit
const app = express();
app.get('/', (req, res) => res.send('Bot activo 🚀'));
app.listen(3000);

// /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    const imageUrl = 'https://i.postimg.cc/J06nmTPH/In-Shot-20250818-200040976.png'; // Imagen de bienvenida

    bot.sendPhoto(chatId, imageUrl, {
        caption: `👋 Bienvenido ${msg.from.first_name}!\n\n🔥 Accede a mis clases privadas\n👇 Elige un método de pago`,
        reply_markup: {
            inline_keyboard: [
                [{ text: "💳 Método de pago", callback_data: "metodo_pago" }]
            ]
        }
    });
});

// Manejo de botones con edición para no llenar historial
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    try {
        if (query.data === 'metodo_pago') {
            await bot.editMessageMedia(
                {
                    type: 'photo',
                    media: 'https://i.postimg.cc/bwKZsB8H/In_Shot_20250814_143838908.png', // Imagen menú de pagos
                    caption: `💰 Elige tu método de pago`,
                },
                {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🇧🇴 QR Bolivia', callback_data: 'qr_bolivia' }],
                            [{ text: '💳 PayPal', callback_data: 'paypal' }],
                            [{ text: '⬅️ Volver', callback_data: 'volver' }]
                        ]
                    }
                }
            );
        } else if (query.data === 'qr_bolivia') {
            await bot.editMessageMedia(
                {
                    type: 'photo',
                    media: 'https://i.postimg.cc/s243s6gm/In-Shot-20240907-120937037.png', // QR de Bolivia
                    caption: `🇧🇴 Pago por QR Bolivia\n📲 Escanea el QR y envía tu comprobante`,
                },
                {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '⬅️ Volver', callback_data: 'metodo_pago' }],
                            [{ text: '✅ Ya pagué, enviar captura', url: 'https://t.me/agentedeinformacion' }]
                        ]
                    }
                }
            );
        } else if (query.data === 'paypal') {
            await bot.editMessageMedia(
                {
                    type: 'photo',
                    media: 'https://i.postimg.cc/Pxfvj8T0/In-Shot-20240907-120918573.png', // Imagen PayPal
                    caption: `💳 Pago por PayPal\n📧 Correo: paypal@tucorreo.com\n📩 Envía tu comprobante`,
                },
                {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '⬅️ Volver', callback_data: 'metodo_pago' }],
                            [{ text: '✅ Ya pagué, enviar captura', url: 'https://t.me/agentedeinformacion' }]
                        ]
                    }
                }
            );
        } else if (query.data === 'volver') {
            await bot.editMessageMedia(
                {
                    type: 'photo',
                    media: 'https://i.postimg.cc/J06nmTPH/In-Shot-20250818-200040976.png', // Imagen de bienvenida
                    caption: `👋 Bienvenido ${query.from.first_name}!\n\n🔥 Accede a mis clases privadas\n👇 Elige un método de pago`,
                },
                {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "💳 Método de pago", callback_data: "metodo_pago" }]
                        ]
                    }
                }
            );
        }
    } catch (e) {
        console.log('Error al editar mensaje:', e.description || e);
    }
});

