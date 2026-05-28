import { imgBlur, imgBlur1 } from "./svg-g3ufy";

function ContentArea() {
  return (
    <div
      className="flex-[1_0_0] min-h-px relative w-full"
      data-name="Content Area"
    >
      <div className="content-stretch flex flex-col items-start py-[10px] relative size-full">
        <p
          className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-black text-center whitespace-nowrap"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          Content area
        </p>
      </div>
    </div>
  );
}

export default function Screen() {
  return (
    <div
      className="bg-white content-stretch flex flex-col items-center justify-center overflow-clip pb-[10px] pt-[167px] px-[16px] relative rounded-[50px] size-full"
      data-name="Screen"
    >
      <ContentArea />
      <div
        className="absolute backdrop-blur-[5px] h-[200px] left-0 right-0 top-0"
        data-name="Scroll Edge Effect - Soft"
      >
        <div
          className="absolute backdrop-blur-[30px] bg-black inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0%_0%] mask-size-[100%_100%] mix-blend-screen opacity-90"
          style={{ maskImage: `url('${imgBlur}')` }}
          data-name="Blur"
        />
      </div>
      <div
        className="absolute backdrop-blur-[5px] bottom-0 h-[110px] left-0 right-0"
        data-name="Scroll Edge Effect - Soft"
      >
        <div
          className="absolute backdrop-blur-[30px] bg-black inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0%_0%] mask-size-[100%_100%] mix-blend-screen opacity-90"
          style={{ maskImage: `url('${imgBlur1}')` }}
          data-name="Blur"
        />
      </div>
    </div>
  );
}