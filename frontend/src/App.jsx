import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./components/pages/login-page"
import RegisterPage from "./components/pages/register-page"
const App = () => {
  return (
    <BrowserRouter>
      <main className="main-div ">
        <Routes>
          <Route element={<LoginPage />} path="/"/>
          <Route element={<RegisterPage />} path="/register"/>
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
