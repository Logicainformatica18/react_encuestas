import { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="w-full  text-white shadow-md" style={{ background: 'linear-gradient(to right, #F49A1A 80%, #ffac47)' }}>
      <nav className="flex flex-col lg:flex-row justify-between items-center px-4 lg:px-10 ">
        {/* LOGO */}
        <div className=" w-full lg:w-auto flex justify-center p-1">
          <a href="/">
            <img
              src="https://comexlat.com/resource/1742514203_67dca81bc74cf_logo-negro-y-blanco.png"
              alt="Logo ComexLat"
              className="w-100 lg:w-60 h-15"
            />
          </a>
        </div>

        {/* MENÚ */}
        <ul className="flex flex-wrap justify-center gap-6 mt-4 lg:mt-0 text-sm font-bold tracking-wide font-coolvetica">
          <li>
            <a href="/" className="hover:text-primary transition-colors">+Inicio</a>
          </li>
          <li>
            <a href="#nosotros" className="hover:text-primary transition-colors">Nosotros</a>
          </li>
          <li>
            <a href="#proyectos" className="hover:text-primary transition-colors">Oportunidades</a>
          </li>
          <li>
            <a href="#trabaja" className="hover:text-primary transition-colors">Contacto</a>
          </li>
        </ul>
      </nav>

      {/* DEMO TEXTO con fuente Raleway */}
      <div className="bg-primary text-white font-raleway p-1 text-center text-sm">

      </div>
    </header>
  );
};

export default Header;
