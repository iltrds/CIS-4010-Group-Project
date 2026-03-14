import { useState, useEffect } from 'react';
import {TextField, Button} from "@mui/material";
import { useNavigate, useParams} from 'react-router-dom';

function Survey() {
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({}); // Track the answers
  const [userID, setID] = useState(null); // UserID
  
  const navigate = useNavigate();
  const { surveyId } = useParams();

  // Fetch the initial survey
  useEffect(() => {
    console.log('surveyId:', surveyId);
    fetch(`http://localhost:8080/api/fetch_survey/${surveyId}`)
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
      <select onChange={(e) => handleAnswer(question, e.target.value)}>
        {answerType.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
    if (answerType === 'Number') return (
      <TextField type="number" label={question} variant="outlined"
        onChange={(e) => handleAnswer(question, e.target.value)} />
    );
    if (answerType === 'String') return (
      <TextField label={question} variant="outlined"
        onChange={(e) => handleAnswer(question, e.target.value)} />
    );
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200%' }}>
      {data ? (
        <>
        <h1>{data.survey_name}</h1>
        <h2>{'ID: '+ data['survey-id']}</h2>

        <TextField type="number" label="User ID" variant="outlined"
        onChange={(e) => setID(e.target.value)} />

        {Object.entries(data.questions).map(([question, answerType], index) => (
            <div key={index} style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center',
                gap: '20px',
                margin: '10px 0'
              }}>
                <p>{index + 1}. {question}</p>
                {buildAnswerType(question, answerType)}

                {/* <p>Answer Type: {getAnswerType(answerType)}</p> */}
            </div>
        ))}

        <Button onClick={submitAnswers}>Submit Answers</Button>

        </>
    
    ) : (
    
    <h1>Loading...</h1>)}

    </div>
  );
}

export default Survey;