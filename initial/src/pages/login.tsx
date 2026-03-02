import Login, { Render } from 'react-login-page';

function LoginPage() {
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
          </div>
        )}
      </Render>
      <Login.Input keyname="username" placeholder="Enter username" />
      <Login.Input keyname="password" placeholder="Enter password" type="password" />
      <Login.Button keyname="submit" type="submit">Login</Login.Button>
    </Login>
  );
}

export default LoginPage;