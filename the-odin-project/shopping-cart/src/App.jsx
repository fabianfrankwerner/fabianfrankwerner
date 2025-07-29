import { Link } from "react-router-dom";

const App = () => {
  return (
    <main className="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-br from-green-50 via-green-100 to-green-200 min-h-screen">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-gradient-to-tr from-green-400 to-green-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
        />
      </div>
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-balance text-green-900 sm:text-7xl drop-shadow-md">
            Buy regional vegetables online
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-green-700 sm:text-xl/8">
            We are your evergreen market. An online store where fresh,
            locally-grown vegetables meet your family's table every day.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="store">
              <span className="rounded-md bg-green-600 px-5 py-3 text-lg font-semibold text-white shadow-lg hover:bg-green-700 hover:scale-105 hover:shadow-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 cursor-pointer">
                Shop now <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-gradient-to-tr from-green-400 to-green-600 opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
        />
      </div>
    </main>
  );
};

export default App;
