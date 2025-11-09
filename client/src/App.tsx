import { BrowserRouter } from "react-router-dom";
import AppRoute from "./routes/AppRoute";
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(100, 116, 139, 0.2)',
            color: '#f8fafc',
            boxShadow: '0 0 1px rgba(59, 130, 246, 0.5), 0 8px 24px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(16px)',
            padding: '14px 18px',
            borderRadius: '10px',
            fontSize: '14px',
          },
        }}
      />
      <AppRoute />
    </BrowserRouter>
  )
}

export default App