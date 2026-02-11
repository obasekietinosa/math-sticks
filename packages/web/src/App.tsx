import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Game from './components/Game'

function Home() {
  return (
    <div className="p-4">
      <Game />
    </div>
  )
}

function About() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">About</h2>
      <p>Math Sticks is a game where you rearrange matchsticks to form numbers.</p>
      <Link to="/" className="text-blue-500 hover:text-blue-700 mt-4 inline-block">Back to Home</Link>
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
