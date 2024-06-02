const TelegramBot = require('node-telegram-bot-api');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const credentials = require('./path/to/credentials.json'); // Google service account kaliti

// Telegram bot tokeni
const token = '6536661946:AAEFizqMoIpc7p89UxEGN1pa-VkzMM16Zxc';

// Google Sheets hujjat ID'si
const docId = '1LfEaFVOR6ll_PGkX2EfbT7VrUS09cDLpUg3HfNhwiSY';

// Botni ishga tushirish
const bot = new TelegramBot(token, { polling: true });

// Google Sheets hujjatini ishga tushirish
const doc = new GoogleSpreadsheet(docId);

// Google Sheets bilan autentifikatsiyadan o'tish
async function accessSpreadsheet() {
    await doc.useServiceAccountAuth(credentials); // Xizmat akkaunti yordamida autentifikatsiya qilish
    await doc.loadInfo(); // Hujjat xususiyatlari va ish varaqalarini yuklash
    console.log(`Hujjat yuklandi: ${doc.title}`);
}

// Elektron jadvalga kirish
accessSpreadsheet();

// Har qanday xabarni tinglash
bot.on('message', async (msg) => {
    const chatId = msg.chat.id; // Chat ID'sini olish
    const text = msg.text; // Xabar matnini olish

    try {
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0]; // Birinchi ish varaqasini ishlatish
        await sheet.addRow({ Timestamp: new Date().toISOString(), ChatId: chatId, Message: text }); // Yangi qator qo'shish
        bot.sendMessage(chatId, 'Xabaringiz saqlandi!'); // Xabar saqlangani haqida foydalanuvchiga bildirish
    } catch (error) {
        console.error('Google Sheetsga kirishda xatolik:', error); // Xatoni konsolga chiqarish
        bot.sendMessage(chatId, 'Xabarni saqlashda xatolik yuz berdi.'); // Xatolik haqida foydalanuvchiga bildirish
    }
});