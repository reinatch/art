import { useEffect } from 'react';
import gsap from 'gsap';
import Flip from 'gsap/Flip';
import Draggable from 'gsap/Draggable';

const FlipDemo: React.FC = () => {
  useEffect(() => {
    gsap.registerPlugin(Flip, Draggable);

    const fullSize = document.querySelector(".full-size");
    const thumbnail = document.querySelector(".thumbnail");

    Draggable.create(".initial", { bounds: "body" });

    const handleClick = () => {
      const state = Flip.getState(".thumbnail, .full-size");

      if (fullSize && thumbnail) {
        fullSize.classList.toggle("active");
        thumbnail.classList.toggle("active");

        Flip.from(state, {
          duration: 0.6,
          fade: true,
          absolute: true,
          toggleClass: "flipping",
          ease: "power1.inOut"
        });
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <><div className="flex flex-col items-center justify-center h-screen overflow-hidden text-center">
      <div className="initial relative w-auto h-20 border-dashed border-2 border-black rounded-lg flex items-center justify-center z-10">
        <img className="thumbnail w-auto h-20" data-flip-id="img" src="/videos/luva/t.gif" alt="Flip flair thumbnail" />
        {/* <div className="absolute bottom-full left-full ml-2 mb-1 w-auto h-20 bg-no-repeat bg-bottom-left ">
    </div> */}
      </div>
    </div><div className="container fixed inset-4 flex items-center justify-center pointer-events-none z-50">
        <img className="full-size hidden relative flex-shrink-0 flex-grow-0 h-4/5 aspect-square" data-flip-id="img" src="/videos/luva/t.gif" alt="Massive flip flair" />
      </div></>
  );
};

export default FlipDemo;
