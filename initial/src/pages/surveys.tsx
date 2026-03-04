import {
  Box,
  Button,
  TextField,
  Typography
} from "@mui/material";


function Surveys() 
{
  return (
    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100vw', height: '100vh'}}>

      <Box display='flex' flexDirection='column' sx={{ alignItems: 'center', m: '30px', border: "2px solid #ccc", borderRadius: "16px", py: 3, px: 20, boxSizing: "border-box"}}>
        <Typography variant='h1' sx={{ mb: '10px', alignItems: 'center'}}>Survey List</Typography>
        <TextField id="outlined-basic" label="Survey Name" variant="outlined" />
      </Box>

      <Box display='flex' flexDirection='column' sx={{ alignItems: 'center', m: '30px', border: "2px solid #ccc", borderRadius: "16px", py: 3, px: 5, boxSizing: "border-box"}}>
        <Typography variant='h1' sx={{ mb: '10px', alignItems: 'center'}}>Answered Surveys</Typography>
        <TextField id="outlined-basic" label="Survey Name" variant="outlined" />
      </Box>

    </Box>
  );
}

export default Surveys;