import { useState, useEffect } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import {TextField, Button, Box, Card, Stack, CardContent, Typography, RadioGroup, FormControlLabel, Radio} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Survey {
  'survey-id': number;
  survey_name: string;
  questions: Record<string, string | number[]>;
}

interface Submission {
  'survey-id': number;
  answers: Record<string, string | number>;
}
   
function SurveySubmission() {

  const navigate = useNavigate();
  const { surveyId } = useParams<{ surveyId: string }>(); // Get the survey ID from the URL

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);



  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {

      try {
        const surveyResponse = await fetch(`http://localhost:8080/api/fetch_survey/${surveyId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const surveyData = await surveyResponse.json();
        setSurvey(surveyData);

        const submissionResponse = await fetch('http://localhost:8080/api/fetch_user_submissions',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const submissionData = await submissionResponse.json();
        
        const submissions = Array.isArray(submissionData) ? submissionData : []; // Convert the response to an array, will be empty if no submissions

        // Find the matching submission for the survey
        const matchingSubmission = submissions.find(
          (s: Submission) => s['survey-id'] === Number(surveyId)
        );

        if (matchingSubmission) {
          setSubmission(matchingSubmission);
        } else {
          setSubmission(null);
        }        
      } catch (error) {
        console.error('Error fetching survey:', error);
      }
    }
    
    fetchData();
  }, [surveyId]);

  return (
    <>
      {survey && submission ? (
        <Box sx={{ my: 3, mx: 5, maxWidth: 1800, width: '100%', borderRadius: 3, borderWidth: 2, borderColor: 'white', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
          
          {/* Survey Header Card */}
          <Card variant="outlined" sx={{ my: 4, mx: 0, borderRadius: 3, width: '100%', borderWidth: 2, borderColor: 'white' }}>
            <CardContent>
              <Stack spacing={0.5}>
                <Typography variant="h1">{survey.survey_name}</Typography>
                <Typography variant="h4" color="text.secondary">
                  Your submitted answers
                </Typography>
              </Stack>
            </CardContent>
          </Card>
  
          {/* One card per question showing the submitted answer */}
          {Object.entries(survey.questions).map(([question], index) => (
            <Card key={index} variant="outlined" sx={{ my: 2, mx: 0, borderRadius: 3, width: '100%', borderWidth: 2, borderColor: 'white' }}>
              <CardContent>
                <Stack spacing={0.5}>
                  <Typography variant="h4">{`${index + 1}. ${question}`}</Typography>
                  <Typography variant="h5" color="text.secondary">
                    {String(submission.answers[question] ?? 'No answer provided')}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
  
          <ArrowBackIcon sx={{ position: 'fixed', left: '50px', top: '50px', fontSize: '4rem', cursor: 'pointer' }} onClick={() => navigate('/surveys')} />
  
        </Box>
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
}

export default SurveySubmission;