import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

type FormData = {
  pregnancies: number;
  glucose: number;
  bmi: number;
  dpf: number; // Diabetes Pedigree Function
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value.includes('.') ? parseFloat(value) : parseInt(value, 10)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post('https://zylx52sz76nrl757tecwxu737q0besjz.lambda-url.us-east-1.on.aws/Predict', {
        Pregnancies: formData.pregnancies,
        Glucose: formData.glucose,
        BMI: formData.bmi,
        DiabetesPedigreeFunction: formData.dpf,
        Age: formData.age,
      }, config);
      setPrediction(response.data.prediction);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while making the prediction.');
      setPrediction(null);
    }
  };
  // const appStyle = {
  //   backgroundImage: `url(${process.env.PUBLIC_URL + '/background.jpg'})`,
  //   backgroundSize: 'cover',
  //   backgroundPosition: 'center',
  //   backgroundRepeat: 'no-repeat',
  //   minHeight: '100vh', // Set the height of the app so it fills the screen
  // };


  return (
    <div className="App" >
      <header className="App-header">
        <h1>Diabetes Prediction</h1>
        <form onSubmit={handleSubmit}>
          <input name="pregnancies" type="number" placeholder="Pregnancies" onChange={handleChange} />
          <input name="glucose" type="number" placeholder="Glucose" onChange={handleChange} />
          <input name="bmi" type="number" step="any" placeholder="BMI" onChange={handleChange} />
          <input name="dpf" type="number" step="any" placeholder="Diabetes Pedigree Function" onChange={handleChange} />
          <input name="age" type="number" placeholder="Age" onChange={handleChange} />
          <button type="submit">Predict</button>
        </form>
        {prediction && (
          <div className={`prediction-result ${prediction === 'Diabetic' ? 'diabetic' : 'not-diabetic'}`}>
            {prediction}
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </header>
    </div>
  );
  
}

export default App;
