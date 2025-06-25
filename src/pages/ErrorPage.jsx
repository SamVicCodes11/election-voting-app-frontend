import { useEffect } from "react";
import Image from "../images/404.gif";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  // redirect user to previous page after 6 seconds
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate(-1);
    }, 6000);
  });

  return (
    <section className="errorPage">
      <div className="errorPage_container">
        <img src={Image} alt="Page not found" />

        <h1>404</h1>

        <p>
         PAGE NOT FOUND
        </p>
      </div>
    </section>
  );
};

export default ErrorPage;
