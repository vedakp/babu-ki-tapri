import { useState, useEffect } from 'react';

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const [timeDigits, ampm] = timeString.split(' ');

  return (
    <div>
      <div className="text-3xl font-extralight tracking-tight text-white/90">
        {timeDigits}
        <span className="text-xs ml-2 opacity-50 font-medium tracking-widest uppercase">{ampm}</span>
      </div>
      <div className="text-[10px] mt-1 opacity-40 tracking-[0.2em] font-semibold uppercase">LOCAL TIME</div>
    </div>
  );
}
