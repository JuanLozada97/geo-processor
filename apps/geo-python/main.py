from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, confloat
from typing import List

from pydantic import Field

class Point(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)

class Points(BaseModel):
    points: List[Point]

app = FastAPI()

@app.post("/process")
def process(body: Points):
    pts = body.points
    if not pts:
        raise HTTPException(status_code=400, detail="points array is empty")

    north = max(p.lat for p in pts)
    south = min(p.lat for p in pts)
    east  = max(p.lng for p in pts)
    west  = min(p.lng for p in pts)

    centroid = {
        "lat": sum(p.lat for p in pts) / len(pts),
        "lng": sum(p.lng for p in pts) / len(pts),
    }
    return {"centroid": centroid, "bounds": {"north": north, "south": south, "east": east, "west": west}}
