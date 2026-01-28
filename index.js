const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// ================== VARIABLES ==================
const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) {
    console.error("❌ ERROR: BOT_TOKEN no definido");
    process.exit(1);
}

const URL = process.env.RENDER_EXTERNAL_URL;
if (!URL) {
    console.error("❌ ERROR: RENDER_EXTERNAL_URL no detectado");
    process.exit(1);
}

// ================== APP EXPRESS ==================
const app = express();
app.use(express.json());

// ================== BOT WEBHOOK ==================
const bot = new TelegramBot(TOKEN);

// Webhook
bot.setWebHook(`${URL}/bot${TOKEN}`);

// ================== FUNCIÓN BIENVENIDA ==================
function getWelcomeMessage() {
    return {
        type: 'photo',
        media: 'https://i.postimg.cc/5Nj7tWBk/img4.jpg',
        caption: `🙈 **DHAIL REYES😈**

🔥 **𝗦𝗨𝗦𝗖𝗥𝗜𝗕𝗘𝗧𝗘😉🔥**

Hola, me alegro de que finalmente me hayas encontrado 🔥🔥  
¿Quieres descubrir el contenido de mi canal VIP 🙈🔥?

Vamos al grano, ambos sabemos por qué estás aquí jeje 😏  
Y sí, la pasarás increíble en mi VIP 🫣🔥

💙 **CON UNA PROPINA DE 10 DÓLARES**  
Seras parte de mi comunidad mas especial,
Desbloqueas fotos y videos MUY exclusivos 🔥

🔥 **𝗟𝗔 𝗦𝗨𝗦𝗖𝗥𝗜𝗣𝗖𝗜𝗢𝗡 𝗗𝗨𝗥𝗔 𝗨𝗡 𝗠𝗘𝗦**  
Tipo OnlyFans 😈  
(Contenido SOLO para suscriptores VIP)

👇 Elige un método de pago para empezar`,
        reply_markup: {
            inline_keyboard: [
                [{ text: "💳 Método de pago", callback_data: "metodo_pago" }]
            ]
        }
    };
}

// ================== WEBHOOK HANDLER ==================
app.post(`/bot${TOKEN}`, async (req, res) => {
    res.sendStatus(200);

    const update = req.body;

    // Mensaje rápido anti-sleep
    if (update.message && update.message.chat) {
        try {
            await bot.sendMessage(
                update.message.chat.id,
                "💙💙  BIENVENIDO  💙💙"
            );
        } catch (e) {
            console.log("Mensaje rápido falló:", e.message);
        }
    }

    bot.processUpdate(update);
});

// ================== ENDPOINT UPTIMEROBOT ==================
app.get('/', (req, res) => {
    res.send('Bot activo 🚀');
});

// ================== PUERTO ==================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🤖 Bot escuchando en puerto ${PORT}`);
});

// ================== /START ==================
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendPhoto(chatId, getWelcomeMessage().media, getWelcomeMessage());
});

// ================== BOTONES ==================
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    try {

        // ===== MENÚ MÉTODOS =====
        if (query.data === 'metodo_pago') {
            await bot.editMessageMedia(
                {
                    type: 'photo',
                    media: 'https://i.postimg.cc/NFF4LRHP/img5.jpg',
                    caption: `𝗛𝗢𝗟𝗜 💕🔥
TODOS MIS MÉTODOS DE PAGO 🥰

📌 **BOLIVIA 🇧🇴**
📌 **EXTRANJERO 🌍**`,
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
        }

        // ===== QR BOLIVIA =====
        else if (query.data === 'qr_bolivia') {
            await bot.editMessageMedia(
                {
                    type: 'photo',
                    media: 'https://i.postimg.cc/vTN16cKj/Whats-App-Image-2026-01-27-at-09-05-41.jpg',
                    caption: `🇧🇴 **PAGAR 100 BS**

📌 Saca una captura y pagalo por tu banca  
⬇️ Envía el comprobante de recibo de pago⬇️`,
                },
                {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '⬅️ Volver', callback_data: 'metodo_pago' }],
                            [{ text: '✅ Ya pagué', url: 'https://t.me/agentedeinformacion' }]
                        ]
                    }
                }
            );
        }

        // ===== PAYPAL =====
        else if (query.data === 'paypal') {
            await bot.editMessageMedia(
                {
                    type: 'photo',
                    media: 'https://i.postimg.cc/5y4rgHF9/depositphotos-220680152-stock-illustration-paypal-logo-printed-white-paper.jpg',
                    caption: `💳 **PAGO POR PAYPAL**

📌 Monto: **10 USD**
⬇️ Envía tu correo para el cobro ⬇️`,
                },
                {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '⬅️ Volver', callback_data: 'metodo_pago' }],
                            [{ text: '✅ Enviar correo', url: 'https://t.me/agentedeinformacion' }]
                        ]
                    }
                }
            );
        }

        // ===== VOLVER AL INICIO (EDITAR MENSAJE) =====
        else if (query.data === 'volver') {
            await bot.editMessageMedia(
                {
                    type: 'photo',
                    media: getWelcomeMessage().media,
                    caption: getWelcomeMessage().caption
                },
                {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: getWelcomeMessage().reply_markup
                }
            );
        }

        // cerrar loading
        await bot.answerCallbackQuery(query.id);

    } catch (e) {
        console.log('❌ Error:', e.description || e.message);
    }
});
