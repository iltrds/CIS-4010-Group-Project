require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

// Allow all origins temporarily to test
app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Fetch a survey JSON using lambda function
app.get('/api/fetch_survey/:surveyId', async (req, res) => {
    try {
      const { surveyId } = req.params;
      const response = await fetch(`${process.env.AWS_GET_SURVEY}/${surveyId}`);
      const survey = await response.json();
      res.json(survey);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.get('/api/fetch_all', async (req, res) => {
    try{
        const response = await fetch(`${process.env.AWS_ALL_SURVEYS}`, {     
        });   
        const surveyList = await response.json()
        res.json(surveyList) // Send back the list of surveys we got
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

app.post('/api/submit_survey', async (req, res) => {
    const response = await fetch(`${process.env.AWS_API_URL}/submitanswers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
    });

    const result = await response.json();
    res.json(result);  // send the response back to the frontend
})

app.listen(8080, () => console.log('Server running on port 8080'));