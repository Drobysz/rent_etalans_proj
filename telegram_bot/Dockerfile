FROM python:3.12-slim

WORKDIR /bot

COPY requirements.txt* ./
RUN if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; fi

COPY . .

ENV TELEGRAM_BOT_HOST=0.0.0.0
ENV TELEGRAM_BOT_PORT=8765
ENV TELEGRAM_BOT_DB_PATH=/data/chats.sqlite3

EXPOSE 8765

CMD ["python", "purchase_bot.py"]
