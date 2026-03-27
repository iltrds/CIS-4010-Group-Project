import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from 'aws-amplify/auth';


function AccountPage() {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const createAccount = async () => {
    console.log('Create account function triggered');
    if (!username || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await signUp({ username, password });
      alert('Account created successfully! You can now log in.');
      navigate('/login');
    } catch (error: any) {
      console.error('Sign up failed:', error);
      alert(error.message || 'Account creation failed');
    }    
};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1>CIS 4010 Survey System</h1>
      <h2>Create Account</h2>
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
      <input
        placeholder="Confirm password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={createAccount}>Create Account</button>
      <label>Already have an account? <a href='/login'>Login</a></label>
    </div>
  );
};
export default AccountPage;