import React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "@/components/LandingPage"
import "@/App.css"
import Page from "./dashboard/Page"
import { TabsDemo } from "./dashboard/SpeakTest/speaktext"
import LoginPage from "./Login/LoginPage"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/dashboard" element={<Page />} />
          <Route path="/speaktest" element={<TabsDemo isSidebarCollapsed={false} />} />
        
<Route path="/:tool" element={<Page/>} />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App