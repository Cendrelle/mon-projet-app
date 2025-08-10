import { useState } from 'react';
import './App.css';

type Props = {
  name: string;
};

function Welcome({ name }: Props) {
  return <h1>Hello {name}</h1>;
}

function App() {
  const [username, setUsername] = useState<string>('Cendrelle');

  return (
    <div>
      <Welcome name={username} />
      <button onClick={() => setUsername('Faizoun')}>Changer le nom</button>
    </div>
  );
}

export default App;
