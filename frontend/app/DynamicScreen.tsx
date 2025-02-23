import { useState, useEffect } from 'react';

export default function DynamicScreen() {
  const [randomNumber, setRandomNumber] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomNumber(Math.floor(Math.random() * 100)); // Generate a random number between 0-99
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="screen-content">
      <p>{randomNumber}</p>
    </div>
  );
}

