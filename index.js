const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// 🔐 Token del bot desde variable de entorno
const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) {
    console.error("❌ ERROR: Debes definir BOT_TOKEN en las variables de entorno");
    process.exit(1);
}

const app = express();
app.use(express.json()); // Para recibir updates del webhook

// URL pública que Render asigna automáticamente
const URL = process.env.RENDER_EXTERNAL_URL; // Render te da esto
if (!URL) {
    console.error("❌ ERROR: No se detectó URL de Render. Render establece RENDER_EXTERNAL_URL automáticamente.");
    process.exit(1);
}

// Crear instancia del bot sin polling
const bot = new TelegramBot(TOKEN);

// Configurar webhook
bot.setWebHook(`${URL}/bot${TOKEN}`);

// Endpoint para recibir los updates de Telegram
app.post(`/bot${TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Página de prueba
app.get('/', (req, res) => res.send('Bot activo 🚀'));

// Puerto asignado por Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🤖 Bot escuchando en puerto ${PORT}`));

// ------------------ Eventos del bot ------------------

// /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    const imageUrl = 'https://i.postimg.cc/J06nmTPH/In-Shot-20250818-200040976.png';

    bot.sendPhoto(chatId, imageUrl, {
        caption: `👋 Bienvenido ${msg.from.first_name}!\n\n🔥 Accede a mis clases privadas\n👇 Elige un método de pago`,
        reply_markup: {
            inline_keyboard: [
                [{ text: "💳 Método de pago", callback_data: "metodo_pago" }]
            ]
        }
    });
});

// Manejo de botones
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    try {
        if (query.data === 'metodo_pago') {
            await bot.editMessageMedia(
                {
                    type: 'photo',
                    media: 'https://i.postimg.cc/bwKZsB8H/In_Shot_20250814_143838908.png',
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
                    media: 'https://i.postimg.cc/s243s6gm/In-Shot-20240907-120937037.png',
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
                    media: 'https://i.postimg.cc/Pxfvj8T0/In-Shot-20240907-120918573.png',
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
                    media: 'https://i.postimg.cc/J06nmTPH/In-Shot-20250818-200040976.png',
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
