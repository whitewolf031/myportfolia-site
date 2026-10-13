import asyncio
import html
import logging
import os
from contextlib import asynccontextmanager
from typing import Optional

from aiogram import Bot, Dispatcher, types
from aiogram.client.default import DefaultBotProperties
from aiogram.client.session.aiohttp import AiohttpSession
from aiogram.client.telegram import TelegramAPIServer
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart
from fastapi import FastAPI, Header, HTTPException, status
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("notifier")

# Configuration from environment
INTERNAL_API_KEY = os.environ.get("INTERNAL_API_KEY", "internal_secret_token_change_me_in_prod_random_64_bytes")
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
OWNER_CHAT_ID = os.environ.get("OWNER_CHAT_ID", "123456789")
TELEGRAM_API_BASE = os.environ.get("TELEGRAM_API_BASE", "https://api.telegram.org")

# Bot and Dispatcher setup
def create_bot() -> Optional[Bot]:
    if not TELEGRAM_BOT_TOKEN or "ABCdefGhIJKlmNoPQRsTUVwxyZ" in TELEGRAM_BOT_TOKEN:
        logger.warning("TELEGRAM_BOT_TOKEN is not set or using dummy placeholder.")
    session = None
    if TELEGRAM_API_BASE and TELEGRAM_API_BASE.rstrip("/") != "https://api.telegram.org":
        server = TelegramAPIServer.from_base(TELEGRAM_API_BASE)
        session = AiohttpSession(api=server)

    token = TELEGRAM_BOT_TOKEN if TELEGRAM_BOT_TOKEN else "123456:dummy_token"
    return Bot(
        token=token,
        session=session,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML),
    )

bot_instance = create_bot()
dp = Dispatcher()

@dp.message(CommandStart())
async def handle_start(message: types.Message):
    chat_id = message.chat.id
    response_text = (
        f"Assalomu alaykum, <b>{html.escape(message.from_user.full_name if message.from_user else 'Foydalanuvchi')}</b>!\n\n"
        f"Sizning chat ID raqamingiz: <code>{chat_id}</code>\n\n"
        f"Ushbu raqamni serveringizdagi <code>OWNER_CHAT_ID</code> o'zgaruvchisiga kiriting."
    )
    await message.answer(response_text)

polling_task: Optional[asyncio.Task] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global polling_task
    logger.info("Starting Notifier service...")
    # Attempt to start polling in the background if valid bot token is configured
    if TELEGRAM_BOT_TOKEN and "ABCdefGhIJKlmNoPQRsTUVwxyZ" not in TELEGRAM_BOT_TOKEN:
        async def start_polling():
            try:
                logger.info("Starting Telegram Bot polling...")
                await dp.start_polling(bot_instance, handle_signals=False)
            except Exception as e:
                logger.warning(f"Telegram polling stopped with: {e}")

        polling_task = asyncio.create_task(start_polling())
    else:
        logger.info("Bot polling not started (placeholder or missing token).")

    yield

    logger.info("Shutting down Notifier service...")
    if polling_task and not polling_task.done():
        polling_task.cancel()
        try:
            await polling_task
        except asyncio.CancelledError:
            pass
    if bot_instance and bot_instance.session:
        await bot_instance.session.close()

app = FastAPI(title="Portfolio Telegram Notifier", lifespan=lifespan)

class NotificationPayload(BaseModel):
    name: str = Field(..., max_length=100)
    contact: str = Field(..., max_length=150)
    message: str = Field(..., max_length=3000)
    created_at: Optional[str] = ""

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "notifier"}

@app.post("/notify")
async def notify_owner(
    payload: NotificationPayload,
    x_internal_key: Optional[str] = Header(None, alias="X-Internal-Key"),
):
    # Verify internal secret key
    if not x_internal_key or x_internal_key != INTERNAL_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Yaroqsiz yoki yetishmayotgan ichki kalit (X-Internal-Key).",
        )

    owner_chat = os.environ.get("OWNER_CHAT_ID", OWNER_CHAT_ID)
    if not owner_chat:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OWNER_CHAT_ID sozlanmagan.",
        )

    # HTML escape fields to prevent any tag injection
    safe_name = html.escape(payload.name.strip())
    safe_contact = html.escape(payload.contact.strip())
    safe_message = html.escape(payload.message.strip())
    safe_time = html.escape(payload.created_at.strip()) if payload.created_at else "Hozir"

    text = (
        "🔔 <b>Yangi xabar portfolio saytidan!</b>\n\n"
        f"👤 <b>Yuboruvchi:</b> {safe_name}\n"
        f"📞 <b>Aloqa:</b> {safe_contact}\n"
        f"🕒 <b>Vaqt:</b> {safe_time}\n\n"
        "💬 <b>Xabar:</b>\n"
        f"{safe_message}"
    )

    # Retry loop with backoff (3 attempts)
    last_error: Optional[Exception] = None
    for attempt in range(1, 4):
        try:
            await bot_instance.send_message(
                chat_id=owner_chat,
                text=text,
                parse_mode=ParseMode.HTML,
            )
            logger.info(f"Notification delivered successfully to chat {owner_chat} on attempt {attempt}")
            return {"status": "success", "message": "Xabar Telegramga muvaffaqiyatli yuborildi."}
        except Exception as exc:
            last_error = exc
            logger.warning(f"Notification delivery failed on attempt {attempt}/3: {exc}")
            if attempt < 3:
                await asyncio.sleep(attempt * 0.8)

    raise HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail=f"Telegramga xabar yetkazishda xatolik: {str(last_error)}",
    )
