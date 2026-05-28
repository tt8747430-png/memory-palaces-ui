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

function TabBarButtons() {
  return (
    <div
      className="flex-[1_0_0] min-w-px relative"
      data-name="Tab Bar Buttons"
    >
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[2px] relative size-full">
          <div className="absolute inset-[-4px]" data-name="BG">
            <FillShadow />
            <GlassEffect />
          </div>
          <div
            className="flex-[1_0_0] min-w-px mr-[-8px] relative"
            data-name="Tab 1"
          >
            <div className="flex flex-col items-center justify-center size-full">
              <div className="content-stretch flex flex-col gap-px items-center justify-center pb-[7px] pt-[6px] px-[8px] relative size-full">
                <div
                  className="absolute bg-[#ededed] inset-[0_-2px] rounded-[100px]"
                  data-name="Selection"
                />
                <div
                  className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] min-w-full relative shrink-0 text-[#08f] text-[18px] text-center w-[min-content]"
                  style={{
                    fontVariationSettings: "'wdth' 100",
                    fontFeatureSettings: "'ss16'",
                  }}
                >
                  <p className="leading-[28px]">{`\u{1007C9}`}</p>
                </div>
                <p
                  className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[12px] min-w-full relative shrink-0 text-[#08f] text-[10px] text-center tracking-[-0.1px] w-[min-content]"
                  style={{
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  Tab 1
                </p>
              </div>
            </div>
          </div>
          <div
            className="flex-[1_0_0] min-w-px mr-[-8px] relative"
            data-name="Tab 2"
          >
            <div className="flex flex-col items-center justify-center size-full">
              <div className="content-stretch flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] gap-[0.5px] items-center justify-center pb-[7px] pt-[6px] px-[8px] relative size-full text-[#1a1a1a] text-center">
                <div
                  className="flex flex-col justify-center leading-[0] relative shrink-0 text-[18px] w-full"
                  style={{
                    fontVariationSettings: "'wdth' 100",
                    fontFeatureSettings: "'ss16'",
                  }}
                >
                  <p className="leading-[28px]">{`\u{100001}`}</p>
                </div>
                <p
                  className="leading-[12px] relative shrink-0 text-[10px] w-full"
                  style={{
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  Tab 2
                </p>
              </div>
            </div>
          </div>
          <div
            className="flex-[1_0_0] min-w-px relative"
            data-name="Tab 3"
          >
            <div className="flex flex-col items-center justify-center size-full">
              <div className="content-stretch flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] gap-[0.5px] items-center justify-center pb-[7px] pt-[6px] px-[8px] relative size-full text-[#1a1a1a] text-center">
                <div
                  className="flex flex-col justify-center leading-[0] relative shrink-0 text-[18px] w-full"
                  style={{
                    fontVariationSettings: "'wdth' 100",
                    fontFeatureSettings: "'ss16'",
                  }}
                >
                  <p className="leading-[28px]">{`\u{1006E4}`}</p>
                </div>
                <p
                  className="leading-[12px] relative shrink-0 text-[10px] w-full"
                  style={{
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  Tab 3
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FillShadow1() {
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

function GlassEffect1() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[296px]"
      data-name="Glass Effect"
    />
  );
}

function Search() {
  return (
    <div
      className="content-stretch flex items-center relative shrink-0"
      data-name="Search"
    >
      <div className="absolute inset-[-4px]" data-name="BG">
        <FillShadow1 />
        <GlassEffect1 />
      </div>
      <div
        className="content-stretch flex flex-col items-center justify-center pb-[7px] pt-[6px] px-[8px] relative shrink-0 size-[54px]"
        data-name="Search Tab"
      >
        <div
          className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] relative shrink-0 text-[#1a1a1a] text-[17px] text-center w-full"
          style={{
            fontVariationSettings: "'wdth' 100",
            fontFeatureSettings: "'ss16'",
          }}
        >
          <p className="leading-[28px]">{`\u{1002AB}`}</p>
        </div>
      </div>
    </div>
  );
}

export default function TabBar() {
  return (
    <div
      className="content-stretch flex gap-[16px] items-center pb-[25px] pt-[16px] px-[25px] relative size-full"
      data-name="Tab Bar"
    >
      <TabBarButtons />
      <Search />
    </div>
  );
}