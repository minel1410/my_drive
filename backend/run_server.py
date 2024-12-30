import uvicorn
from main import app

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        ssl_keyfile=r"C:\Users\minel\letsencrypt\privkey.pem",
        ssl_certfile=r"C:\Users\minel\letsencrypt\fullchain.pem",
    )
