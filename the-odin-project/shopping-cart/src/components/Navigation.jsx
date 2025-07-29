import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="flex items-center justify-between bg-green-100 shadow-lg px-4 py-4 sm:px-8 sm:py-6 rounded-lg mt-4 sm:mt-6 mb-8 mx-auto max-w-xs sm:max-w-md gap-2 sm:gap-4 hover:bg-green-900 hover:scale-105 hover:shadow-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 cursor-pointer">
      <Link to="/">
        <img
          src="../../seed.svg"
          alt="Seed"
          className="h-10 w-10 object-contain transition-transform hover:scale-105"
        />
      </Link>
      <Link to="store">
        <p className="text-3xl sm:text-4xl font-bold text-green-600 hover:text-green-100 hover:scale-105 transition-all duration-200">
          Store
        </p>
      </Link>
      <Link to="basket">
        <button className="relative transition-transform hover:scale-105">
          <img
            src="../../basket.svg"
            alt="Basket"
            className="h-10 w-10 object-contain"
          />
          <span className="absolute -bottom-2 -right-2 bg-green-600 text-white text-xs rounded-full px-2 py-0.5">
            5
          </span>
        </button>
      </Link>
    </nav>
  );
};

export default Navigation;
