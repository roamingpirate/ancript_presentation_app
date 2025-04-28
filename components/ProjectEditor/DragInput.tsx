'use client'

import * as Icons from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { off } from 'process'

interface DragInputProps {
  label: string
  value: number
  setValue: React.Dispatch<React.SetStateAction<number>>
  iconName?: keyof typeof Icons
  min?: number
  max?: number
  offset?: number
}

const DragInput: React.FC<DragInputProps> = ({ label, value, setValue, iconName, min = -Infinity, max = Infinity, offset = 0.3 }) => {
  const IconComponent = iconName ? Icons[iconName] as LucideIcon : null
  const spanRef = useRef<HTMLSpanElement>(null)
  const [dragging, setDragging] = useState(false)

  const roundToTwo = (val: number) => parseFloat(val.toFixed(2))

  const clamp = (val: number) => Math.min(max, Math.max(min, roundToTwo(val)))

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    if (!isNaN(newValue)) {
      setValue(clamp(newValue))
    }
  }

  const requestPointerLock = () => {
    spanRef.current?.requestPointerLock()
  }

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement === spanRef.current) {
        const delta = event.movementX * offset
        setValue((v) => clamp(v + delta))
      }
    }

    const handleMouseUp = () => {
      if (document.pointerLockElement === spanRef.current) {
        document.exitPointerLock()
      }
      setDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [setValue, min, max])

  return (
    <div className='rounded-lg bg-gray-200 w-fit px-2 py-1 flex items-center gap-1 justify-center h-[28px]'>
      <span
        ref={spanRef}
        className='flex items-center gap-1 cursor-ew-resize select-none'
        onMouseDown={() => {
          setDragging(true)
          requestPointerLock()
        }}
      >
        {IconComponent && (
          <IconComponent size={15} strokeWidth={1.5} className='text-gray-500' />
        )}
        {label && (
          <p className='text-gray-500 text-xs font-light'>
            {label}
          </p>
        )}
      </span>
      <input
        type='text'
        inputMode='decimal'
        className='bg-transparent text-gray-900 text-[13px] w-[50px] outline-none text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
        value={value}
        onChange={handleInputChange}
      />
    </div>
  )
}

export default DragInput
