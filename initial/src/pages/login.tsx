import Login, { Render } from 'react-login-page';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const login = () => 
  {
    //Create logic to actually login later
    console.log("TEST")
    navigate('/surveys');
  };

  return (
    <Login>
      <Render>
        {({ fields, buttons }) => (
          <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100vh', width: '175vh'}}>
            <h1>CIS 4010 Survey System</h1>
            <h2>Login</h2>
            <label>{fields.username}</label>
            <label>{fields.password}</label>
            <div>{buttons.submit}</div>
            <label>Don't have an account? <a href='/create_account'>Create one</a></label>
          </div>
        )}
      </Render>
      <Login.Input keyname="username" placeholder="Enter username" />
      <Login.Input keyname="password" placeholder="Enter password" type="password" />
      <Login.Button keyname="submit" type="submit" onClick={login}>Sign In</Login.Button>
    </Login>
  );
}

export default LoginPage;