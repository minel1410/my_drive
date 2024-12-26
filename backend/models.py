from typing import List
from pydantic import BaseModel


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
