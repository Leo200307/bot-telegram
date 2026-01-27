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
// /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    // Enviar la imagen de bienvenida primero y después el mensaje con el botón
    const imageUrl = 'https://i.postimg.cc/5Nj7tWBk/img4.jpg';

    bot.sendPhoto(chatId, imageUrl, {
        caption: `🙈DHAIL REYES😈
🔥𝗦𝗨𝗦𝗖𝗥𝗜𝗕𝗘𝗧𝗘😉🔥

Hola, me alegro de que finalmente me hayas encontrado🔥🔥
¿Quieres descubrir el contenido de mi canal VIP 🙈🔥?

Vamos al grano, ambos sabemos por qué estás aquí jeje. Y sí, la pasarás increíble en mi VIP 🫣, pero no te quedes solo con mi palabra 🔥👀🤭

CON UNA PROPINA DE 10 DÓLARES SERÁS PARTE DE MI COMUNIDAD MÁS ESPECIAL💙, DESBLOQUEA FOTOS Y VIDEOS MUY EXCLUSIVOS PARA TI 🔥

🔥𝗟𝗔 𝗦𝗨𝗦𝗖𝗥𝗜𝗣𝗖𝗜𝗢𝗡 𝗗𝗨𝗥𝗔 𝗨𝗡 𝗠𝗘𝗦 𝗖𝗢𝗠𝗢 𝗢𝗡𝗟𝗬𝗙𝗔𝗡𝗦🔥😈
(𝗘𝗫𝗖𝗟𝗨𝗦𝗜𝗩𝗢 𝗖𝗢𝗡𝗧𝗘𝗡𝗜𝗗𝗢 𝗦𝗢𝗟𝗢 𝗦𝗨𝗦𝗖𝗥𝗜𝗕𝗧𝗢𝗥𝗘𝗦) 𝗚𝗥𝗨𝗣𝗢 𝗩𝗜𝗣

👉 ¡Sigue el siguiente paso para empezar!`
    }).then(() => {
        // Después de la imagen de bienvenida, enviar el mensaje con los botones
        bot.sendMessage(chatId, '👇 Elige un método de pago', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "💳 Método de pago", callback_data: "metodo_pago" }]
                ]
            }
        });
    });
});


// Manejo de botones
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    try {
        if (query.data === 'metodo_pago') {
            // Reemplazar el mensaje con los métodos de pago
            await bot.editMessageMedia(
                {
                    type: 'photo',
                    media: 'https://i.postimg.cc/NFF4LRHP/img5.jpg',
                    caption: `𝗛𝗢𝗟𝗜 💕🔥
TODOS MIS METODOS DE PAGO 🥰💕
📌𝗕𝗢𝗟𝗜𝗩𝗜𝗔: 🇧🇴
📌𝗘𝗫𝗧𝗥𝗔𝗡𝗝𝗘𝗥𝗢: 🇲🇽🇦🇷🇺🇸🌍`,
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
                    caption: `🇧🇴 **PAGAR 100 BS**\n
📌 **SACA UNA CAPTURA Y PÁGALO**\n
⬇️ **ENVÍA EL COMPROBANTE, IMAGEN O DOCUMENTO** ⬇️\n
————————————\n
📌 **PUEDES (𝗩𝗢𝗟𝗩𝗘𝗥 𝗔𝗧𝗥𝗔𝗦🔙) SI TE EQUIVOCASTE DE SELECCIÓN**`,
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
                    media: 'https://i.postimg.cc/5y4rgHF9/depositphotos-220680152-stock-illustration-paypal-logo-printed-white-paper.jpg',
                    caption: `📌 **MARCA (𝗣𝗔𝗚𝗢 𝗣𝗢𝗥 𝗣𝗔𝗬𝗣𝗔𝗟💗)**\n
⬇️ **ENVÍA TU CORREO ELECTRÓNICO PARA HACER EL COBRO**\n
——————————————\n
📌 **MONTO 10$**\n
📌 **PUEDES (𝗩𝗢𝗟𝗩𝗘𝗥 𝗔𝗧𝗥𝗔𝗦🔙) SI TE EQUIVOCASTE DE SELECCIÓN**`,
                },
                {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '⬅️ Volver', callback_data: 'metodo_pago' }],
                            [{ text: '✅ enviar correo aqui', url: 'https://t.me/agentedeinformacion' }]
                        ]
                    }
                }
            );
        } else if (query.data === 'volver') {
            // Reemplazar la imagen de bienvenida y mensaje si el usuario hace "volver"
            await bot.editMessageMedia(
                {
                    type: 'photo',
                    media: 'https://i.postimg.cc/5Nj7tWBk/img4.jpg',
                    caption: `🙈 **DHAIL REYES😈**\n
🔥 **𝗦𝗨𝗦𝗖𝗥𝗜𝗕𝗘𝗧𝗘😉🔥**\n
Hola, me alegro de que finalmente me hayas encontrado 🔥🔥\n
Quieres descubrir el contenido de mi canal VIP 🙈🔥\n\n
Vamos al grano, ambos sabemos por qué estás aquí jeje. Y sí, la pasarás increíble en mi VIP 🫣 pero no te quedes solo con mi palabra 🔥👀🤭\n\n
CON UNA PROPINA DE 10 DOLARES SERÁS PARTE DE MI COMUNIDAD MÁS ESPECIAL💙, DESBLOQUEA FOTOS Y VIDEOS MUY EXCLUSIVOS PARA TI 🔥\n\n
🔥 **𝗟𝗔 𝗦𝗨𝗦𝗖𝗥𝗜𝗣𝗖𝗜𝗢𝗡 𝗗𝗨𝗥𝗔 𝗨𝗡 𝗠𝗘𝗦 𝗖𝗢𝗠𝗢 𝗢𝗡𝗟𝗬𝗙𝗔𝗡𝗦🔥😈**\n
(𝗘𝗫𝗖𝗟𝗨𝗦𝗜𝗩𝗢 𝗖𝗢𝗡𝗧𝗘𝗡𝗜𝗗𝗢 𝗦𝗢𝗟𝗢 𝗦𝗨𝗦𝗖𝗥𝗜𝗕𝗧𝗢𝗥𝗘𝗦) 𝗚𝗥𝗨𝗣𝗢 𝗩𝗜𝗣`,
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
