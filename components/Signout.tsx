"use client";
import React from 'react'
import { signOut } from 'next-auth/react';


const Signout = () => {
  return (
    <button onClick={() => signOut()}>logout</button>
  )
}

export default Signout