import Boss from "@/assets/boss.png";
import Felipe from "@/assets/felipe.png";
import Nathalia from "@/assets/nathalia.png";
import Yuri from "@/assets/yuri.png";

const employees = [
  {
    id: 1,
    img: Boss,
    name: "Gabriel Nery",
    description: "Gerente de Tecnologia da Informação",
    linkedin: "https://www.linkedin.com/in/gabriel-nery-b87a0b258/",
  },
  {
    id: 2,
    img: Yuri,
    name: "Yuri Odilon",
    description: "Desenvolvedor Front-End",
    linkedin: "https://www.linkedin.com/in/yuriodilonm/",
  },
  {
    id: 3,
    img: Felipe,
    name: "Felipe Robson",
    description: "Desenvolvedor Back-End",
    linkedin: "https://www.linkedin.com/in/robsonfelipemir/",
  },
  {
    id: 4,
    img: Nathalia,
    name: "Nathalia Alencar",
    description: "Desenvolvedora Front-End | Power BI",
    linkedin: "https://www.linkedin.com/in/nathalia-maisa-alencar-de-araujo",
  },
];

export default function DesenvolvidoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[url(./assets/background.png)] bg-cover bg-no-repeat">
      <div className="flex max-w-6xl gap-6">
        {employees.map(({ id, img, name, description, linkedin }) => (
          <a
            key={id}
            href={linkedin}
            target="_blank"
            className="flex cursor-pointer flex-col items-center gap-4 overflow-hidden rounded-2xl bg-sky-900 px-1 py-3.5 text-center duration-75 ease-in hover:scale-105"
          >
            <div className="overflow-hidden rounded-xl">
              <img src={img} alt={name} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-200">{name}</h1>
              <p className="text-md text-balance text-slate-300">
                {description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
