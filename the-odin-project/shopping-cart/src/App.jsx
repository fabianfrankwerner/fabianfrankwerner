import { Link } from "react-router-dom";

const App = () => {
  return (
    <main className="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-br min-h-screen">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      ></div>
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-balance text-green-600 sm:text-7xl">
            Buy regional vegetables online
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-green-700 sm:text-xl/8">
            We are your evergreen market — an online store where fresh,
            locally-grown vegetables meet your family's table every day!
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="store">
              <span className="rounded-md bg-green-800 px-5 py-3 text-lg font-semibold text-white shadow-lg hover:bg-green-900 hover:scale-105 hover:shadow-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 cursor-pointer">
                Shop now <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      ></div>
    </main>
  );
};

export default App;
