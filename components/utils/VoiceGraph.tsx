import React, { useEffect, useRef, useState } from "react"

interface VoiceGraphProps {
  stream: MediaStream
}

const VoiceGraph: React.FC<VoiceGraphProps> = ({ stream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [volumeHistory, setVolumeHistory] = useState<number[]>(new Array(160).fill(-1))

  useEffect(() => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const source = audioCtx.createMediaStreamSource(stream)
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 256

    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    source.connect(analyser)

    let intervalId: NodeJS.Timeout

    const calculateVolume = () => {
      analyser.getByteFrequencyData(dataArray)
      const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length
      return avg
    }

    const draw = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
      
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      
        const width = canvas.width
        const height = canvas.height
        const barWidth = width / 160 - 2 // Reduced width of bars
      
        volumeHistory.forEach((vol, i) => {
          const x = i * (barWidth + 2)
          const cappedVol = Math.min(vol, 200)
          const barHeight = vol !== -1 ? (cappedVol / 120) * height *4 : 2
          const y = height / 2 - barHeight / 2
      
          ctx.fillStyle = vol !== -1 ? "#111827" : "#4B5563"
          ctx.beginPath()
          ctx.fillRect(x, y, barWidth, barHeight)
        })
      }
      
      

    intervalId = setInterval(() => {
      const newVol = calculateVolume()
      setVolumeHistory(prev => {
        const updated = [...prev.slice(-159), newVol] // keep last 20, add new
        return updated
      })
    }, 40)

    const renderLoop = () => {
      draw()
      requestAnimationFrame(renderLoop)
    }

    renderLoop()

    return () => {
      clearInterval(intervalId)
      audioCtx.close()
    }
  }, [stream, volumeHistory])

  return (
      <canvas ref={canvasRef} width={600} height={20} className="rounded-md" />
  )
}

export default VoiceGraph
