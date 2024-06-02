/* eslint-disable @typescript-eslint/no-unused-vars */
import "./App.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import { useState } from "react";
import { AuthService } from "./services/AuthService";
import LoginComponent from "./components/LoginComponent";
import { DataService } from "./services/DataService";
import CreateSpace from "./components/spaces/CreateSpace";
import Spaces from "./components/spaces/Spaces";
import HomePage from "./components/HomePage";
import ProfilePage from "./components/ProfilePage";

// Creating AuthService class object for calling Authentication APIs
const authService = new AuthService();

// Creating DataService class object for calling APIs to save places
const dataService = new DataService(authService);

export default function App() {
  const [userName, setUserName] = useState<string | undefined>(undefined);

  const router = createBrowserRouter([
    {
      element: (
        <>
          <NavBar userName={userName} />
          <Outlet />
        </>
      ),
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/login",
          element: (
            <LoginComponent
              authService={authService}
              setUserNameCb={setUserName}
            />
          ),
        },
        {
          path: "/profile",
          element: <ProfilePage />,
        },
        {
          path: "/createSpace",
          element: <CreateSpace dataService={dataService} />,
        },
        {
          path: "/spaces",
          element: <Spaces dataService={dataService} />,
        },
      ],
    },
  ]);

  return (
    <div className="wrapper">
      <RouterProvider router={router} />
    </div>
  );
}
