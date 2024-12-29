import os
from typing import Union, List


from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from mimetypes import guess_type
import shutil
import psutil

import zipfile

from models import DiskInfo, Item, DriveResponse, ErrorResponse, StatusResponse, FolderRequest

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


@app.get("/drive", response_model=List[DiskInfo])
async def get_drive_info():
    try:
        partitions = psutil.disk_partitions()
        disk_info = []

        for partition in partitions:
            try:
                usage = psutil.disk_usage(partition.mountpoint)
                disk_info.append(
                    DiskInfo(
                        device=partition.device,
                        mount_point=partition.mountpoint,
                        filesystem_type=partition.fstype,
                        total=usage.total,
                        used=usage.used,
                        free=usage.free,
                        percent=usage.percent,
                    )
                )
            except PermissionError:
                # Ako nemate pristup nekom disku
                continue

        if not disk_info:
            raise HTTPException(status_code=404, detail="No disks found")

        return disk_info

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/drive/{file_path:path}", response_model=Union[DriveResponse, ErrorResponse])
async def read_or_serve_file(file_path: str = ""):
    try:
        full_path = file_path if file_path else "/"
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
                mime_type = "application/octet-stream"  # Default to binary if mime type is unknown

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

            # Ako fajl nije podržan za prikaz u browseru, vrati 415 Unsupported Media Type
            raise HTTPException(
                status_code=415, detail="File type cannot be opened in the browser"
            )

        else:
            raise HTTPException(status_code=404, detail="Path does not exist")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/download/{file_path:path}", response_model=Union[DriveResponse, ErrorResponse]
)
async def download_file(file_path: str = ""):
    try:
        full_path = file_path if file_path else "/"
        # Definišite direktorijum u koji ćete sačuvati ZIP fajl
        temp_dir = (
            "/tmp"  # Možete promeniti ovo u bilo koji direktorijum koji je dostupan
        )
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)  # Kreirajte direktorijum ako ne postoji

        # Ako je direktorijum
        if os.path.isdir(full_path):
            # Definisanje imena za ZIP fajl
            zip_filename = f"{os.path.basename(full_path)}.zip"
            zip_filepath = os.path.join(temp_dir, zip_filename)

            # Kompresovanje direktorijuma u ZIP fajl
            with zipfile.ZipFile(zip_filepath, "w", zipfile.ZIP_DEFLATED) as zipf:
                for root, dirs, files in os.walk(full_path):
                    for file in files:
                        file_path = os.path.join(root, file)
                        zipf.write(file_path, os.path.relpath(file_path, full_path))

            # Vraćanje ZIP fajla kao FileResponse za preuzimanje
            return FileResponse(
                zip_filepath,
                media_type="application/zip",
                headers={"Content-Disposition": f"attachment; filename={zip_filename}"},
            )

        # Ako je fajl, samo ga preuzmi
        elif os.path.isfile(full_path):
            mime_type, _ = guess_type(full_path)
            if mime_type is None:
                mime_type = "application/octet-stream"  # Default to binary if mime type is unknown

            return FileResponse(
                full_path,
                media_type=mime_type,
                headers={
                    "Content-Disposition": f"attachment; filename={os.path.basename(full_path)}"
                },
            )

        # Ako nije ni fajl ni direktorijum
        else:
            raise HTTPException(status_code=404, detail="Path does not exist")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/delete/{file_path:path}")
async def delete_file(file_path: str = ""):
    try:
        full_path = file_path if file_path else "/"

        # Proverite da li fajl ili direktorijum postoji
        if os.path.exists(full_path):
            # Ako je to fajl, brišemo ga
            if os.path.isfile(full_path):
                os.remove(full_path)
                return JSONResponse(
                    status_code=200, content={"message": "File deleted successfully"}
                )

            # Ako je to direktorijum, proverite da li je prazan
            elif os.path.isdir(full_path):
                # Proverite da li je direktorijum prazan
                if not os.listdir(full_path):  # Direktorijum je prazan
                    os.rmdir(full_path)  # Brisanje praznog direktorijuma
                    return JSONResponse(
                        status_code=200,
                        content={"message": "Empty directory deleted successfully"},
                    )
                else:
                    # Ako direktorijum nije prazan, vraćamo grešku
                    raise HTTPException(
                        status_code=400,
                        detail="Cannot delete directory. It is not empty.",
                    )
        else:
            raise HTTPException(status_code=404, detail="File or directory not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.post("/drive/upload", response_model=StatusResponse)
async def upload_file_to_folder(file: UploadFile = File(...)):
    file_path = "D:\SLIKE_MOBITEL\Screenshots"
    try:
        print(f"Received file: {file.filename}")
        print(f"Target folder: {file_path}")

        # Proveri da li folder postoji
        if not os.path.exists(file_path):
            print(f"Folder '{file_path}' does not exist.")
            raise HTTPException(
                status_code=400, detail=f"Target folder '{file_path}' does not exist."
            )

        # Putanja gde će fajl biti sačuvan
        target_file_path = os.path.join(file_path, file.filename)

        # Sačuvaj fajl u folder
        with open(target_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Vraćamo oba polja: status i message
        return StatusResponse(
            status="success",
            message=f"File '{file.filename}' successfully uploaded to '{file_path}'.",
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upload/{folder_path:path}")
async def upload_file(folder_path: str, file: UploadFile = File(...)):
    """
    Ruta za prijem fajla i spašavanje u određeni folder.

    Args:
        folder_path (str): Putanja foldera u koji će fajl biti sačuvan.
        file (UploadFile): Fajl koji se prenosi.

    Returns:
        StatusResponse: Odgovor sa statusom i porukom.
    """
    try:
        print(f"Received file: {file.filename}")
        print(f"Target folder: {folder_path}")

        # Proveri da li folder postoji
        if not os.path.exists(folder_path):
            print(f"Folder '{folder_path}' does not exist.")
            raise HTTPException(
                status_code=400, detail=f"Target folder '{folder_path}' does not exist."
            )

        # Kreiraj potpunu putanju do fajla
        target_file_path = os.path.join(folder_path, file.filename)

        # Sačuvaj fajl na određenu lokaciju
        with open(target_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return StatusResponse(
            status="success",
            message=f"File '{file.filename}' successfully uploaded to '{folder_path}'.",
        )

    except Exception as e:
        # Obrada greške i vraćanje odgovora
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.post("/create-folder")
async def create_folder(request: FolderRequest):
    try:
        # Kombinovanje putanje i imena foldera
        full_path = os.path.join(request.file_path, request.folder_name)

        # Provera da li folder već postoji
        if os.path.exists(full_path):
            raise HTTPException(
                status_code=400,
                detail=f"Folder '{request.folder_name}' already exists at '{request.file_path}'.",
            )

        # Kreiranje foldera
        os.makedirs(full_path)

        return {
            "status": "success",
            "message": f"Folder '{request.folder_name}' successfully created at '{request.file_path}'.",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
