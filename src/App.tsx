import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { Login } from "./components/auth/Login";
import { Signup } from "./components/auth/Signup";
import { Theme } from "@radix-ui/themes";

import "@radix-ui/themes/styles.css";
import { Layout } from "./components/shared/Layout";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/queryClient";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import { TaskDashboardPage } from "./pages/TaskDashboardPage";
import { UndoProvider } from "./context/UndoContext";
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Theme appearance="light" radius="large">
        <UndoProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<TaskDashboardPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </UndoProvider>
      </Theme>
    </QueryClientProvider>
  );
}

export default App;
