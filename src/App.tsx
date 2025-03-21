import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [tiempoEstudio, setTiempoEstudio] = useState(() => {
    const storedData = JSON.parse(localStorage.getItem('TIEMPOS') || '{}');
    return storedData.estudio || 0;
  });

  const [tiempoOtros, setTiempoOtros] = useState(() => {
    const storedData = JSON.parse(localStorage.getItem('TIEMPOS') || '{}');
    return storedData.otros || 0;
  });

  const [swap, setSwap] = useState(false);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);


  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        const start = JSON.parse(localStorage.getItem('INICIO') || '').startingTime
        setTiempoEstudio(() => swap ? Math.max(0, Math.floor((Date.now() - start) / 1000) - tiempoOtros) : tiempoEstudio);
setTiempoOtros(() => !swap ? Math.max(0, Math.floor((Date.now() - start) / 1000) - tiempoEstudio) : tiempoOtros);
      }, 1000);


    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, swap]);

  useEffect(() => {
    const tiempos = { estudio: tiempoEstudio, otros: tiempoOtros };
    localStorage.setItem('TIEMPOS', JSON.stringify(tiempos));

  }, [tiempoEstudio, tiempoOtros]);
  const changeSwap = () => (
    setSwap(!swap)
  );
  const handleRestart = () => {
    setTiempoEstudio(0);
    setTiempoOtros(0);
    setRunning(false);
    localStorage.clear()
  };
  const handlePause = () => {
    if (running) {
      localStorage.setItem('PAUSA', JSON.stringify({ pauseTime: Date.now() }));
      setRunning(false);
    } else {
      const pausaGuardada = JSON.parse(localStorage.getItem('PAUSA') || '{}').pauseTime;

      if (pausaGuardada) {
        const tiempoPausado = Date.now() - pausaGuardada;

        const inicioGuardado = JSON.parse(localStorage.getItem('INICIO') || '{}');
        if (inicioGuardado.startingTime) {
          localStorage.setItem('INICIO', JSON.stringify({ startingTime: inicioGuardado.startingTime + tiempoPausado }));
        }
      }

      setRunning(true);
    }
  };

  const calcHours = (val: number) => Math.floor((val / 60) / 60);
  const calcMinutes = (val: number) => Math.floor(val / 60) % 60;
  const calcSeconds = (val: number) => val % 60;
  const formatTime = (val: number) => ('0' + val).slice(-2);

  let show = tiempoEstudio === 0 && tiempoOtros === 0 ? 'hide' : 'show';
  const total = tiempoEstudio + tiempoOtros;

  return (
    <>
      <div className="study area">
        <h1>Estudio</h1>
        <h2>{calcHours(tiempoEstudio)}:{formatTime(calcMinutes(tiempoEstudio))}:{formatTime(calcSeconds(tiempoEstudio))}</h2>
        <button
          style={tiempoEstudio !== 0 || tiempoOtros !== 0 ? { display: 'none' } : { display: 'block' }}
          onClick={() => { setSwap(true); setRunning(true); localStorage.setItem('INICIO', JSON.stringify({ startingTime: Date.now() })) }}>
          Start
        </button>
      </div>
      <div className="other area">
        <h1>Otros</h1>
        <h2>{calcHours(tiempoOtros)}:{formatTime(calcMinutes(tiempoOtros))}:{formatTime(calcSeconds(tiempoOtros))}</h2>
        <button
          style={tiempoEstudio !== 0 || tiempoOtros !== 0 ? { display: 'none' } : { display: 'block' }}
          onClick={() => { setSwap(false); setRunning(true); localStorage.setItem('INICIO', JSON.stringify({ startingTime: Date.now() })) }}>
          Start
        </button>
      </div>
      <div className="total">
        <h2>Total</h2>
        <h3>{calcHours(total)}:{formatTime(calcMinutes(total))}:{formatTime(calcSeconds(total))}</h3>
      </div>

      <div className={`buttons ${show}`}>
        {tiempoEstudio === 0 && tiempoOtros === 0
          ? <button style={{ visibility: 'hidden' }}>asas</button>
          : <button style={swap ? { backgroundColor: '#502d14' } : { backgroundColor: '#111846' }} onClick={changeSwap}>Swap</button>
        }
        {running
          ? <button onClick={() => handlePause()}>Pausar</button>
          : <button onClick={() => handlePause()}>Continuar</button>
        }
        <button onClick={handleRestart}>Reiniciar</button>
      </div>
    </>
  );
}

export default App;
