import Login, { Render } from 'react-login-page';

function AccountPage() {
  return (
    <Login>
      <Render>
        {({ fields, buttons }) => (
          <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100vh', width: '175vh'}}>
            <h1>Account Creation</h1>
            <label>{fields.username}</label>
            <label>{fields.password}</label>
            <label>{fields.passwordConfirm}</label>
            <div>{buttons.submit}</div>
            <label>Already have an account? <a href='/login'>Login</a></label>
          </div>
        )}
      </Render>
      <Login.Input keyname="username" placeholder="Enter username" />
      <Login.Input keyname="password" placeholder="Enter password" type="password" />
      <Login.Input keyname="passwordConfirm" placeholder="Confirm password" type="passwordConfirm" />
      <Login.Button keyname="submit" type="submit">Create Account</Login.Button>
    </Login>
  );
}

export default AccountPage;