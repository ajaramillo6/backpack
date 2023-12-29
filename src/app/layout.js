import './globals.css';

//Tools
import { Inter } from "next/font/google"

//Context
import { ThemeContextProvider } from '../context/ThemeContext'

//Components
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'
import ThemeProvider from '../providers/ThemeProvider'
import MobileNavbar from '../components/mobileNavbar/MobileNavbar'
import AuthProvider from '../providers/AuthProvider'

export const dynamic = 'auto'
export const dynamicParams = true

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Backpack',
  description: "Blog app for travel",
}

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeContextProvider>
            <ThemeProvider>
              <div className="container">
                <div className="wrapper">
                  <Navbar />
                  {children}
                  <Footer />
                </div>
                <MobileNavbar />
              </div>
            </ThemeProvider>
          </ThemeContextProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
