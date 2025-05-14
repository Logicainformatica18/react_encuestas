import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer
      className="mt-10 text-black font-raleway"
      style={{ background: 'linear-gradient(to right, #F49A1A 80%, #ffac47)' }}
    >
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
          <div>
            <h4 className="font-bold font-coolvetica">Ubicación</h4>
            <div className="h-[3px] w-[25px] bg-black my-1" />
            <p className="text-white">
              Av. Circunvalación del Golf Los Incas<br />
              134 Patio Panorama, Santiago de Surco
            </p>
          </div>

          <div>
            <h4 className="font-bold font-coolvetica">Contáctanos</h4>
            <p className="text-white mt-3">01- 9049838</p>
          </div>

          <div>
            <a
              href="/libro_reclamaciones"
              className="flex flex-col items-center text-white"
            >
              <img
                src="/resource/1738703730_67a28372819f7libro%20de%20reclamaciones.svg"
                alt="Libro de Reclamaciones"
                className="w-12 mb-2"
              />
              <span className="text-center text-white text-sm">
                📖 Libro de Reclamaciones
              </span>
            </a>
          </div>
        </div>

        <p className="mt-6 text-center text-white text-xs">
          ComexLat, Todos los derechos reservados {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
