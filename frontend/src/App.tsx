import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

type FormData = {
  pregnancies: number;
  glucose: number;
  bmi: number;
  dpf: number;
  age: number;
};

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    pregnancies: 0,
    glucose: 0,
    bmi: 0,
    dpf: 0,
    age: 0,
  });
  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: parseFloat(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true); // Show the processing indicator

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(
        'https://zylx52sz76nrl757tecwxu737q0besjz.lambda-url.us-east-1.on.aws/Predict',
        {
          Pregnancies: formData.pregnancies,
          Glucose: formData.glucose,
          BMI: formData.bmi,
          DiabetesPedigreeFunction: formData.dpf,
          Age: formData.age,
        },
        config
      );
      setIsProcessing(false); // Hide the processing indicator
      setPrediction(response.data.prediction);
      setError(null);
      setShowModal(true); // Show the result in a modal pop-up
    } catch (error) {
      setIsProcessing(false); // Hide the processing indicator
      if (axios.isAxiosError(error) && error.response) {
        setError(`An error occurred: ${error.response.data}`);
      } else {
        setError('An unexpected error occurred.');
      }
      setPrediction(null);
      setShowModal(true);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Diabetes Prediction</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="pregnancies">Pregnancies</label>
          <input id="pregnancies" name="pregnancies" type="number" onChange={handleChange} />

          <label htmlFor="glucose">Glucose</label>
          <input id="glucose" name="glucose" type="number" onChange={handleChange} />

          <label htmlFor="bmi">BMI</label>
          <input id="bmi" name="bmi" type="number" step="any" onChange={handleChange} />

          <label htmlFor="dpf">Diabetes Pedigree Function</label>
          <input id="dpf" name="dpf" type="number" step="any" onChange={handleChange} />

          <label htmlFor="age">Age</label>
          <input id="age" name="age" type="number" onChange={handleChange} />

          <button type="submit">Predict</button>
        </form>
      </header>

      {isProcessing && (
        <div className="processing-popup">
          <div className="processing-message">Processing...</div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {error && <p className="error">{error}</p>}
            {prediction && (
              <div className={`prediction-result ${prediction === 'Diabetic' ? 'diabetic' : 'not-diabetic'}`}>
                Prediction: {prediction}
              </div>
            )}
            {!error && !prediction && <p>No prediction available.</p>}
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;