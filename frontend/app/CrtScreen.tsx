import { useState, useEffect } from 'react';
export default function CrtScreen() {
    const [randomNumber, setRandomNumber] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setRandomNumber(Math.floor(Math.random() * 100)); // Generate a random number between 0-99
      }, 1000);
  
    //   const updateSz = () => {
    //       const [w,h,l,u] = getScrPxSize();
    //       document.documentElement.style.setProperty("--var1", `${w}px`);
    //       document.documentElement.style.setProperty("--var2", `${h}px`);
    //       document.documentElement.style.setProperty("--var3", `${l}px`);
    //       document.documentElement.style.setProperty("--var4", `${u}px`);
    //   };
    //   updateSz();
    //   const resizeListener = () => updateSz();
    //   window.addEventListener("resize", resizeListener);
  
      return () => {
          clearInterval(interval); // Cleanup interval on unmount
        //   window.removeEventListener("resize", resizeListener);
      };
    }, []);
  
    return (
      <div className="crt">
        <p>{randomNumber}</p>
      </div>
    );
  }
  