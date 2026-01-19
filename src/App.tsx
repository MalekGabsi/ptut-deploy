import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './components/home/Home'
import PlusInfos from './components/info/PlusInfos'


function App() {
    return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/informations" element={<PlusInfos />} />
    </Routes>
  )
}

export default App
