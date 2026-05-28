import svgPaths from "./svg-1o4cda7vv0";
import imgSnow from "./3ec752d511801eeeb16e551d0ea0588de5325f55.png";
import imgRectangle991 from "./b6ce58964c9c92032b1bd606841783df77f35034.png";
import imgRectangle993 from "./16413475179270fb2948d683b4d3774909792312.png";
import imgRectangle994 from "./6220ddd73729c7c3bed149ba7c2bc5a7e79fd9fc.png";
import imgRectangle995 from "./3c5c6b273098b354225e9c001d990dc6c08315e8.png";
import imgRectangle989 from "./df58ed37f41dc416f233292567f9eab10151f0e7.png";
import imgRectangle996 from "./8e7161dacb060a11cf718ae20bbc85a1fedd4023.png";
import { imgRectangle990, imgRectangle992, imgRectangle988 } from "./svg-cq855";

function Snow() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Snow">
      <div className="absolute h-[1200px] left-0 mix-blend-overlay top-0 w-[1600px]" data-name="Snow">
        <div className="absolute inset-0 opacity-30 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[106.17%] left-[-28.19%] max-w-none top-0 w-[159.25%]" src={imgSnow} />
        </div>
      </div>
    </div>
  );
}

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
          <path d={svgPaths.pd029e80} id="Vector" stroke="url(#paint0_linear_6505_816)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_6505_816" x1="14.4499" x2="9.84083" y1="13.8966" y2="13.8656">
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

function Group2() {
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
      <Group2 />
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

function Frame12() {
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

function Frame13() {
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

function Frame14() {
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

function Frame15() {
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
      <Frame12 />
      <Frame13 />
      <Frame14 />
      <Frame15 />
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

function Cta1() {
  return (
    <div className="absolute content-stretch drop-shadow-[0px_6px_9.5px_rgba(0,56,255,0.24)] flex gap-[10px] items-center justify-center left-[132px] px-[32px] py-[16px] rounded-[16px] top-[732px] w-[223px]" style={{ backgroundImage: "linear-gradient(-86.9293deg, rgb(23, 111, 242) 1.6397%, rgb(25, 110, 238) 102.71%)" }} data-name="Cta2">
      <p className="[word-break:break-word] font-['CircularXX:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Book Now</p>
      <IconlyCurvedArrowRight />
    </div>
  );
}

function Group6() {
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
      <Cta1 />
      <Group6 />
    </div>
  );
}

function Screen2() {
  return (
    <div className="absolute h-[812px] left-[1120px] overflow-clip rounded-[32px] shadow-[34px_24px_77px_0px_rgba(8,88,208,0.17)] top-[279px] w-[375px]" style={{ backgroundImage: "linear-gradient(144.033deg, rgb(231, 233, 243) 11.627%, rgb(255, 255, 255) 91.025%)" }} data-name="screen 3">
      <PtoductImage />
      <ProductInfo />
      <Info />
      <Book />
    </div>
  );
}

function Frame8() {
  return <div className="absolute h-[24px] left-[32px] top-[483px] w-[54px]" />;
}

function SwmIconsDuotoneLocation({ className }: { className?: string }) {
  return (
    <div className={className || "relative shrink-0 size-[16px]"} data-name="SWM icons / duotone / location-1">
      <div className="absolute inset-[12.5%_16.67%]" data-name="tone">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 12">
          <path clipRule="evenodd" d={svgPaths.p3901c080} fill="url(#paint0_linear_6505_807)" fillRule="evenodd" id="tone" opacity="0.15" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_6505_807" x1="10.5295" x2="-0.394729" y1="8.65384" y2="8.52303">
              <stop stopColor="#176FF2" />
              <stop offset="1" stopColor="#196EEE" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute inset-[12.5%_16.67%]" data-name="shape">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 12">
          <g id="shape">
            <path d={svgPaths.p224a6d00} fill="url(#paint0_linear_6505_831)" />
            <path d={svgPaths.pebf7700} fill="url(#paint1_linear_6505_831)" />
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_6505_831" x1="10.5295" x2="-0.394729" y1="8.65384" y2="8.52303">
              <stop stopColor="#176FF2" />
              <stop offset="1" stopColor="#196EEE" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_6505_831" x1="10.5295" x2="-0.394729" y1="8.65384" y2="8.52303">
              <stop stopColor="#176FF2" />
              <stop offset="1" stopColor="#196EEE" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute inset-[37.5%]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, white)" id="Ellipse 462" r="2" />
        </svg>
      </div>
    </div>
  );
}

function ArrowDown() {
  return (
    <div className="absolute inset-[32.29%_17.71%]" data-name="Arrow - Down 2">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3333 5.66667">
        <g id="Arrow - Down 2">
          <path d={svgPaths.p4c50200} fill="url(#paint0_linear_6505_811)" id="Stroke 1" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_6505_811" x1="10.2004" x2="-0.377528" y1="4.08654" y2="3.82668">
            <stop stopColor="#176FF2" />
            <stop offset="1" stopColor="#196EEE" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function IconlyLightOutlineArrowDown() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Iconly/Light-Outline/Arrow - Down 2">
      <ArrowDown />
    </div>
  );
}

function Location() {
  return (
    <div className="absolute content-stretch flex gap-[6px] items-center justify-center left-[247px] top-[44px]" data-name="Location">
      <SwmIconsDuotoneLocation />
      <p className="[word-break:break-word] font-['CircularXX:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#606060] text-[12px] whitespace-nowrap">Aspen, USA</p>
      <IconlyLightOutlineArrowDown />
    </div>
  );
}

function Greet() {
  return (
    <div className="[word-break:break-word] absolute contents leading-[normal] left-[20px] text-black top-[44px] whitespace-nowrap" data-name="Greet">
      <p className="absolute font-['Montserrat:Regular',sans-serif] font-normal left-[20px] text-[14px] top-[44px]">Explore</p>
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium left-[20px] text-[32px] top-[61px]">Aspen</p>
    </div>
  );
}

function Header() {
  return (
    <div className="absolute contents left-[20px] top-[44px]" data-name="header">
      <Location />
      <Greet />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[8.33%_10.51%_10.51%_8.33%]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.2307 16.2308">
        <g id="Group 3">
          <mask height="17" id="mask0_6505_823" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }} width="17" x="0" y="0">
            <path clipRule="evenodd" d="M0 0H16.2307V16.2308H0V0Z" fill="var(--fill-0, white)" fillRule="evenodd" id="Clip 2" />
          </mask>
          <g mask="url(#mask0_6505_823)">
            <path clipRule="evenodd" d={svgPaths.pa70e380} fill="var(--fill-0, #B8B8B8)" fillRule="evenodd" id="Fill 1" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[73.78%_7.23%_5.33%_71.83%]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.18671 4.17896">
        <g id="Group 6">
          <mask height="5" id="mask0_6505_799" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }} width="5" x="0" y="0">
            <path clipRule="evenodd" d="M0 0H4.18671V4.17896H0V0Z" fill="var(--fill-0, white)" fillRule="evenodd" id="Clip 5" />
          </mask>
          <g mask="url(#mask0_6505_799)">
            <path clipRule="evenodd" d={svgPaths.p28b39500} fill="var(--fill-0, #B8B8B8)" fillRule="evenodd" id="Fill 4" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Search1() {
  return (
    <div className="absolute contents inset-[8.33%_7.23%_5.33%_8.33%]" data-name="Search">
      <Group />
      <Group1 />
    </div>
  );
}

function IconlyLightOutlineSearch() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Iconly/Light-Outline/Search">
      <Search1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <IconlyLightOutlineSearch />
      <p className="[word-break:break-word] font-['CircularXX:Book',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#b8b8b8] text-[13px] whitespace-nowrap">Find things to do</p>
    </div>
  );
}

function Search() {
  return (
    <div className="absolute bg-[#f3f8fe] content-stretch flex flex-col items-start left-[20px] pl-[16px] pr-[193px] py-[16px] rounded-[24px] top-[124px]" data-name="Search">
      <Frame1 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-start px-[16px] py-[12px] relative rounded-[33px] shrink-0" style={{ backgroundImage: "linear-gradient(-88.325deg, rgba(23, 111, 242, 0.05) 1.6397%, rgba(25, 110, 238, 0.05) 102.71%)" }}>
      <p className="[word-break:break-word] bg-clip-text font-['CircularXX:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[transparent] whitespace-nowrap" style={{ backgroundImage: "linear-gradient(-87.4138deg, rgb(23, 111, 242) 1.6397%, rgb(25, 110, 238) 102.71%)" }}>
        Location
      </p>
    </div>
  );
}

function Category() {
  return (
    <div className="absolute content-stretch flex gap-[28px] items-center justify-center left-[20px] top-[208px]" data-name="Category">
      <Frame19 />
      <p className="[word-break:break-word] font-['CircularXX:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#b8b8b8] text-[14px] whitespace-nowrap">Hotels</p>
      <p className="[word-break:break-word] font-['CircularXX:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#b8b8b8] text-[14px] whitespace-nowrap">Food</p>
      <p className="[word-break:break-word] font-['CircularXX:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#b8b8b8] text-[14px] whitespace-nowrap">Adventure</p>
      <p className="[word-break:break-word] font-['CircularXX:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#b8b8b8] text-[14px] whitespace-nowrap">Adventure</p>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents left-[20px] top-[315px]">
      <div className="absolute h-[240px] left-[20px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[188px_240px] rounded-[24px] shadow-[0px_11.051px_25.787px_0px_rgba(36,129,216,0.29)] top-[315px] w-[188px]" style={{ maskImage: `url('${imgRectangle992}')` }}>
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[24px]">
          <div className="absolute inset-0 overflow-hidden rounded-[24px]">
            <img alt="" className="absolute h-[148.22%] left-[-112.83%] max-w-none top-[-24.89%] w-[268.06%]" src={imgRectangle993} />
          </div>
          <div className="absolute bg-gradient-to-b from-[79.412%] from-[rgba(42,90,82,0)] inset-0 rounded-[24px] to-[#2a5a52]" />
        </div>
      </div>
    </div>
  );
}

function Heart1() {
  return (
    <div className="absolute inset-[28.57%_26.32%_28.57%_28.56%]" data-name="Heart">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.8271 10.2857">
        <g id="Heart">
          <path d={svgPaths.p2a19cb00} fill="var(--fill-0, #EC5655)" id="Heart_2" />
        </g>
      </svg>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-[28.57%_26.32%_28.57%_28.56%]">
      <Heart1 />
    </div>
  );
}

function IconlyBoldHeart1() {
  return (
    <div className="absolute bg-[#f3f8fe] inset-[63.42%_48.8%_33.62%_44.8%] rounded-[80px]" data-name="Iconly/Bold/Heart">
      <Group8 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#4d5652] content-stretch flex items-center justify-center px-[12px] py-[4px] relative rounded-[59px] shrink-0">
      <p className="[word-break:break-word] font-['CircularXX:Book',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Alley Palace</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#4d5652] content-stretch flex gap-[4px] items-center justify-center px-[10px] py-[4px] relative rounded-[59px] shrink-0">
      <div className="relative shrink-0 size-[16px]" data-name="star">
        <div className="absolute inset-[12.5%_12.5%_16.67%_12.5%]" data-name="tone">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 11.3333">
            <path d={svgPaths.p8d55b00} fill="var(--fill-0, #D8D138)" id="tone" />
          </svg>
        </div>
        <div className="absolute inset-[12.5%_12.5%_16.67%_12.5%]" data-name="shape">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 11.3333">
            <path d={svgPaths.p8d55b00} fill="var(--fill-0, #F8D675)" id="shape" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['CircularXX:Book',sans-serif] leading-[normal] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">4.1</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] items-start left-[32px] top-[490px]">
      <Frame6 />
      <Frame7 />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents left-[20px] top-[315px]">
      <Group9 />
      <IconlyBoldHeart1 />
      <Frame10 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents left-[20px] top-[281px]">
      <p className="[word-break:break-word] absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[normal] left-[20px] text-[#232323] text-[18px] top-[281px] whitespace-nowrap">{`Popular `}</p>
      <p className="[word-break:break-word] absolute bg-clip-text font-['CircularXX:Medium',sans-serif] leading-[normal] left-[318px] not-italic text-[12px] text-[transparent] top-[285px] whitespace-nowrap" style={{ backgroundImage: "linear-gradient(-88.0968deg, rgb(23, 111, 242) 1.6397%, rgb(25, 110, 238) 102.71%)" }}>
        See all
      </p>
      <Group10 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#3a544f] col-1 content-stretch flex items-center ml-[116px] mt-[86px] px-[4px] py-[2px] relative rounded-[9px] row-1">
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-[-2px] pointer-events-none rounded-[11px]" />
      <p className="[word-break:break-word] font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[10px] text-white whitespace-nowrap">4N/5D</p>
    </div>
  );
}

function Group4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="col-1 h-[96px] ml-0 mt-0 relative rounded-[12px] row-1 w-[166px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
          <img alt="" className="absolute h-[220.7%] left-[-35.18%] max-w-none top-[-76.59%] w-[191.57%]" src={imgRectangle994} />
        </div>
      </div>
      <Frame2 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-start relative shrink-0">
      <p className="[word-break:break-word] font-['CircularXX:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#232323] text-[14px] whitespace-nowrap">Explore Aspen</p>
    </div>
  );
}

function SwmIconsBrokenTrendingUp({ className }: { className?: string }) {
  return (
    <div className={className || "overflow-clip relative shrink-0 size-[12px]"} data-name="SWM icons / broken / trending-up">
      <div className="absolute inset-[29.17%_12.5%]" data-name="shape">
        <div className="absolute inset-[-15%_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 6.5">
            <path d={svgPaths.p33499c10} id="shape" stroke="var(--stroke-0, #84ABE4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center pl-[2px] relative shrink-0">
      <SwmIconsBrokenTrendingUp />
      <p className="[word-break:break-word] font-['CircularXX:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#3a544f] text-[10px] whitespace-nowrap">Hot Deal</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0">
      <Frame4 />
      <Frame16 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute content-stretch drop-shadow-[0px_4px_10px_rgba(151,160,178,0.17)] flex flex-col items-start left-[20px] p-[4px] rounded-[16px] top-[621px]" style={{ backgroundImage: "linear-gradient(119.88deg, rgb(255, 255, 255) 2.7376%, rgb(245, 245, 245) 93.938%)" }}>
      <div aria-hidden="true" className="absolute border border-[#f4f4f4] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Group4 />
      <Frame11 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#3a544f] col-1 content-stretch flex items-center ml-[116px] mt-[86px] px-[4px] py-[2px] relative rounded-[9px] row-1">
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-[-2px] pointer-events-none rounded-[11px]" />
      <p className="[word-break:break-word] font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[10px] text-white whitespace-nowrap">2N/3D</p>
    </div>
  );
}

function Group5() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="col-1 h-[96px] ml-0 mt-0 relative rounded-[12px] row-1 w-[166px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgRectangle995} />
      </div>
      <Frame3 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-start relative shrink-0">
      <p className="[word-break:break-word] font-['CircularXX:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#232323] text-[14px] whitespace-nowrap">Luxurious Aspen</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center pl-[2px] relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[12px]" data-name="SWM icons / broken / trending-up">
        <div className="absolute inset-[29.17%_12.5%]" data-name="shape">
          <div className="absolute inset-[-15%_-8.33%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 6.5">
              <path d={svgPaths.p33499c10} id="shape" stroke="var(--stroke-0, #84ABE4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] font-['CircularXX:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#3a544f] text-[10px] whitespace-nowrap">Hot Deal</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0">
      <Frame9 />
      <Frame20 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="absolute content-stretch drop-shadow-[0px_4px_10px_rgba(151,160,178,0.17)] flex flex-col items-start left-[210px] p-[4px] rounded-[16px] top-[621px]" style={{ backgroundImage: "linear-gradient(119.88deg, rgb(246, 246, 246) 2.7376%, rgb(255, 252, 252) 93.938%)" }}>
      <div aria-hidden="true" className="absolute border border-[#f4f4f4] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Group5 />
      <Frame18 />
    </div>
  );
}

function Recommended() {
  return (
    <div className="absolute contents left-[20px] top-[587px]" data-name="Recommended">
      <p className="[word-break:break-word] absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[normal] left-[20px] text-[#232323] text-[18px] top-[587px] whitespace-nowrap">Recommended</p>
      <Frame5 />
      <Frame17 />
    </div>
  );
}

function Home() {
  return (
    <div className="absolute inset-[8.33%_10.12%_8.33%_10%]" data-name="Home">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.172 20">
        <g id="Home">
          <path clipRule="evenodd" d={svgPaths.p37711770} fill="url(#paint0_linear_6505_819)" fillRule="evenodd" id="Stroke 2" />
          <path d="M6.67969 14.1348H12.4947" id="Stroke 1" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_6505_819" x1="18.9254" x2="-0.709018" y1="14.4231" y2="14.1695">
            <stop stopColor="#176FF2" />
            <stop offset="1" stopColor="#196EEE" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function IconlyCurvedHome() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Iconly/Curved/Home">
      <Home />
    </div>
  );
}

function Ticket() {
  return (
    <div className="absolute inset-[20.01%_12.5%_20.01%_12.52%]" data-name="Ticket">
      <div className="absolute inset-[-5.63%_-4.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.3465 13.3472">
          <g id="Ticket">
            <g id="Group">
              <path d="M9.55829 0.862369V2.67699" id="Stroke 1" stroke="var(--stroke-0, #B8B8B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.34971" />
              <path d="M9.55829 10.9924V12.5101" id="Stroke 3" stroke="var(--stroke-0, #B8B8B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.34971" />
              <path d="M9.55829 8.41498V4.8" id="Stroke 6" stroke="var(--stroke-0, #B8B8B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.34971" />
            </g>
            <path clipRule="evenodd" d={svgPaths.p3501cc00} fillRule="evenodd" id="Stroke 7" stroke="var(--stroke-0, #B8B8B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.34971" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function IconlyLightTicket() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Iconly/Light/Ticket">
      <Ticket />
    </div>
  );
}

function Heart2() {
  return (
    <div className="absolute inset-[18.84%_13.02%_12.6%_15%]" data-name="Heart">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.3964 13.7132">
        <g id="Heart">
          <g id="Group 3">
            <mask height="14" id="mask0_6505_833" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }} width="15" x="0" y="0">
              <path clipRule="evenodd" d="M0 0H14.3964V13.7132H0V0Z" fill="var(--fill-0, white)" fillRule="evenodd" id="Clip 2" />
            </mask>
            <g mask="url(#mask0_6505_833)">
              <path clipRule="evenodd" d={svgPaths.pbedfb00} fill="var(--fill-0, #B8B8B8)" fillRule="evenodd" id="Fill 1" />
            </g>
          </g>
          <path clipRule="evenodd" d={svgPaths.p2a656b80} fill="var(--fill-0, #B8B8B8)" fillRule="evenodd" id="Fill 4" />
        </g>
      </svg>
    </div>
  );
}

function IconlyLightOutlineHeart() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Iconly/Light-Outline/Heart">
      <Heart2 />
    </div>
  );
}

function Profile() {
  return (
    <div className="absolute inset-[11.73%_20.19%_11.58%_20.06%]" data-name="Profile">
      <div className="absolute inset-[-4.66%_-6.28%_-4.89%_-6.28%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.45 16.8026">
          <g id="Profile">
            <path clipRule="evenodd" d={svgPaths.p1d250a80} fillRule="evenodd" id="Stroke 1" stroke="var(--stroke-0, #B8B8B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path clipRule="evenodd" d={svgPaths.p39f93900} fillRule="evenodd" id="Stroke 3" stroke="var(--stroke-0, #B8B8B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.42857" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function IconlyLightProfile() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Iconly/Light/Profile">
      <Profile />
    </div>
  );
}

function Nav() {
  return (
    <div className="absolute content-stretch drop-shadow-[15px_-19px_11px_rgba(24,111,242,0.05)] flex gap-[50px] items-center justify-center left-0 px-[72px] py-[24px] rounded-[32px] top-[740px] w-[377px]" style={{ backgroundImage: "linear-gradient(-87.8871deg, rgb(254, 254, 254) 0.34985%, rgb(245, 245, 245) 175.32%)" }} data-name="Nav">
      <IconlyCurvedHome />
      <IconlyLightTicket />
      <IconlyLightOutlineHeart />
      <IconlyLightProfile />
    </div>
  );
}

function Screen1() {
  return (
    <div className="absolute bg-white h-[812px] left-[613px] overflow-clip rounded-[32px] shadow-[65px_49px_92px_0px_rgba(8,88,208,0.23)] top-[196px] w-[375px]" data-name="Screen 2">
      <div className="absolute h-[85px] left-0 top-[727px] w-[376px]">
        <div className="absolute inset-[-35.29%_-7.98%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 436 145">
            <g filter="url(#filter0_f_6505_860)" id="Rectangle 995">
              <path d={svgPaths.p38645800} fill="var(--fill-0, #2A6BBD)" fillOpacity="0.2" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="145" id="filter0_f_6505_860" width="436" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_6505_860" stdDeviation="15" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <Frame8 />
      <div className="absolute h-[31.778px] left-[44.7px] top-[803px] w-[79.243px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 79.2426 31.778">
          <path d={svgPaths.pcf96c00} fill="url(#paint0_linear_6505_829)" id="Vector 235" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_6505_829" x1="78.2234" x2="-2.85259" y1="22.9168" y2="20.1933">
              <stop stopColor="#176FF2" />
              <stop offset="1" stopColor="#196EEE" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <Header />
      <Search />
      <Category />
      <Group7 />
      <Recommended />
      <Nav />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute h-[812px] left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[375px_812px] top-0 w-[375px]" style={{ maskImage: `url('${imgRectangle988}')` }}>
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-full left-[-69.68%] max-w-none top-0 w-[173.24%]" src={imgRectangle989} />
          </div>
          <div className="absolute bg-gradient-to-b from-[63.308%] from-[rgba(33,27,28,0)] inset-0 to-[rgba(59,89,105,0.7)]" />
        </div>
      </div>
    </div>
  );
}

function Cta() {
  return (
    <div className="absolute content-stretch drop-shadow-[0px_4px_16.5px_rgba(28,24,242,0.08)] flex items-center justify-center left-[32px] px-[44px] py-[16px] rounded-[16px] top-[712px] w-[311px]" style={{ backgroundImage: "linear-gradient(-85.3937deg, rgb(23, 111, 242) 1.6397%, rgb(25, 110, 238) 102.71%)" }} data-name="cta1">
      <p className="[word-break:break-word] font-['CircularXX:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Explore</p>
    </div>
  );
}

function Screen() {
  return (
    <div className="absolute bg-[#eef1f5] h-[812px] left-[107px] overflow-clip rounded-[32px] shadow-[34px_24px_77px_0px_rgba(8,88,208,0.33)] top-[110px] w-[375px]" data-name="screen1">
      <Group3 />
      <Cta />
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Hiatus:Regular',sans-serif] leading-[normal] left-[188.5px] not-italic text-[116px] text-center text-white top-[93px] tracking-[9.86px] whitespace-nowrap">Aspen</p>
      <p className="[word-break:break-word] absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[0] left-[32px] text-[0px] text-white top-[553px] w-[300px]">
        <span className="font-['Montserrat:Regular',sans-serif] font-normal leading-[1.134] text-[24px]">Plan your</span>
        <span className="leading-[93.02706909179688%] text-[40px]">{` `}</span>
        <span className="leading-[1.134] text-[40px]">Luxurious Vacation</span>
      </p>
    </div>
  );
}

function SnowUp() {
  return (
    <div className="absolute h-[1014px] left-[86px] top-[127px] w-[1002px]" data-name="SnowUp">
      <div className="absolute inset-[-2.37%_-2.4%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1050 1062">
          <g id="SnowUp">
            <g filter="url(#filter0_f_6505_867)" id="Ellipse 492">
              <circle cx="110.5" cy="391.5" fill="var(--fill-0, white)" r="25.5" />
            </g>
            <g filter="url(#filter1_f_6505_867)" id="Ellipse 493" opacity="0.7">
              <circle cx="559" cy="931" fill="var(--fill-0, white)" r="26" />
            </g>
            <g filter="url(#filter2_f_6505_867)" id="Ellipse 494" opacity="0.7">
              <circle cx="45" cy="1017" fill="var(--fill-0, white)" fillOpacity="0.7" r="21" />
            </g>
            <g filter="url(#filter3_f_6505_867)" id="Ellipse 495" opacity="0.6">
              <circle cx="1005" cy="45" fill="var(--fill-0, white)" r="21" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="99" id="filter0_f_6505_867" width="99" x="61" y="342">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_6505_867" stdDeviation="12" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="100" id="filter1_f_6505_867" width="100" x="509" y="881">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_6505_867" stdDeviation="12" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="90" id="filter2_f_6505_867" width="90" x="0" y="972">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_6505_867" stdDeviation="12" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="90" id="filter3_f_6505_867" width="90" x="960" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_6505_867" stdDeviation="12" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-[#4d5652] content-stretch flex items-center justify-center px-[13.596px] py-[4.532px] relative rounded-[66.846px] shrink-0">
      <p className="[word-break:break-word] font-['CircularXX:Book',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Coeurdes Alpes</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="bg-[#4d5652] content-stretch flex gap-[4.532px] items-center justify-center px-[11.33px] py-[4.532px] relative rounded-[66.846px] shrink-0">
      <div className="relative shrink-0 size-[18.128px]" data-name="star">
        <div className="absolute inset-[12.5%_12.5%_16.67%_12.5%]" data-name="tone">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5957 12.8404">
            <path d={svgPaths.p1740a100} fill="var(--fill-0, #D8D138)" id="tone" />
          </svg>
        </div>
        <div className="absolute inset-[12.5%_12.5%_16.67%_12.5%]" data-name="shape">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5957 12.8404">
            <path d={svgPaths.p1740a100} fill="var(--fill-0, #F8D675)" id="shape" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['CircularXX:Book',sans-serif] leading-[normal] not-italic relative shrink-0 text-[11.33px] text-white whitespace-nowrap">4.5</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6.798px] h-[60.048px] items-start left-[862.6px] top-[697.27px] w-[101.968px]">
      <Frame22 />
      <Frame23 />
    </div>
  );
}

function ImageGroup() {
  return (
    <div className="absolute contents left-[849px] top-[499px]" data-name="Image group">
      <div className="absolute h-[271px] left-[849px] rounded-[27.191px] top-[499px] w-[212px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[27.191px] size-full" src={imgRectangle996} />
      </div>
      <div className="absolute h-[271px] left-[849px] rounded-[20px] top-[499px] w-[212px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[20px]">
          <img alt="" className="absolute h-[155.37%] left-[-23.11%] max-w-none top-[-13.01%] w-[132.47%]" src={imgRectangle991} />
        </div>
      </div>
      <Frame21 />
    </div>
  );
}

export default function AspenTravelAppExplorationMobileAppDesign() {
  return (
    <div className="bg-[#d0e7ff] relative size-full" data-name="Aspen Travel App Exploration- Mobile App Design">
      <Snow />
      <p className="[word-break:break-word] absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[normal] left-[1355px] text-[#232323] text-[20px] top-[52px] tracking-[0.4px] whitespace-nowrap">www.nickelfox.com</p>
      <Screen2 />
      <Screen1 />
      <Screen />
      <SnowUp />
      <ImageGroup />
    </div>
  );
}