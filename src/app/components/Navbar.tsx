export default function Navbar() {
  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center bg-gradient-to-r from-purple-900 shadow-md">
      <h1 className="text-2xl font-bold text-white tracking-widest">NeonMangá</h1>
      <div className="flex gap-4">
        <a href="#" className="text-gray-200 hover:text-white transition-colors">Home</a>
        <a href="#" className="text-gray-200 hover:text-white transition-colors">Sobre</a>
      </div>
    </nav>
  );
}
