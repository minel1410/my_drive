from typing import List
from pydantic import BaseModel
from typing import Optional


class Item(BaseModel):
    name: str
    path: str
    type: str
    size: int
    created: float
    modified: float

class DriveResponse(BaseModel):
    items: List[Item]


class ErrorResponse(BaseModel):
    error: str
    status: str


class StatusResponse(BaseModel):
    status: Optional[str] = None
    message: str


class DiskInfo(BaseModel):
    device: str
    mount_point: str
    filesystem_type: str
    total: int
    used: int
    free: int
    percent: float


class FolderRequest(BaseModel):
    file_path: str
    folder_name: str
