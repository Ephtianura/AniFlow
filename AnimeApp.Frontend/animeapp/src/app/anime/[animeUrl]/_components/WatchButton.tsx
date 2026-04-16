import { RiPlayLargeFill } from "react-icons/ri";

export default function WatchButton() {

  return (
    <a href="#anime-player" className="btn-purple" >
      <div className="flex gap-2 items-center justify-center">
        <div className="rounded-full bg-white p-1 justify-center items-center flex">
          <RiPlayLargeFill />
        </div>
        <span className="text-white">Дивитися онлайн</span>
      </div>
    </a>
  );
}
