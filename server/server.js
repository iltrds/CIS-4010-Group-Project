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
app.get('/api/fetch_survey', async (req, res) => {
    try{
        const response = await fetch(`${process.env.AWS_TEST_SURVEY}`, {     
        });   
        
        const survey = await response.json();
        res.json(survey); // return the survey
    } catch (error){
        res.status(500).json({error: error.message})
    }
    
});

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