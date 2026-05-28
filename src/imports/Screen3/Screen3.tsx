import svgPaths from "./svg-5b62jblfg4";
import imgRectangle991 from "./b6ce58964c9c92032b1bd606841783df77f35034.png";
import { imgRectangle990 } from "./svg-t035y";

function Heart() {
  return (
    <div className="absolute bottom-[21.43%] left-[21.43%] right-[22.17%] top-1/4" data-name="Heart">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.8175 23.5714">
        <g id="Heart">
          <path clipRule="evenodd" d={svgPaths.p1a56fc00} fill="var(--fill-0, #EC5655)" fillRule="evenodd" id="Heart_2" />
          <path clipRule="evenodd" d={svgPaths.p31caaec0} fill="var(--fill-0, #EC5655)" fillRule="evenodd" id="Heart_3" />
        </g>
      </svg>
    </div>
  );
}

function IconlyBoldHeart() {
  return (
    <div className="absolute bg-[#f2f7fd] drop-shadow-[0px_6px_9.5px_rgba(0,56,255,0.1)] inset-[42%_9.07%_52.59%_79.2%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-277px_-321px] mask-size-[335px_386px] rounded-[80px]" style={{ maskImage: `url('${imgRectangle990}')` }} data-name="Iconly/Bold/Heart">
      <Heart />
    </div>
  );
}

function Back() {
  return (
    <div className="absolute left-[32px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-12px_-12px] mask-size-[335px_386px] size-[40px] top-[32px]" style={{ maskImage: `url('${imgRectangle990}')` }} data-name="back">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="back">
          <rect fill="var(--fill-0, #F3F8FE)" height="40" rx="8" width="40" />
          <path d="M22.5 25L17.5 20L22.5 15" id="Vector" stroke="var(--stroke-0, #B8B8B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function PtoductImage() {
  return (
    <div className="absolute contents left-[20px] top-[20px]" data-name="Ptoduct image">
      <div className="absolute h-[340px] left-[20px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[335px_386px] rounded-[20px] top-[20px] w-[335px]" style={{ maskImage: `url('${imgRectangle990}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[20px]">
          <img alt="" className="absolute h-[179.08%] left-[-20.17%] max-w-none top-[-21.77%] w-[121.23%]" src={imgRectangle991} />
        </div>
      </div>
      <IconlyBoldHeart />
      <Back />
    </div>
  );
}

function Down() {
  return (
    <div className="relative size-[24px]" data-name="down">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="down">
          <path d={svgPaths.pd029e80} id="Vector" stroke="url(#paint0_linear_6512_1961)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_6512_1961" x1="14.4499" x2="9.84083" y1="13.8966" y2="13.8656">
            <stop stopColor="#176FF2" />
            <stop offset="1" stopColor="#196EEE" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Star() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[16px]" data-name="star">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="star">
          <path d={svgPaths.p10e8f600} fill="var(--fill-0, #D8D138)" id="tone" />
          <path d={svgPaths.p10e8f600} fill="url(#paint0_linear_6505_873)" id="shape" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_6505_873" x1="13.7358" x2="2.46644" y1="9.85583" y2="9.61676">
            <stop stopColor="#DF9652" />
            <stop offset="1" stopColor="#B47820" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Star />
      <p className="[word-break:break-word] col-1 font-['CircularXX:Regular',sans-serif] leading-[normal] ml-[20px] mt-[2px] not-italic relative row-1 text-[#606060] text-[12px] whitespace-nowrap">4.5 (355 Reviews)</p>
    </div>
  );
}

function Review() {
  return (
    <div className="absolute content-stretch flex items-center left-[23px] top-[427px]" data-name="review">
      <Group />
    </div>
  );
}

function Title() {
  return (
    <div className="absolute contents left-[23px] top-[402px]" data-name="title">
      <Review />
      <p className="[word-break:break-word] absolute bg-clip-text font-['CircularXX:Bold',sans-serif] leading-[normal] left-[286px] not-italic text-[14px] text-[transparent] top-[402px] whitespace-nowrap" style={{ backgroundImage: "linear-gradient(-86.8703deg, rgb(23, 111, 242) 1.6397%, rgb(25, 110, 238) 102.71%)" }}>
        Show map
      </p>
    </div>
  );
}

function ProductInfo() {
  return (
    <div className="absolute contents left-[20px] top-[392px]" data-name="Product info">
      <p className="[word-break:break-word] absolute font-['CircularXX:Book',sans-serif] leading-[normal] left-[20px] not-italic text-[#3a544f] text-[14px] top-[460px] w-[335px]">Aspen is as close as one can get to a storybook alpine town in America. The choose-your-own-adventure possibilities—skiing, hiking, dining shopping and ....</p>
      <p className="[word-break:break-word] absolute bg-clip-text font-['CircularXX:Bold',sans-serif] leading-[normal] left-[20px] not-italic text-[14px] text-[transparent] top-[537px] whitespace-nowrap" style={{ backgroundImage: "linear-gradient(-86.8251deg, rgb(23, 111, 242) 1.6397%, rgb(25, 110, 238) 102.71%)" }}>
        Read more
      </p>
      <div className="absolute flex items-center justify-center left-[94px] size-[24px] top-[535px]">
        <div className="-rotate-90 flex-none">
          <Down />
        </div>
      </div>
      <Title />
      <p className="[word-break:break-word] absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[normal] left-[20px] text-[#232323] text-[24px] top-[392px] whitespace-nowrap">Coeurdes Alpes</p>
    </div>
  );
}

function Wifi() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="wifi">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="wifi">
          <path d={svgPaths.p3e207900} fill="var(--fill-0, #B8B8B8)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center justify-center px-[20px] py-[12px] relative rounded-[16px] shrink-0" style={{ backgroundImage: "linear-gradient(-89.1969deg, rgba(23, 111, 242, 0.05) 1.6397%, rgba(25, 110, 238, 0.05) 102.71%)" }}>
      <Wifi />
      <p className="[word-break:break-word] font-['CircularXX:Book',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#b8b8b8] text-[10px] whitespace-nowrap">1 Heater</p>
    </div>
  );
}

function Food() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="food">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="food">
          <path d={svgPaths.p2307c9c0} fill="var(--fill-0, #B8B8B8)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center justify-center px-[20px] py-[12px] relative rounded-[16px] shrink-0" style={{ backgroundImage: "linear-gradient(-89.2491deg, rgba(23, 111, 242, 0.05) 1.6397%, rgba(25, 110, 238, 0.05) 102.71%)" }}>
      <Food />
      <p className="[word-break:break-word] font-['CircularXX:Book',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#c9c9c9] text-[10px] whitespace-nowrap">Dinner</p>
    </div>
  );
}

function BathTub() {
  return (
    <div className="relative size-[32px]" data-name="bath tub">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="bath tub">
          <path d={svgPaths.p14af0c00} fill="var(--fill-0, #B8B8B8)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center justify-center px-[20px] py-[12px] relative rounded-[16px] shrink-0" style={{ backgroundImage: "linear-gradient(-89.2491deg, rgba(23, 111, 242, 0.05) 1.6397%, rgba(25, 110, 238, 0.05) 102.71%)" }}>
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none rotate-180">
          <BathTub />
        </div>
      </div>
      <p className="[word-break:break-word] font-['CircularXX:Book',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#c9c9c9] text-[10px] whitespace-nowrap">1 Tub</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Frame">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Frame">
          <path d={svgPaths.pf469180} fill="var(--fill-0, #B8B8B8)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center justify-center px-[20px] py-[12px] relative rounded-[16px] shrink-0" style={{ backgroundImage: "linear-gradient(-89.2491deg, rgba(23, 111, 242, 0.05) 1.6397%, rgba(25, 110, 238, 0.05) 102.71%)" }}>
      <Frame />
      <p className="[word-break:break-word] font-['CircularXX:Book',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#c9c9c9] text-[10px] whitespace-nowrap">Pool</p>
    </div>
  );
}

function Amenties() {
  return (
    <div className="absolute content-stretch flex gap-[14px] items-start left-[20px] top-[629px]" data-name="amenties">
      <Frame1 />
      <Frame2 />
      <Frame3 />
      <Frame4 />
    </div>
  );
}

function Info() {
  return (
    <div className="absolute contents left-[20px] top-[591px]" data-name="Info">
      <p className="[word-break:break-word] absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[normal] left-[20px] text-[#232323] text-[18px] top-[591px] whitespace-nowrap">Facilities</p>
      <Amenties />
    </div>
  );
}

function ArrowRight() {
  return (
    <div className="relative size-full" data-name="Arrow - Right">
      <div className="absolute inset-[-5%_-6.23%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5493 16.5">
          <g id="Arrow - Right">
            <path d="M6.77464 15.75V0.75" id="Stroke 1" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p3d0be000} id="Stroke 3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function IconlyCurvedArrowRight() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Iconly/Curved/Arrow - Right">
      <div className="absolute flex inset-[23.76%_17.71%_26.04%_19.79%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="-rotate-90 flex-none h-[100cqw] w-[100cqh]">
          <ArrowRight />
        </div>
      </div>
    </div>
  );
}

function Cta() {
  return (
    <div className="absolute content-stretch drop-shadow-[0px_6px_9.5px_rgba(0,56,255,0.24)] flex gap-[10px] items-center justify-center left-[132px] px-[32px] py-[16px] rounded-[16px] top-[732px] w-[223px]" style={{ backgroundImage: "linear-gradient(-86.9293deg, rgb(23, 111, 242) 1.6397%, rgb(25, 110, 238) 102.71%)" }} data-name="Cta2">
      <p className="[word-break:break-word] font-['CircularXX:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Book Now</p>
      <IconlyCurvedArrowRight />
    </div>
  );
}

function Group1() {
  return (
    <div className="[word-break:break-word] absolute contents leading-[normal] left-[20px] top-[736px] whitespace-nowrap">
      <p className="absolute font-['CircularXX:Medium',sans-serif] left-[20px] not-italic text-[#232323] text-[12px] top-[736px]">Price</p>
      <p className="absolute font-['Montserrat:Bold',sans-serif] font-bold left-[20px] text-[#2dd7a4] text-[24px] top-[755px]">$199</p>
    </div>
  );
}

function Book() {
  return (
    <div className="absolute contents left-[20px] top-[732px]" data-name="Book">
      <Cta />
      <Group1 />
    </div>
  );
}

export default function Screen() {
  return (
    <div className="overflow-clip relative rounded-[32px] shadow-[34px_24px_77px_0px_rgba(8,88,208,0.17)] size-full" style={{ backgroundImage: "linear-gradient(144.033deg, rgb(231, 233, 243) 11.627%, rgb(255, 255, 255) 91.025%)" }} data-name="screen 3">
      <PtoductImage />
      <ProductInfo />
      <Info />
      <Book />
    </div>
  );
}