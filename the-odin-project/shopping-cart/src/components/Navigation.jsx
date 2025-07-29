const Navigation = () => {
  return (
    <nav className="flex items-center justify-between bg-white shadow-lg px-8 py-6 rounded-lg mt-6 mb-8 mx-auto max-w-3xl">
      <img
        src="../../seed.svg"
        alt="Seed"
        className="h-10 w-10 object-contain transition-transform hover:scale-105"
      />
      <p className="text-3xl font-bold text-green-600 transition-transform hover:scale-105">
        Store
      </p>
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
    </nav>
  );
};

export default Navigation;
