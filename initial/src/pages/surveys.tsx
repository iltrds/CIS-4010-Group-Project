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

function Surveys() 
{
  type Survey = {
    'survey-id': number;
    survey_name: string;
    questions: Record<string, string | string[]>;
  }
  
  const [surveyList, setSurveys] = useState<Survey[]>([]);
  const navigate = useNavigate();

    // Fetch all surveys
    useEffect(() => {
      fetch('http://localhost:8080/api/fetch_all')
        .then(res => res.json())
        .then(surveyList => setSurveys(surveyList));
    }, []);


    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100vw', height: '100vh' }}>
        <Box display='flex' flexDirection='column' sx={{ alignItems: 'center', m: '30px', border: "2px solid #ccc", borderRadius: "16px", py: 3, px: 20, boxSizing: "border-box" }}>
          <Typography variant='h1' sx={{ mb: '10px' }}>Survey List</Typography>
          <TextField id="outlined-basic" label="Survey Name" variant="outlined" />
  
          <List sx={{ width: '100%', mt: 2 }}>
            {surveyList && surveyList.map(survey => (
              <ListItem key={survey['survey-id']} disablePadding>
                <ListItemButton onClick={() => navigate(`/survey/${survey['survey-id']}`)}>
                  <ListItemText primary={survey.survey_name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
  
        </Box>
        <Box display='flex' flexDirection='column' sx={{ alignItems: 'center', m: '30px', border: "2px solid #ccc", borderRadius: "16px", py: 3, px: 5, boxSizing: "border-box" }}>
          <Typography variant='h1' sx={{ mb: '10px' }}>Answered Surveys</Typography>
          <TextField id="outlined-basic" label="Survey Name" variant="outlined" />
        </Box>
      </Box>
    );
}

export default Surveys;