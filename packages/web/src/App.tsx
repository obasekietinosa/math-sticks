import { useState, useEffect } from 'react'
import { getSharedMessage } from '@math-sticks/shared'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function Home() {
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setMsg(getSharedMessage())
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold underline mb-4">
        Math Sticks Game
      </h1>
      <p className="mb-4">
        Shared message: {msg}
      </p>
      <Link to="/about" className="text-blue-500 hover:text-blue-700">Go to About</Link>
    </div>
  )
}

function About() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">About</h2>
      <Link to="/" className="text-blue-500 hover:text-blue-700">Back to Home</Link>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
