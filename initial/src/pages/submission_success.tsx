import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Submission(){
    const navigate = useNavigate();

    const goBack = () => {
        navigate('/surveys');
    }

    return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '175vh',
            textAlign: 'center'
          }}
        >
          <Typography variant="h1">Survey submitted!</Typography>
          <Typography  variant="h4" color="text.secondary">Thank you for your submission</Typography>
          <Button onClick={goBack}>Go Back</Button>

        </Box>
      );

}

export default Submission;