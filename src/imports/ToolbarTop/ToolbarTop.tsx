function Spacer() {
  return (
    <div
      className="h-full relative shrink-0 w-[8px]"
      data-name="Spacer"
    />
  );
}

function FillShadow() {
  return (
    <div
      className="absolute inset-0 rounded-[296px] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.12)]"
      data-name="Fill + Shadow"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none rounded-[296px]"
      >
        <div className="absolute bg-[rgba(255,255,255,0.65)] inset-0 rounded-[296px]" />
        <div className="absolute bg-[#ddd] inset-0 mix-blend-color-burn rounded-[296px]" />
        <div className="absolute bg-[#f7f7f7] inset-0 mix-blend-darken rounded-[296px]" />
      </div>
    </div>
  );
}

function GlassEffect() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[296px]"
      data-name="Glass Effect"
    />
  );
}

function Trailing() {
  return (
    <div
      className="content-stretch flex gap-[10px] items-center justify-end relative shrink-0"
      data-name="Trailing"
    >
      <div
        className="content-stretch flex gap-[20px] h-[44px] items-center px-[4px] relative rounded-[296px] shrink-0"
        data-name="Button Group 1"
      >
        <div
          aria-hidden="true"
          className="absolute bg-white inset-0 mix-blend-multiply pointer-events-none rounded-[296px]"
        />
        <div
          className="-translate-y-1/2 absolute h-[44px] left-0 right-0 top-1/2"
          data-name="BG"
        >
          <FillShadow />
          <GlassEffect />
        </div>
        <div
          className="content-stretch flex flex-col items-start relative rounded-[100px] shrink-0 size-[36px]"
          data-name="Symbol 1"
        >
          <div
            className="flex flex-[1_0_0] flex-col font-['SF_Pro:Medium',sans-serif] font-[510] justify-center leading-[0] min-h-px relative text-[#1a1a1a] text-[17px] text-center w-full"
            style={{
              fontVariationSettings: "'wdth' 100",
              fontFeatureSettings: "'ss16'",
            }}
          >
            <p className="leading-[normal]">{`\u{1004D4}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Controls() {
  return (
    <div
      className="relative shrink-0 w-full"
      data-name="Controls"
    >
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] relative size-full">
          <div className="flex flex-row items-center self-stretch">
            <Spacer />
          </div>
          <Trailing />
        </div>
      </div>
    </div>
  );
}

function TitleAndSubtitle() {
  return (
    <div
      className="relative shrink-0 w-full"
      data-name="Title and Subtitle"
    >
      <div className="content-stretch flex flex-col items-start px-[16px] relative size-full">
        <div
          className="h-[41px] relative shrink-0 w-full"
          data-name="Title"
        >
          <p
            className="absolute font-['SF_Pro:Bold',sans-serif] font-bold leading-[41px] left-0 right-0 text-[#1a1a1a] text-[34px] top-0 tracking-[0.4px] whitespace-nowrap"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Title
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ToolbarTop() {
  return (
    <div
      className="content-stretch flex flex-col gap-[10px] items-center pb-[10px] relative size-full"
      data-name="Toolbar - Top"
    >
      <Controls />
      <TitleAndSubtitle />
    </div>
  );
}