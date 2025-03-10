import { useState } from 'react'
import { useEffect } from 'react';
import './App.css'

function App() {
  const [tiempoEstudio, setTiempoEstudio] = useState(0);
  const [tiempoOtros, setTiempoOtros] = useState(0);
  const [swap, setSwap] = useState(false);
  const [running, setRunning] = useState(false)

  const Button = ({ children, side }: { children: string, side: string }) => {
    return (

      <button style={tiempoEstudio != 0 || tiempoOtros != 0 ? { display: 'none' } : { display: 'block' }} onClick={() => {
        if (side === 'study') {
          setSwap(true)
          setRunning(true)
        }
        else {
          setSwap(false)
          setRunning(true)
        }
      }}>
        {children}
      </button>
    )
  }




  useEffect(() => {
    let id: number | undefined
    if (running) {
      id = setInterval(() => {
        swap ? setTiempoEstudio((prevTime) => prevTime + 1) : setTiempoOtros((prevTime) => prevTime + 1)
        
      }, 1000) 
  
    }
    else {
      clearInterval(id);
    }


    return () => clearInterval(id);
  }, [running, swap]);

  const changeSwap = () => {
    setSwap(!swap)

   
  }
  const calcHours = (val: number) => Math.floor((val / 60) / 60)
  const calcMinutes = (val: number) => Math.floor(val / 60) %60
const calcSeconds = (val:number) => val % 60
  const formatTime = (val: number) => {
    return ('0' + val).slice(-2)
  }

  return (
    <>
      <div className="study area">
        <h1>Estudio</h1>
        <h2>{calcHours(tiempoEstudio)}:{formatTime(calcMinutes(tiempoEstudio))}:{formatTime(calcSeconds(tiempoEstudio))}</h2>
        <Button side='study'>Start</Button>

      </div>
      <div className="other area">
        <h1>Otros</h1>
        <h2>{calcHours(tiempoOtros)}:{formatTime(calcMinutes(tiempoOtros))}:{formatTime(calcSeconds(tiempoOtros))}</h2>
        <Button side='other'>Start</Button>
      </div>
      <div className='buttons'>
       {tiempoEstudio == 0 && tiempoOtros == 0 ? <button style={{visibility:'hidden'}}>asas</button> :  <button style={swap ? {backgroundColor:'#502d14'} : {backgroundColor:'#111846'}}  onClick={() => changeSwap()}>Swap</button>}
        {running ? <button onClick={() => setRunning(false)}>Pausar</button> : <button onClick={() => setRunning(true)}>Continuar</button>}
        <button onClick={() => { setTiempoEstudio(0); setTiempoOtros(0); setRunning(false); }}>Reiniciar</button>
      </div>
    </>
  );
};

export default App
