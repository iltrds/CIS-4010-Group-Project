import { useState, useEffect } from 'react';
import {TextField, Button, Box, Card, Stack, CardContent, Typography, RadioGroup, FormControlLabel, Radio} from "@mui/material";
import { useNavigate, useParams} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
   
function Survey() {
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({}); // Track the answers
  const [userID, setID] = useState(null); // UserID
  
  const navigate = useNavigate();
  const { surveyId } = useParams();

  // Fetch the initial survey
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    console.log('surveyId:', surveyId);
    fetch(`http://localhost:8080/api/fetch_survey/${surveyId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('survey data:', data);
        setData(data)});
  }, [surveyId]);

  // Handle whenever a survey answer is changed
  const handleAnswer = (question, answer) =>{
    setAnswers(prev => ({ ...prev, [question]: answer }));
    console.log(answers)
  }

  const submitAnswers = async () => {
    // Build final JSON to send back to database with answers
    const submissionJSON = {
        "user-id": userID,
        "survey-id": data['survey-id'],
        "answers": answers
    }

    // Send the JSON back to express to send to database
    const res = await fetch('http://localhost:8080/api/submit_survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionJSON)
      });
    
    // Wait for response
    const result = await res.json();
    console.log(result);
    navigate('/submission_success');

  }

  const buildAnswerType = (question, answerType) => {
    if (Array.isArray(answerType)) return (
      <RadioGroup defaultValue="female" onChange={(e) => handleAnswer(question, e.target.value)}>
        {answerType.map((option) => (
                <FormControlLabel value={option} control={<Radio />} label={option} />
              ))}
      </RadioGroup>
    );
    if (answerType === 'Number') return (
      <TextField type="number" variant="outlined"
        onChange={(e) => handleAnswer(question, e.target.value)} />
    );
    if (answerType === 'String') return (
      <TextField variant="outlined"
        onChange={(e) => handleAnswer(question, e.target.value)} />
    );
  };


  return (
    <>
      {data ? (
        <Box variant="outlined" sx={{ my: 3, mx: 5, maxWidth: 1800, width: '100%', borderRadius: 3, borderWidth: 2, borderColor: 'white', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
        <Card variant="outlined" sx={{ my: 4, mx: 0, borderRadius: 3, width: '100%', borderWidth: 2, borderColor: 'white'}}>
          <CardContent>
                <Stack spacing={0.5}>
                  <Typography variant="h1">{data.survey_name}</Typography>
      
                  <Typography variant="h4" color="text.secondary">
                    10 questions
                  </Typography>
      
                  <Typography variant="h4" color="text.secondary">
                    This is a test description that will be filled in later
                  </Typography>

                  <Typography variant="h5" color="text.secondary">
                    {'ID: '+ data['survey-id']}
                  </Typography>
                </Stack>
            </CardContent>
        </Card>

        <TextField type="number" label="User ID" variant="outlined"
        onChange={(e) => setID(e.target.value)} />

        <>
        {Object.entries(data.questions).map(([question, answerType], index) => (

          <Card key={index} variant="outlined" sx={{ my: 2, mx: 0, borderRadius: 3, width: '100%', borderWidth: 2, borderColor: 'white'}}>
            <CardContent>
              <Stack spacing={0.5}>
                <Typography variant="h4">{`${index+1}. ${question}`}</Typography>
                {buildAnswerType(question, answerType)}
              </Stack>
            </CardContent>
          </Card>
                
        ))}
        </>

        <Button variant="contained" color="primary" size="large"
            sx={{
              px: 5,
              py: 1.75,
              fontSize: "1.3rem",
              fontWeight: 600,
            }}
            onClick={submitAnswers}>
            Submit Answers
        </Button>

        <ArrowBackIcon sx={{ position: 'fixed', left: '50px', top: '50px', fontSize: '4rem', cursor: 'pointer' }} onClick={() => {navigate('/surveys')}}/>

        </Box>

        
    
    ) : (
    
    <h1>Loading...</h1>)}

    </>
  );
}

export default Survey;