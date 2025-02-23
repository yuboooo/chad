import { useState, useEffect } from 'react';

const sw =372;
const sh = 258;
const iw=4269;
const ih=2388;
const ir = iw/ih;
const sr = sw/sh;
const width_r = sw/iw;
const height_r = sh/ih;

const leftwidth = 1904;
const upperheight = 993;
const rightwidth = 2277;
const bottomheight = 1260;

const centershiftx_r = ((rightwidth+leftwidth) - iw)/iw/2;
const centershifty_r = ((bottomheight+upperheight) - ih)/ih/2;


function getScrPxSize():[number,number, number, number]{
    // at current frame
    const ww =  window.innerWidth;
    const wh = window.innerHeight;
    if(ww/wh > ir) {
        const true_width = ww*width_r;
        const true_height = true_width/sr;
        const true_left = ww*(leftwidth/iw);
       return [true_width, true_height, true_left, wh/2+wh*centershifty_r-true_height/2]; 
    } else {
        const true_height = wh*height_r;
        const true_width = true_height*sr;
        const true_top = wh*(upperheight/ih);
        return [true_width, true_height, ww/2+ww*centershiftx_r-true_width/2,true_top];
    }
}


export default function DynamicScreen() {
  const [randomNumber, setRandomNumber] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomNumber(Math.floor(Math.random() * 100)); // Generate a random number between 0-99
    }, 1000);

    const updateSz = () => {
        const [w,h,l,u] = getScrPxSize();
        document.documentElement.style.setProperty("--var1", `${w}px`);
        document.documentElement.style.setProperty("--var2", `${h}px`);
        document.documentElement.style.setProperty("--var3", `${l}px`);
        document.documentElement.style.setProperty("--var4", `${u}px`);
    };
    updateSz();
    const resizeListener = () => updateSz();
    window.addEventListener("resize", resizeListener);

    return () => {
        clearInterval(interval); // Cleanup interval on unmount
        window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return (
    <div className="screen-content">
      <p>{randomNumber}</p>
    </div>
  );
}

