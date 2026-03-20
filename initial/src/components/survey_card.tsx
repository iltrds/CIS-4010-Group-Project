import React from "react";
import { Card, CardContent, Stack, Typography, Button, Box } from "@mui/material";
import { useNavigate } from 'react-router-dom';

interface SurveyCardProps {
  id: number;
  title: string;
  questionCount: number;
  description: string;
  viewMode?: boolean; // if true -> "Answer", if false -> "View Answer"
}

const SurveyCard: React.FC<SurveyCardProps> = ({ id, title, questionCount, description, viewMode}) => 
{
  const navigate = useNavigate();

  return (
    <Card variant="outlined" sx={{ my: 4, width: 700, mx: 0, borderRadius: 3, borderWidth: 2, borderColor: 'white'}}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack spacing={0.5}>
            <Typography variant="h6">{title}</Typography>

            <Typography variant="body1" color="text.secondary">
              {questionCount} questions
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Stack>

          <Button variant="contained" color="primary" size="large"
            sx={{
              px: 5,
              py: 1.75,
              fontSize: "1rem",
              fontWeight: 600,
            }}
            onClick={() => {
              if (viewMode) navigate(`/survey/${id}`);
              else navigate(`/survey_submission/${id}`);
            }}>
            {viewMode ? "ANSWER" : "VIEW ANSWER"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SurveyCard;