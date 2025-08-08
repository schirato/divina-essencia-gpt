import { createRoutesFromElements, Route } from 'react-router-dom'
import Shell from './shell'
import Welcome from './pages/Welcome'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Report from './pages/Report'
import Planner from './pages/Planner'
import Affirmations from './pages/Affirmations'
import Achievements from './pages/Achievements'
import Inspiration from './pages/Inspiration'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import AuthGuard from './AuthGuard'

export default createRoutesFromElements(
  <Route element={<Shell />}>
    <Route index element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    <Route path="/home" element={<AuthGuard><Home /></AuthGuard>} />
    <Route path="/quiz" element={<Quiz />} />
    <Route path="/report" element={<AuthGuard><Report /></AuthGuard>} />
    <Route path="/planner" element={<AuthGuard><Planner /></AuthGuard>} />
    <Route path="/affirmations" element={<AuthGuard><Affirmations /></AuthGuard>} />
    <Route path="/achievements" element={<AuthGuard><Achievements /></AuthGuard>} />
    <Route path="/inspiration" element={<Inspiration />} />
    <Route path="/profile" element={<Profile />} />
  </Route>
)
