// Подключение модуля для работы с регулярными выражениями
import RegexParser from 'regex-parser';

// Импорт необходимых функций и констант из API SillyTavern
import { getContext, eventSource, event_types } from '../../../../script.js';

// Функция для парсинга строки с добычей
function parse_loot_string(loot_str) {
  // Реализация парсинга регуляркой из Python, переписанная на JS
  const parser = RegexParser('/!Добыча: \\[(.+?)\\]/');
  const parsed = parser.parse(loot_str);
  if (parsed) {
    const [_, item_type, name, description, damage] = parsed[0].matches[0].split(',');
    return { item_type, name, description, damage: parseInt(damage, 10) };
  }
  return null;
}

// Функция для вставки данных о новом предмете в базу данных
function insert_into_db(item) {
  const context = getContext(); // Получаем контекст SillyTavern
  const db = context.gameDatabase; // Предполагаемый объект с доступом к БД

  // Вставка новой записи о предмете в БД
  db.items.insert({ item_type: item.item_type, name: item.name, description: item.description, damage: item.damage });
}

// Обработчик события получения нового сообщения
function handleMessageReceived(messageData) {
  const { message } = messageData;
  const parsed = parse_loot_string(message);
  if (parsed) {
    insert_into_db(parsed);
  }
}

// Инициализация плагина
function init_plugin() {
  eventSource.on(event_types.MESSAGE_RECEIVED, handleMessageReceived);
}

init_plugin();