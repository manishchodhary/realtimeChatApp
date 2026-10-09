import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/page/Login";
import Register from "../features/auth/page/Register";
import Authlayout from "../layouts/Authlayout";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Authlayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);
