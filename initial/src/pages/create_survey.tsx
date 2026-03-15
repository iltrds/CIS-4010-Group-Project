import { useState, useEffect } from 'react';
import {TextField, Button, Box, Card, Stack, CardContent, Typography, RadioGroup, FormControlLabel, Radio, FormControl, Select, MenuItem, InputLabel} from "@mui/material";
import { useNavigate, useParams} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
   
type Survey = {
    name: string;
    description: string;
    questions: {
        question: string;
        answer: string | number | string[];
    }[];
}

function CreateSurvey() {
  const [data, setData] = useState(null);
  const [survey, setSurvey] = useState<Survey>({}); // Track the survey

  const [questionType, setQuestionType] = useState<string>('');
  
  const navigate = useNavigate();
  const { surveyId } = useParams();

  // Handle whenever a survey answer is changed
  const handleAnswer = (question, answer) =>{
    setAnswers(prev => ({ ...prev, [question]: answer }));
    console.log(answers)
  }

  const createSurvey = async () => {
    // Build final JSON to send back to database with answers
    /*const submissionJSON = {
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
    console.log(result);*/
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

  const addNewQuestion = (e) => 
  {
        

        setQuestionType('');
  }


  return (
        <Box variant="outlined" sx={{ my: 3, mx: 5, maxWidth: 1800, width: '100%', borderRadius: 3, borderWidth: 2, borderColor: 'white', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
        <Card variant="outlined" sx={{ my: 4, mx: 0, borderRadius: 3, width: '100%', borderWidth: 2, borderColor: 'white'}}>
          <CardContent>
                <Stack spacing={3}>
                    <Typography variant="h1">Create your own survey</Typography>

                    <Box display='flex' flexDirection='row' alignItems='center' color="text.secondary">
                        <Typography variant="h4" sx={{ mr: '15px'}}>Enter Survey Title</Typography>
                        <TextField variant="outlined" onChange={(e) => handleAnswer("name", e.target.value)} sx={{ flexGrow: 1, m:'10px' }}/>
                    </Box>
      
                    <Box display='flex' flexDirection='row' alignItems='center' color="text.secondary">
                        <Typography variant="h4" sx={{ mr: '15px'}}>Enter Survey Description</Typography>
                        <TextField variant="outlined" multiline rows={2} onChange={(e) => handleAnswer("description", e.target.value)} sx={{ flexGrow: 1, m:'10px' }}/>
                    </Box>
                  
                </Stack>
            </CardContent>
        </Card>

        <Card display='flex' flexDirection='row' alignItems='center' justifyContent='space-evenly' variant="outlined" sx={{ my: 4, mx: 0, borderRadius: 3, width: '100%', borderWidth: 2, borderColor: 'white'}}>
            <CardContent>
                <Stack spacing={3} display='flex' flexDirection='row' alignItems='center' justifyContent='space-evenly'>
                    <FormControl sx={{ width: '300px' }}>
                        <InputLabel id='question-type-label'>Select Question Type</InputLabel>
                        <Select
                            labelId='question-type-label'
                            id="question-type-select"
                            value={questionType}
                            label="Select Question Type"
                            onChange={(e) => { setQuestionType(e.target.value) }}
                        >
                            <MenuItem value={'text'}>Text Field</MenuItem>
                            <MenuItem value={'number'}>Number Field</MenuItem>
                            <MenuItem value={'select'}>Multiple Choice Field</MenuItem>
                        </Select>
                    </FormControl>

                    <Button variant="contained" color="primary" size="large"
                    sx={{
                    px: 5,
                    py: 1.75,
                    fontSize: "1.3rem",
                    fontWeight: 600,
                    }}
                    onClick={addNewQuestion}
                    disabled={questionType == ''}>
                    Add Question
                    </Button>
                </Stack>
            </CardContent>
        </Card>

        <>
        {/*Object.entries(data.questions).map(([question, answerType], index) => (

          <Card key={index} variant="outlined" sx={{ my: 2, mx: 0, borderRadius: 3, width: '100%', borderWidth: 2, borderColor: 'white'}}>
            <CardContent>
              <Stack spacing={0.5}>
                <Typography variant="h4">{`${index+1}. ${question}`}</Typography>
                {buildAnswerType(question, answerType)}
              </Stack>
            </CardContent>
          </Card>
                
        ))*/}
        </>

        <Button variant="contained" color="primary" size="large"
            sx={{
              px: 5,
              py: 1.75,
              fontSize: "1.3rem",
              fontWeight: 600,
            }}
            onClick={createSurvey}>
            Create Survey
        </Button>

        <ArrowBackIcon sx={{ position: 'fixed', left: '50px', top: '50px', fontSize: '4rem', cursor: 'pointer' }} onClick={() => {navigate('/surveys')}}/>

        </Box>

  );
}

export default CreateSurvey;