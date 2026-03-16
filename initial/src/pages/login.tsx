import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signOut, fetchAuthSession } from 'aws-amplify/auth';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const login = async () => 
  {
    console.log('Login function triggered');
    if (!username || !password) {
      alert('Please enter a username and password');
      return;
    }

    // Sign out any existing session
    try {
      await signOut();
    } catch (error: any) {
      console.error('Sign out failed:', error);
    }

    // Sign in with  credentials
    try {
      const signInResult = await signIn({ username, password }); // Make call to AWS Cognito to sign in
      console.log('Sign in result:', signInResult);

      const session = await fetchAuthSession(); // Get session from AWS Cognito
      console.log('Session:', session);

      const token = session.tokens?.idToken?.toString(); // Get token from session and store in localStorage
      console.log('Token:', token);

      if (token) {
        localStorage.setItem('authToken', token);
        //console.log('Token stored in localStorage: ', token);
      } else {
        throw new Error('No token found in session');
      }

      navigate('/surveys'); // go to survey list page

    } catch (error: any) {
      console.error('Sign in failed:', error);
      alert(error.message || 'Login failed');
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1>CIS 4010 Survey System</h1>
      <h2>Login</h2>
      <input
        placeholder="Enter email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Enter password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Sign In</button>
      <label>Don't have an account? <a href='/create_account'>Create one</a></label>
    </div>
  );
}

export default LoginPage;