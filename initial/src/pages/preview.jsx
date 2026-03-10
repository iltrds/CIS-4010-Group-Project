import { useState, useEffect } from 'react';

function Preview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/data')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      {data ? <p>{data.message}</p> : <p>Loading...</p>}
    </div>
  );
}

export default Preview;