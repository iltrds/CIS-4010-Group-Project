import {
  Box,
  Button,
  TextField,      
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from "@mui/material";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SurveyCard from '../components/survey_card.tsx';

function Surveys() 
{
  type Survey = {
    'survey-id': number;
    survey_name: string;
    questions: Record<string, string | string[]>;
    'num-questions': number;
    'survey-description': string;
  }
  
  const [surveyList, setSurveys] = useState<Survey[]>([]);
  const [viewSurveyList, setViewSurveyList] = useState<Survey[]>([]);
  const [surveySearch, setSurveySearch] = useState<string>('');
  const [surveyAnswersList, setSurveyAnswers] = useState<Survey[]>([]);
  const [viewSurveyAnswersList, setViewSurveyAnswersList] = useState<Survey[]>([]);
  const [surveyAnswerSearch, setSurveyAnswerSearch] = useState<string>('');
  const navigate = useNavigate();

    // Fetch all surveys
    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      fetch('http://localhost:8080/api/fetch_all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(surveyList => {setSurveys(surveyList); setViewSurveyList(surveyList);});
    }, []);

    // Fetch user submissions
    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (!token) { 
        navigate('/login'); 
        return; 
      }
    
      fetch('http://localhost:8080/api/fetch_user_submissions', {
        headers: { 'Authorization': `Bearer ${token}` } // Forward token to the backend
      })
        .then(res => res.json())
        .then(data => {
          const submissions = Array.isArray(data) ? data : []; // Convert the response to an array, will be empty if no submissions
          setSurveyAnswers(submissions);
        })
        .catch(err => console.error('Submissions fetch error:', err));
    }, []);

    //Set surveys to view
    useEffect(() => {
      setViewSurveyList(surveyList.filter(survey => survey.survey_name.toLowerCase().includes(surveySearch.toLowerCase())));
    }, [surveySearch]);

    // set survey answers to view by cross referencing survey answers list with survey list
    useEffect(() => {
      if (surveyAnswersList.length === 0 || surveyList.length === 0) return;
    
      const answeredSurveys = surveyAnswersList
        .map(submission => surveyList.find(survey => survey['survey-id'] === submission['survey-id'])) // Find the survey that the user answered
        .filter(survey => survey !== undefined) as Survey[];
    
      setViewSurveyAnswersList(answeredSurveys); // Set the surveys to view as the surveys that the user answered
    }, [surveyAnswersList, surveyList]);
        


    //console.log(viewSurveyList);


    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100vw', height: '100vh' }}>
        <Box display='flex' flexDirection='column' position='relative' sx={{ minWidth: '900px', alignItems: 'center', m: '30px', border: "2px solid #ccc", borderRadius: "16px", py: 3, px: 12, boxSizing: "border-box", overflow: 'auto'}}>

          <Button variant="contained" color="primary" size="large"
                      sx={{
                        position: 'absolute',
                        left: '20px',
                        top: '40px',
                        width: '150px',
                        px: 5,
                        py: 1.75,
                        fontSize: "1.2rem",
                        fontWeight: 600,
                      }}
                      onClick={() => { navigate('/create') }}>
             Create Survey
          </Button>

          <Typography variant='h1' sx={{ mb: '10px' }}>Survey List</Typography>
            <TextField id="outlined-basic" label="Survey Name" variant="outlined" onChange={(e) => {setSurveySearch(e.target.value)}} sx={{ width: '500px' }}/>

          <Box sx={{ width: '100%', mt: 2}}>
            {viewSurveyList && viewSurveyList.map(survey => (
                <SurveyCard 
                  key={survey['survey-id']} 
                  id={survey['survey-id']} 
                  title={survey.survey_name} 
                  questionCount={survey['num-questions']} 
                  description={survey['survey-description']} 
                  viewMode={true}
                />
            ))}
          </Box>
  
        </Box>
        <Box display='flex' flexDirection='column' sx={{ alignItems: 'center', m: '30px', border: "2px solid #ccc", borderRadius: "16px", py: 3, px: 5, boxSizing: "border-box", overflow: 'auto' }}>
          <Typography variant='h1' sx={{ mb: '10px' }}>Answered Surveys</Typography>
            <TextField id="outlined-basic" label="Survey Name" variant="outlined"/>
            <Box sx={{ width: '100%', mt: 2}}>
              {viewSurveyAnswersList && viewSurveyAnswersList.map(survey => (
                <SurveyCard 
                  key={survey['survey-id']} 
                  id={survey['survey-id']} 
                  title={survey.survey_name} 
                  questionCount={survey['num-questions']} 
                  description={survey['survey-description']} 
                  viewMode={false} 
                />
              ))}
            </Box>
          
        </Box>
      </Box>
    );
}

export default Surveys;
