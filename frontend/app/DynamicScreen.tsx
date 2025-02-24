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
  const [blinkState, setBlinkState] = useState(false);
  const [eyeMove, setEyeMove] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Blink animation - more frequent for cuteness
    const blinkInterval = setInterval(() => {
      setBlinkState(prev => !prev);
    }, 4000);

    // Subtle eye movement
    const moveInterval = setInterval(() => {
      setEyeMove({
        x: Math.sin(Date.now() / 1000) * 3,
        y: Math.cos(Date.now() / 1500) * 2
      });
    }, 50);


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
        clearInterval(blinkInterval);
        clearInterval(moveInterval);
        window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return (
    <div className="screen-content crt">
      <div className="cute-face">
        <div className="eyes">
          <div 
            className={`eye ${blinkState ? 'blink' : ''}`}
            style={{ transform: `translate(${eyeMove.x}px, ${eyeMove.y}px)` }}
          />
          <div 
            className={`eye ${blinkState ? 'blink' : ''}`}
            style={{ transform: `translate(${eyeMove.x}px, ${eyeMove.y}px)` }}
          />
        </div>
      </div>
    </div>
  );
}

