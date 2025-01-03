import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/api/data').then((response) => {
      setData(response.data);
    });
  }, []);
  console.log(data)
  return (
    <div>
      <h1>Data from MySQL</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
