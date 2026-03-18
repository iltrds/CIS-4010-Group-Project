require('dotenv').config();

const express = require('express');
const cors = require('cors');
const verifyCognitoToken = require('./cognito');
const app = express();

// Allow all origins temporarily to test
app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Fetch a survey JSON using lambda function
app.get('/api/fetch_survey/:surveyId', verifyCognitoToken, async (req, res) => {
    try {
      const { surveyId } = req.params;
      const response = await fetch(`${process.env.AWS_GET_SURVEY}/${surveyId}`);
      const survey = await response.json();
      res.json(survey);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.get('/api/fetch_all', verifyCognitoToken, async (req, res) => {
    try{
        const response = await fetch(`${process.env.AWS_ALL_SURVEYS}`, {     
        });   
        const surveyList = await response.json()
        res.json(surveyList) // Send back the list of surveys we got
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// Fetch user submitted answers to the surveys
app.get('/api/fetch_user_submissions', verifyCognitoToken, async (req, res) => {
  try {
    const response = await fetch(`${process.env.AWS_API_URL}/surveys/submissions`, {
      headers: { 'Authorization': req.headers['authorization'] }
    });
    const submissions = await response.json();
    res.json(submissions);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/submit_survey', verifyCognitoToken, async (req, res) => {

  // Get the userID from the cognito token
  const cognitoUserId = res.locals.user.sub;

  const submissionJSON = {
    ...req.body,
    "user-id": cognitoUserId,
  }

  // Forward the JSON to the Lambda function
  const lambdaResponse = await fetch(`${process.env.AWS_API_URL}/submitanswers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submissionJSON)
  });
  // Wait for response
  const result = await lambdaResponse.json();
  res.json(result);
})

app.listen(8080, () => console.log('Server running on port 8080'));