# JARO Cleaning — GitHub + Cloudflare

Экспорт исходного кода проекта jaro-cleaning, версия 10, от 23 сентября 2026.
Основа: commit 0a29d52f39e168caa117371afb4309832c1a401f. Этот экспорт адаптирован
для отдельного Cloudflare Worker; действующий сайт в ChatGPT не изменён.

## Что внутри

Сайт, калькулятор, форма заявки, админка, локальные изображения, миграции базы,
конфигурация Cloudflare и автоматический деплой через GitHub Actions.
GitHub хранит код. Cloudflare Workers запускает сайт. GitHub Pages для этого
проекта не подходит: форма и админка используют сервер, D1 и R2.

## 1. Подготовка

Установи Node.js 22.13 или новее и Git. Открой терминал в этой папке:

```sh
npm ci
npx wrangler login
npx wrangler d1 create jaro-cleaning-db
npx wrangler r2 bucket create jaro-cleaning-media
```

В `wrangler.jsonc` замени нулевой `database_id` на ID из результата создания D1.
В `vars.ADMIN_EMAILS` впиши свой email администратора (один адрес).
Проверь доступность R2 и Images в своём аккаунте Cloudflare; их использование
может требовать включения сервиса и оплаты по тарифу аккаунта.

## 2. Первый запуск

```sh
npm run test:auth
npm run build
npx wrangler d1 migrations apply jaro-cleaning-db --remote
npx wrangler deploy
npx wrangler secret put ADMIN_PASSWORD
```

Введи уникальный пароль длиной не менее 20 символов, лучше случайный из менеджера
паролей. Не добавляй пароль в файлы или GitHub. До настройки email и пароля
админка закрыта. После деплоя открой выданный Cloudflare адрес, затем `/admin`.
Браузер запросит логин (email из ADMIN_EMAILS) и пароль. Используй HTTPS и отдельное
приватное окно для админки; закрытие окна очищает сохранённый браузером Basic login.
Вход через ChatGPT заменён отдельной проверкой пароля на сервере. Публичные
посетители сайта не должны входить в аккаунт.

Для писем по заявкам настрой Resend и подтверждённый адрес отправителя:

```sh
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put RESEND_FROM_EMAIL
```

RESEND_FROM_EMAIL: адрес с подтверждённого в Resend домена, например
`JARO Cleaning <requests@your-domain.nl>` — замени своим реальным адресом.
Получатель задаётся в контактных данных сайта через админку. Без настройки Resend
заявки сохраняются в D1, но email не отправляется. Проверь отправку реальной тестовой
заявки и получение письма перед рекламой сайта.

## 3. Загрузка на GitHub

Создай пустой репозиторий `jaro-cleaning` в своём GitHub, затем выполни:

```sh
git init
git add .
git commit -m "Import JARO Cleaning"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jaro-cleaning.git
git push -u origin main
```

Замени YOUR_USERNAME. Можно использовать GitHub Desktop: добавь эту папку и нажми
Publish repository. Загружай содержимое папки, а не ZIP. Сохрани `.github` и
`.gitignore`; `node_modules` и `dist` не загружай.

В GitHub → репозиторий → Settings → Secrets and variables → Actions добавь:

- `CLOUDFLARE_ACCOUNT_ID`: ID твоего аккаунта Cloudflare.
- `CLOUDFLARE_API_TOKEN`: токен с правами редактирования Workers Scripts и D1,
  доступом к R2 для этого аккаунта и необходимыми правами чтения аккаунта.
  Используй шаблон Cloudflare Edit Cloudflare Workers и добавь D1 Edit.

После настройки запусти Actions → Deploy JARO Cleaning → Run workflow.
Дальнейшие push в main запускают тесты входа, сборку, миграции D1 и деплой.
Не делай первый запуск сайта вручную до применения миграций: приложение создаёт
таблицы при обращении, что может конфликтовать с первыми миграциями.

## 4. Купленный домен

1. Добавь домен в Cloudflare, проверь импорт существующих DNS-записей.
2. У продавца домена замени nameservers на два значения, выданных Cloudflare.
   Сохрани записи почты MX/TXT, чтобы не нарушить работу существующей почты.
3. Дождись статуса Active в Cloudflare.
4. Workers & Pages → jaro-cleaning → Settings → Domains & Routes → Add → Custom Domain.
5. Введи свой домен. Если нужен www, добавь его отдельным Custom Domain.
6. Cloudflare создаст необходимые DNS-записи и сертификат HTTPS. Проверь оба адреса.

Никакого GitHub Pages CNAME для этой схемы не требуется.
Точное название домена не было предоставлено, поэтому в конфигурацию он не внесён.

## Перенос данных

Это экспорт КОДА, а не резервная копия рабочего окружения Sites. В него НЕ включены:
сохранённые заявки, изменения контактных данных/цен из D1, загруженные в R2 фото,
пароли и ключи сервисов. Новый сайт начнёт со значений `lib/site-config.ts` и
фотографий из `public`. Проверь телефон, WhatsApp, цены и email в админке перед запуском.
Изображения, загруженные через старую админку, нужно загрузить заново или перенести
R2 отдельно. Базу можно переносить отдельно при наличии доступа к её экспорту.

## Локальная разработка

```sh
npm run dev
```

Для локальной админки создай игнорируемый `.dev.vars` с ADMIN_PASSWORD (20+ символов).
ADMIN_EMAILS находится в wrangler.jsonc. Локальные данные D1/R2 отдельны от production.
Используй localhost. Для проверки production сборки: `npm run build && npm run preview`.

## Проверка и пределы

Защита админки тестируется командой `npm run test:auth`: поддельные заголовки,
неверный пароль, отсутствующая конфигурация, HTTPS и межсайтовые запросы.
Пароль защищает админку; для дополнительного ограничения попыток входа можно
включить Cloudflare Access или правила ограничения запросов в своём аккаунте.
Реальный внешний деплой, DNS и доставку email нужно проверить в твоём аккаунте.

Официальные инструкции:
- https://developers.cloudflare.com/workers/vite-plugin/get-started/
- https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
- https://developers.cloudflare.com/workers/configuration/routing/custom-domains/

Проверено при подготовке: production-сборка завершилась успешно; 3 теста защиты админки прошли. Внешняя проверка wrangler deploy --dry-run заблокирована автоматической проверкой разрешений; реальный деплой не выполнялся.
