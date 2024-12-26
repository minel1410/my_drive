import os
from typing import Union


from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from mimetypes import guess_type

from models import Item, DriveResponse, ErrorResponse

app = FastAPI()

origins = ['*'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


BASE_DIRECTORY = "D:\\"  



@app.get("/drive/{file_path:path}", response_model=Union[DriveResponse, ErrorResponse])
async def read_or_serve_file(file_path: str = ""):
    try:
        full_path = (
            os.path.join(BASE_DIRECTORY, file_path) if file_path else BASE_DIRECTORY
        )
        if os.path.isdir(full_path):
            items = []
            for item in os.listdir(full_path):
                item_path = os.path.join(full_path, item)
                try:
                    # Proveri da li je direktorijum ili fajl
                    if os.path.isdir(item_path):
                        item_size = sum(
                            os.path.getsize(os.path.join(item_path, f))
                            for f in os.listdir(item_path)
                            if os.path.isfile(os.path.join(item_path, f))
                        )
                        item_type = "folder"
                    else:
                        item_size = os.path.getsize(item_path)
                        mime_type, _ = guess_type(item_path)
                        if mime_type:
                            item_type = mime_type
                        else:
                            item_type = ""
                            item_size = 0

                    # Preskoči elemente sa veličinom 0
                    if item_size > 0:
                        items.append(
                            Item(
                                name=item,
                                path=f"/drive/{file_path}/{item}",  # Vratiti rutu za preuzimanje
                                type=item_type,
                                size=item_size,
                                created=os.path.getctime(item_path),
                                modified=os.path.getmtime(item_path),
                            )
                        )
                except (PermissionError, FileNotFoundError):
                    # Preskoči elemente za koje nemaš pristup ili ne postoje
                    continue

            return DriveResponse(items=items)

        elif os.path.isfile(full_path):
            mime_type, _ = guess_type(full_path)
            if mime_type is None:
                mime_type = "application/octet-stream"

            # Lista MIME tipova koji se mogu otvoriti u browseru
            viewable_mime_types = [
                "application/pdf",
                "text/plain",
                "text/html",
                "application/json",
                "application/javascript",
                "text/css",
                "application/xml",
                "application/wasm",
                "application/ogg",
                "application/x-shockwave-flash",
            ]

            # Dodavanje grupa MIME tipova
            viewable_groups = ["image/", "audio/", "video/"]

            # Provera da li fajl može da se pregleda u browseru
            if (
                any(mime_type.startswith(group) for group in viewable_groups)
                or mime_type in viewable_mime_types
            ):
                return FileResponse(full_path, media_type=mime_type)

            # Ako nije podržan za prikaz, preuzimanje fajla kao prilog
            return FileResponse(
                full_path,
                media_type=mime_type,
                headers={
                    "Content-Disposition": f"attachment; filename={os.path.basename(full_path)}"
                },
            )

        else:
            raise HTTPException(status_code=404, detail="Path does not exist")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
