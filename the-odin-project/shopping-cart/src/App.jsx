import { Link } from "react-router-dom";
import Navigation from "./components/Navigation";

const App = () => {
  return (
    <>
      <Navigation />
      <div>
        <h1>Hello from the main page of the app!</h1>
        <p>Here are some examples of links to other pages</p>
        <nav>
          <ul>
            <li>
              <Link to="store">Profile page</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default App;
