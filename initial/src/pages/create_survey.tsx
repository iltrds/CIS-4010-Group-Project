import { useState, useEffect } from 'react';
import {TextField, Button, Box, Card, Stack, CardContent, Typography, RadioGroup, FormControlLabel, Radio, FormControl, Select, MenuItem, InputLabel} from "@mui/material";
import { useNavigate, useParams} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
   
type Survey = {
    name: string;
    description: string;
    questions: {
        question: string;
        answer: string | string[];
    }[];
}

function CreateSurvey() {
  const [data, setData] = useState(null);
  const [survey, setSurvey] = useState<Survey>({
    name: '',
    description: '',
    questions: []
  }); // Track the survey

  const [questionType, setQuestionType] = useState<string>('');
  
  const navigate = useNavigate();
  const { surveyId } = useParams();

  // Handle whenever a survey answer is changed
  const handleAnswer = (question, answer) =>{
    setAnswers(prev => ({ ...prev, [question]: answer }));
  }

  const createSurvey = async () => {
    // Build final JSON to send back to database with answers
    const submissionJSON = {
        "user-id": { "N": "1" }, // FILL IN WITH ACTUAL USER_ID LATER
        "survey_name": { "S": survey.name },
        "survey_description": { "S": survey.description },
        "questions": {
            "M": Object.fromEntries(
                    survey.questions.map(q => [
                        q.question,
                        Array.isArray(q.answer) ? 
                        {   
                            "L": q.answer.map(a => ( { "S": a } ))
                        }
                    :   {
                            "S": q.answer
                        }
                ])
            )
        }
    }

    // Send the JSON back to express to send to database
    /*const res = await fetch('http://localhost:8080/api/submit_survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionJSON)
      });
    
    // Wait for response
    const result = await res.json();
    console.log(result);
    navigate('/submission_success');*/

    console.log(JSON.stringify(survey));
    console.log(JSON.stringify(submissionJSON));
  }

  const buildAnswerType = (question, index) => {
    if (Array.isArray(question.answer)) return (
        <Box display='flex' flexDirection='column' >
            <Box display='flex' flexDirection='row' alignItems='center'>
                <Typography variant="h4">{`Enter Question ${index+1}`}</Typography>
                <TextField variant="outlined" onChange={(e) => {
                    const newQuestions = [...survey.questions];
                    newQuestions[index].question = e.target.value;
                    setSurvey(prev => ({ ...prev, questions: newQuestions }))
                }}  sx={{ flexGrow: 1, m:'10px' }}/>
                <RemoveCircleOutlineIcon sx={{ fontSize: '4rem', cursor: 'pointer', color: '#f44336', '&:hover': { color: '#e57373' } }} onClick={() => removeQuestion(index)}/>
            </Box>

            <Typography variant="h5" color='text.secondary'>Datatype: multiple choice</Typography>

            <Stack  spacing={0.5}>
                {Array.isArray(question.answer) && question.answer.map((option, optionIndex) => (
                        
                    <Box key={`${index} ${optionIndex}`} display='flex' flexDirection='row' alignItems='center'>
                        <Typography variant="h5">{`Enter Option ${optionIndex+1}`}</Typography>
                        <TextField variant="outlined" value={option} onChange={(e) => handleAnswerChange(index, e.target.value, optionIndex)} sx={{ flexGrow: 1, m:'10px' }}/>
                        <RemoveCircleOutlineIcon sx={{ fontSize: '3rem', cursor: 'pointer', color: '#f44336', '&:hover': { color: '#e57373' } }} onClick={() => removeMcOption(index, optionIndex)}/>
                    </Box>
                ))}
            </Stack>   

            <Button variant="outlined" color="primary" size="large"
                    sx={{
                    px: 5,
                    py: 1.75,
                    mx: 10,
                    mt: 3,
                    fontSize: "1.3rem",
                    fontWeight: 600,
                    }}
                    onClick={() => addMcOption(index)}>
                    Add Option
            </Button>

            
        </Box>
      /*<RadioGroup defaultValue="female" onChange={(e) => handleAnswer(question, e.target.value)}>
        {answerType.map((option) => (
                <FormControlLabel value={option} control={<Radio />} label={option} />
              ))}
      </RadioGroup>*/
    )
    else return (
        <Box display='flex' flexDirection='column' >
            <Box display='flex' flexDirection='row' alignItems='center'>
                <Typography variant="h4">{`Enter Question ${index+1}`}</Typography>
                <TextField variant="outlined" onChange={(e) => {
                    const newQuestions = [...survey.questions];
                    newQuestions[index].question = e.target.value;
                    setSurvey(prev => ({ ...prev, questions: newQuestions }))
                }}  sx={{ flexGrow: 1, m:'10px' }}/>
                <RemoveCircleOutlineIcon sx={{ fontSize: '4rem', cursor: 'pointer', color: '#f44336', '&:hover': { color: '#e57373' } }} onClick={() => removeQuestion(index)}/>
            </Box>
            {question.answer === 'N' ?  <Typography variant="h5" color='text.secondary'>Datatype: number</Typography>
                                     :  <Typography variant="h5" color='text.secondary'>Datatype: string</Typography>
            }
        </Box>
    );
  };

  const addMcOption = (index: number) => 
  {
        setSurvey( prev => (
        {
            ...prev,
            questions: prev.questions.map((q, i) => 
                i === index ? 
                {
                    ...q,
                    answer:  Array.isArray(q.answer) ? [...q.answer, ''] : [q.answer, '']
                }
                : q)
        }
        ));
  }

  const removeMcOption = (questionIndex: number, optionIndex: number) => 
  {
    setSurvey(prev => ({
        ...prev,
        questions: prev.questions.map((q, i) =>
        i === questionIndex
        ? {
            ...q,
            answer: Array.isArray(q.answer)
            ? q.answer.filter((_, a_i) => a_i !== optionIndex)
            : q.answer 
        }
        : q
        )
    }));
};

  const handleAnswerChange = (index: number, option: string, optionIndex: number) => 
  {
    setSurvey((prev) => (
    {
        ...prev,
            questions: prev.questions.map((q, i) => 
                i === index ? 
                {
                    ...q,
                    answer: Array.isArray(q.answer) ? q.answer.map((a, a_i) => a_i === optionIndex ? option : a )
                                                    : q.answer
                }
                : q)
    }))
  }

  const handleQuestionChange = (index: number, value: string) => 
    {
        setSurvey((prev) => 
        {
            const updatedQuestions = [...prev.questions];

            updatedQuestions[index] = {
            ...updatedQuestions[index],
            question: value
            };

            return {
            ...prev,
            questions: updatedQuestions
            };
        });
    };

  const addNewQuestion = (questionType) => 
  {
        if (questionType == 'text')
        {
            setSurvey( prev => (
                {
                    ...prev,
                    questions: [
                        ...prev.questions,
                        {
                        question: "",
                        answer: "String"
                        }
                    ]
                }
            ));
        }
        else if (questionType == 'number')
        {
            setSurvey( prev => (
                {
                    ...prev,
                    questions: [
                        ...prev.questions,
                        {
                        question: "",
                        answer: "Number"
                        }
                    ]
                }
            ));
        }
        else
        {
            setSurvey( prev => (
                {
                    ...prev,
                    questions: [
                        ...prev.questions,
                        {
                            question: "",
                            answer: []
                        }
                    ]
                }
            ));
        }
        

        setQuestionType('');
  }

  const removeQuestion = (index:number) => 
  {
    setSurvey(prev => ({
        ...prev,
        questions: prev.questions.filter((_, q_i) => q_i !== index)
    }));
  }


  return (
        <Box variant="outlined" sx={{ my: 3, mx: 5, maxWidth: 1800, width: '100%', borderRadius: 3, borderWidth: 2, borderColor: 'white', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
        <Card variant="outlined" sx={{ my: 4, mx: 0, borderRadius: 3, width: '100%', borderWidth: 2, borderColor: 'white'}}>
          <CardContent>
                <Stack spacing={3}>
                    <Typography variant="h1">Create your own survey</Typography>

                    <Box display='flex' flexDirection='row' alignItems='center' color="text.secondary">
                        <Typography variant="h4" sx={{ mr: '15px'}}>Enter Survey Title</Typography>
                        <TextField variant="outlined" onChange={(e) => setSurvey(prev => ( { ...prev, name: e.target.value }))}  sx={{ flexGrow: 1, m:'10px' }}/>
                    </Box>
      
                    <Box display='flex' flexDirection='row' alignItems='center' color="text.secondary">
                        <Typography variant="h4" sx={{ mr: '15px'}}>Enter Survey Description</Typography>
                        <TextField variant="outlined" multiline rows={2} onChange={(e) => setSurvey(prev => ( { ...prev, description: e.target.value }))} sx={{ flexGrow: 1, m:'10px' }}/>
                    </Box>
                  
                </Stack>
            </CardContent>
        </Card>

        <>
        {survey.questions && survey.questions.map((question, index) => (

          <Card key={index} variant="outlined" sx={{ my: 2, mx: 0, borderRadius: 3, width: '100%', borderWidth: 2, borderColor: 'white'}}>
            <CardContent>
              <Stack spacing={0.5}>
                {buildAnswerType(question, index)}
              </Stack>
            </CardContent>
          </Card>
                
        ))}
        </>

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
                    onClick={() => addNewQuestion(questionType)}
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