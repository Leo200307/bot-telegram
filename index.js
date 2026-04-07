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
        media: 'https://i.postimg.cc/5y37nZcd/img2.jpg',
        caption: `🙈 *Yohana Rojas😈*

🔥 **𝗦𝗨𝗦𝗖𝗥𝗜𝗕𝗘𝗧𝗘😉 SEMANA PROMOCIONAL🔥**

Hola, me alegro de que finalmente me hayas encontrado 🔥🔥  
¿Quieres descubrir el contenido de mi canal VIP 🙈🔥?

Vamos al grano, ambos sabemos por qué estás aquí jeje 😏  
Y sí, la pasarás increíble en mi VIP 🫣🔥

💙 ** CON UNA PROPINA DE 16.50 DÓLARES**  
Seras parte de mi comunidad mas especial,
Desbloqueas fotos y videos MUY exclusivos 🔥


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
                      media: 'https://i.postimg.cc/0Q1Vx8xh/img7.jpg',
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
                            [{ text: '💳 Pago con tarjeta', callback_data: 'tarjeta' }],
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
                      media: 'https://i.postimg.cc/gjXjDPLn/IMG_20260127_WA0000(1).jpg',
                    caption: `🇧🇴 * PAGA 100 BS*

📌 Saca una captura y pagalo por tu banca  
⬇️ Envía el comprobante de recibo de pago⬇️`,
                },
                {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '⬅️ Volver', callback_data: 'metodo_pago' }],
                            [{ 
  text: '✅ Ya pagué', 
  url: 'https://t.me/agentedeinformacion?text=Hola%20Yohana,%20te%20mando%20la%20captura,%20pagué%20por%20QR%20Bolivia' 
}]
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

📌 Monto: **16.50 USD**
📧 \`alejandrohinojosasoria237@gmail.com\`

Envía tu captura después del pago 💎`,
                },
                {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '⬅️ Volver', callback_data: 'metodo_pago' }],
                            [{ 
  text: '✅ Enviar captura', 
  url: 'https://t.me/agentedeinformacion?text=Hola%20Yohana,%20te%20mando%20la%20captura,%20pagué%20por%20PayPal' 
}]
                        ]
                    }
                }
            );
        }

        // ===== PAGO CON TARJETA =====
        else if (query.data === 'tarjeta') {
            await bot.editMessageMedia(
                {
                    type: 'photo',
                    media: 'https://i.postimg.cc/NMF1X4FH/Screenshot_20260213_110627_Chrome.jpg',
                    caption: `💳 **SUSCRIPCIÓN CON TARJETA**

La suscripción por tarjeta es de **16.50 USD**  

**Pasos para pagar:**

1️⃣ Presiona el botón **Ir a pagar**  
2️⃣ Coloca tu correo (recibirás un código)  
3️⃣ Ingresa los datos de tu tarjeta  
4️⃣ Envía la captura de la transacción`,
                },
                {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                                  [{ text: '💳 Ir a pagar', url: 'https://app.takenos.com/pay/e780acf4-6101-41cc-91e3-913f7ec498dd' }],
                            [{ 
  text: '📤 Enviar captura', 
  url: 'https://t.me/agentedeinformacion?text=Hola%20Yohana,%20te%20mando%20la%20captura,%20pagué%20con%20tarjeta' 
}],
                            [{ text: '⬅️ Volver', callback_data: 'metodo_pago' }]
                        ]
                    }
                }
            );
        }

        // ===== VOLVER AL INICIO =====
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

        await bot.answerCallbackQuery(query.id);

    } catch (e) {
        console.log('❌ Error:', e.description || e.message);
    }
});
