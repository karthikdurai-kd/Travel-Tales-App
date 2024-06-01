/* eslint-disable @typescript-eslint/no-unused-vars */
import "./App.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import { useState } from "react";
import { AuthService } from "./services/AuthService";
import LoginComponent from "./components/LoginComponent";
import { DataService } from "./services/DataService";
import CreateSpace from "./components/spaces/CreateSpace";

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
          element: <div>Hello world!</div>,
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
          element: <div>Profile page</div>,
        },
        {
          path: "/createSpace",
          element: <CreateSpace dataService={dataService} />,
        },
        {
          path: "/spaces",
          element: <div>Spaces page </div>,
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
