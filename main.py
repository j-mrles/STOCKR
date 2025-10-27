from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
def health_check():
    return {"message": "AI Service is running"}
