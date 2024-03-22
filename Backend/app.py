from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
import uvicorn
from mangum import Mangum

model = pickle.load(open('model.pkl', 'rb'))
scaler = pickle.load(open('scaler.pkl', 'rb'))
# Your existing FastAPI app initialization
app = FastAPI()

# New CORS setup
origins = [
    "http://localhost:3000",  # React app's address
    "http://192.168.54.227:3000",
    "http://diabetes-appnai.s3-website-us-east-1.amazonaws.com"  # If you're accessing it from another device in your network
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
from pydantic import BaseModel
class PredictionInput(BaseModel):
    Pregnancies: int
    Glucose: int
    BMI: float
    DiabetesPedigreeFunction: float
    Age: float
@app.post("/Predict")
async def predict_diabetes(input_data: PredictionInput):
    # X_new = np.array([Glucose, BMI, Age, Pregnancies, DiabetesPedigreeFunction])
    # X_new = X_new.reshape(1, -1)
    X_new = np.array([
        input_data.Glucose,
        input_data.BMI,
        input_data.Age,
        input_data.Pregnancies,
        input_data.DiabetesPedigreeFunction
    ]).reshape(1, -1)
    # Preprocess the new data with the loaded scaler
    X_new_scaled = scaler.transform(X_new)

    # Prediction
    result = model.predict(X_new_scaled)
    if result[0] == 0:
        prediction = 'Not Diabetic'
    else:
        prediction = 'Diabetic'

    return {"prediction": prediction}




handler = Mangum(app)
# if __name__ == "__main__":
#     uvicorn.run(app, host="127.0.0.1", port=8000)

