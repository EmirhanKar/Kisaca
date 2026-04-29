from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.controller.shortlink_controller import shortlink_router
from src.controller.user_controller import user_router
from src.core.exceptions.api_exception import APIException


app = FastAPI()
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(APIException)
def api_exception_handler(request, exc: APIException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )


@app.exception_handler(Exception)
def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected error occurred."},
    )


router = APIRouter()

router.include_router(prefix="/shortlinks", router=shortlink_router)
router.include_router(prefix="/auth", router=user_router)
app.include_router(prefix="/api", router=router)
