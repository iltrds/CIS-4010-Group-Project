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
  }
  
  const [surveyList, setSurveys] = useState<Survey[]>([]);
  const [viewSurveyList, setViewSurveyList] = useState<Survey[]>([]);
  const [surveySearch, setSurveySearch] = useState<string>('');
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

    //Set surveys to view
    useEffect(() => {
      setViewSurveyList(surveyList.filter(survey => survey.survey_name.toLowerCase().includes(surveySearch.toLowerCase())));
    }, [surveySearch]);


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
                <SurveyCard key={survey['survey-id']} id={survey['survey-id']} title={survey.survey_name} questionCount={10} description='Test description until implemented' viewMode={true} />
            ))}
          </Box>
  
        </Box>
        <Box display='flex' flexDirection='column' sx={{ alignItems: 'center', m: '30px', border: "2px solid #ccc", borderRadius: "16px", py: 3, px: 5, boxSizing: "border-box", overflow: 'auto' }}>
          <Typography variant='h1' sx={{ mb: '10px' }}>Answered Surveys</Typography>
          <TextField id="outlined-basic" label="Survey Name" variant="outlined" sx={{ width: '500px' }}/>
        </Box>
      </Box>
    );
}

export default Surveys;
