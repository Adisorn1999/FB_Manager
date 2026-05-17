import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";

//import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Pages from "./pages/Pages";
import Pixels from "./pages/Pixels";
import Cards from "./pages/Cards";
import Links from "./pages/Links";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD */}
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        /> */}

        {/* ACCOUNTS */}
        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <Layout>
                <Accounts />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* PAGES */}
        <Route
          path="/pages"
          element={
            <ProtectedRoute>
              <Layout>
                <Pages />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* PIXELS */}
        <Route
          path="/pixels"
          element={
            <ProtectedRoute>
              <Layout>
                <Pixels />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* CARDS */}
        <Route
          path="/cards"
          element={
            <ProtectedRoute>
              <Layout>
                <Cards />
              </Layout>
            </ProtectedRoute>
          }
        />

         {/* LINKS */}
        <Route
          path="/links"
          element={
            <ProtectedRoute>
              <Layout>
                <Links />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/accounts" replace />} />
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;
