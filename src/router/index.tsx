import Home from "../pages/home/Home";
import { useRoutes } from "react-router-dom";
import Layout from "../pages/layout/Layout";
import Auth from "../pages/auth/Auth";
import Login from "../pages/login/Login";
import Customer from "@/pages/customer/Customer";
import Seller from "@/pages/seller/Seller";
import Products from "@/pages/products/Products";

const Routers = () => {
  return (
    <>
      {useRoutes([
        {
          path: "/",
          element: <Auth />,
          children: [
            {
              path: "/",
              element: <Layout />,
              children: [
                {
                  path: "/",
                  element: <Home />,
                  children: [
                    {
                      path: "/",
                      element: <Customer/>
                    },
                    {
                      path: "/seller",
                      element: <Seller/>
                    },
                    {
                      path: "/products",
                      element: <Products/>
                    },
                  ]
                },
              ],
            },
          ],
        },
        {
          path: "/login",
          element: <Login/>,
        },
        {
          path: "*",
          element: <div>404</div>,
        },
      ])}
    </>
  );
};

export default Routers;
