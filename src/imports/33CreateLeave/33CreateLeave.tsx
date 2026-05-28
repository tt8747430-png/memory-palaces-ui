import svgPaths from "./svg-vtk89v7rj3";

function Text() {
  return (
    <div className="[word-break:break-word] absolute content-stretch flex gap-[4px] items-center justify-center leading-[normal] left-[24px] right-[25px] text-white top-[12px] whitespace-nowrap" data-name="text">
      <p className="font-['Font_Awesome_6_Pro:Solid',sans-serif] not-italic relative shrink-0 text-[12px]">{`\uF0C7`}</p>
      <p className="font-['Libre_Franklin:SemiBold',sans-serif] font-semibold relative shrink-0 text-[14px]">Save</p>
    </div>
  );
}

function Ttile() {
  return (
    <div className="[word-break:break-word] absolute h-[35px] left-[16px] overflow-clip text-[12px] top-[719px] w-[187px]" data-name="ttile">
      <p className="absolute font-['Mulish:Regular',sans-serif] font-normal leading-[16px] left-[calc(50%-93.5px)] text-[#5d6675] top-[calc(50%+1.5px)] w-[187px]">Short desctiption</p>
      <p className="absolute font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] left-0 text-[#23272c] top-0 uppercase whitespace-nowrap">Leave Reason *</p>
    </div>
  );
}

function Field() {
  return (
    <div className="absolute h-[126px] left-[16px] overflow-clip top-[762px] w-[361px]" data-name="field">
      <div className="absolute bg-white border border-[#e0e4ea] border-solid inset-0 rounded-[12px]" data-name="field" />
      <p className="[word-break:break-word] absolute font-['Mulish:Regular',sans-serif] font-normal leading-[normal] left-[12px] text-[#5d6675] text-[14px] top-[42px] w-[327px]">The concise explanation for leave, providing context for their absence</p>
      <div className="absolute inset-[23.02%_0_76.19%_0]" data-name="line">
        <div className="absolute bg-white border border-[#e0e4ea] border-solid inset-0" data-name="line" />
      </div>
      <p className="[word-break:break-word] absolute font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] left-[calc(50%-158.5px)] not-italic text-[#343942] text-[12px] top-[calc(50%-55px)] whitespace-nowrap">{`\uF032`}</p>
      <p className="[word-break:break-word] absolute font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] left-[calc(50%-75.5px)] not-italic text-[#343942] text-[12px] top-[calc(50%-55px)] whitespace-nowrap">{`\uF03A`}</p>
      <p className="[word-break:break-word] absolute font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] left-[calc(50%-45.5px)] not-italic text-[#343942] text-[12px] top-[calc(50%-55px)] whitespace-nowrap">{`\uF0CB`}</p>
      <p className="[word-break:break-word] absolute font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] left-[calc(50%-104.5px)] not-italic text-[#343942] text-[12px] top-[calc(50%-55px)] whitespace-nowrap">{`\uF0CD`}</p>
      <p className="[word-break:break-word] absolute font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] left-[calc(50%-131.5px)] not-italic text-[#343942] text-[12px] top-[calc(50%-55px)] whitespace-nowrap">{`\uF033`}</p>
    </div>
  );
}

function Reason() {
  return (
    <div className="absolute contents left-[16px] top-[719px]" data-name="reason">
      <Ttile />
      <Field />
    </div>
  );
}

function SelectWithIcon() {
  return (
    <div className="absolute h-[42px] left-[205px] overflow-clip top-[661px] w-[172px]" data-name="select/with-icon">
      <div className="absolute bg-white border border-[#e0e4ea] border-solid inset-0 rounded-[12px]" data-name="field" />
      <p className="[word-break:break-word] absolute font-['Mulish:Regular',sans-serif] font-normal leading-[normal] left-[16px] text-[#343942] text-[14px] top-[12px] whitespace-nowrap">Jan 24, 2024</p>
      <p className="[word-break:break-word] absolute font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic right-[27px] text-[#1f74ec] text-[12px] top-[14px] translate-x-full whitespace-nowrap">{`\uF133`}</p>
    </div>
  );
}

function SelectWithIcon1() {
  return (
    <div className="absolute h-[42px] left-[16px] overflow-clip top-[661px] w-[173px]" data-name="select/with-icon">
      <div className="absolute bg-white border border-[#e0e4ea] border-solid inset-0 rounded-[12px]" data-name="field" />
      <p className="[word-break:break-word] absolute font-['Mulish:Regular',sans-serif] font-normal leading-[normal] left-[16px] text-[#343942] text-[14px] top-[12px] whitespace-nowrap">Jan 12, 2024</p>
      <p className="[word-break:break-word] absolute font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic right-[27px] text-[#1f74ec] text-[12px] top-[14px] translate-x-full whitespace-nowrap">{`\uF133`}</p>
    </div>
  );
}

function Title1() {
  return (
    <div className="[word-break:break-word] absolute h-[35px] left-[16px] overflow-clip text-[12px] top-[618px] w-[111px] whitespace-nowrap" data-name="title">
      <p className="absolute font-['Mulish:Regular',sans-serif] font-normal leading-[16px] left-[calc(50%-55.5px)] text-[#5d6675] top-[calc(50%+1.5px)]">Period of work:</p>
      <p className="absolute font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] left-0 text-[#23272c] top-0 uppercase">Period of leave:</p>
    </div>
  );
}

function Title() {
  return (
    <div className="absolute contents left-[16px] top-[618px]" data-name="title">
      <Title1 />
    </div>
  );
}

function Period1() {
  return (
    <div className="absolute contents left-[16px] top-[618px]" data-name="period">
      <SelectWithIcon />
      <SelectWithIcon1 />
      <Title />
    </div>
  );
}

function Period() {
  return (
    <div className="absolute contents left-[16px] top-[618px]" data-name="period">
      <Period1 />
    </div>
  );
}

function Title2() {
  return (
    <div className="[word-break:break-word] absolute h-[35px] left-[16px] overflow-clip text-[12px] top-[519px] w-[129px] whitespace-nowrap" data-name="title">
      <p className="absolute font-['Mulish:Regular',sans-serif] font-normal leading-[16px] left-[calc(50%-64.5px)] text-[#5d6675] top-[calc(50%+1.5px)]">Only numbers</p>
      <p className="absolute font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] left-0 text-[#23272c] top-0 uppercase">Remaining Leaves *</p>
    </div>
  );
}

function Remaining() {
  return (
    <div className="absolute contents left-[16px] top-[519px]" data-name="remaining">
      <Title2 />
      <div className="absolute h-[40px] left-[16px] top-[562px] w-[361px]" data-name="field">
        <div className="absolute bg-white border border-[#e0e4ea] border-solid inset-0 rounded-[8px]" data-name="field" />
        <p className="[word-break:break-word] absolute font-['Mulish:Regular',sans-serif] font-normal leading-[normal] left-[12px] text-[#5d6675] text-[14px] top-[10px] whitespace-nowrap">12</p>
      </div>
    </div>
  );
}

function Title3() {
  return (
    <div className="[word-break:break-word] absolute h-[35px] left-[16px] overflow-clip text-[12px] top-[418px] w-[104px] whitespace-nowrap" data-name="title">
      <p className="absolute font-['Mulish:Regular',sans-serif] font-normal leading-[16px] left-[calc(50%-52px)] text-[#5d6675] top-[calc(50%+1.5px)]">{`Select Leave Type `}</p>
      <p className="absolute font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] left-0 text-[#23272c] top-0 uppercase">Leave Type *</p>
    </div>
  );
}

function Type() {
  return (
    <div className="absolute contents left-[16px] top-[418px]" data-name="type">
      <Title3 />
      <div className="absolute h-[42px] left-[16px] top-[461px] w-[361px]" data-name="field">
        <div className="absolute bg-white border border-[#e0e4ea] border-solid inset-0 rounded-[8px]" data-name="field" />
        <p className="[word-break:break-word] absolute font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] not-italic right-[27px] text-[#135cca] text-[12px] top-[14px] translate-x-full whitespace-nowrap">{`\uF078`}</p>
        <p className="[word-break:break-word] absolute font-['Mulish:Regular',sans-serif] font-normal leading-[normal] left-[16px] text-[#17243e] text-[14px] top-[11px] whitespace-nowrap">Sick Leave</p>
      </div>
    </div>
  );
}

function Title4() {
  return (
    <div className="[word-break:break-word] absolute h-[35px] left-[16px] overflow-clip text-[12px] top-[216px] w-[156px] whitespace-nowrap" data-name="title">
      <p className="absolute font-['Mulish:Regular',sans-serif] font-normal leading-[16px] left-[calc(50%-78px)] text-[#5d6675] top-[calc(50%+1.5px)]">Select Department</p>
      <p className="absolute font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] left-0 text-[#23272c] top-0 uppercase">Employee Department</p>
    </div>
  );
}

function Department() {
  return (
    <div className="absolute contents left-[16px] top-[216px]" data-name="department">
      <Title4 />
      <div className="absolute h-[42px] left-[16px] top-[259px] w-[361px]" data-name="field">
        <div className="absolute bg-white border border-[#e0e4ea] border-solid inset-0 rounded-[8px]" data-name="field" />
        <p className="[word-break:break-word] absolute font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] not-italic right-[27px] text-[#135cca] text-[12px] top-[14px] translate-x-full whitespace-nowrap">{`\uF078`}</p>
        <p className="[word-break:break-word] absolute font-['Mulish:Regular',sans-serif] font-normal leading-[normal] left-[16px] text-[#17243e] text-[14px] top-[11px] whitespace-nowrap">{`Sales & Marketing`}</p>
      </div>
    </div>
  );
}

function Title5() {
  return (
    <div className="[word-break:break-word] absolute h-[35px] left-[16px] overflow-clip text-[12px] top-[317px] w-[129px] whitespace-nowrap" data-name="title">
      <p className="absolute font-['Mulish:Regular',sans-serif] font-normal leading-[16px] left-[calc(50%-64.5px)] text-[#5d6675] top-[calc(50%+1.5px)]">Select Position</p>
      <p className="absolute font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] left-0 text-[#23272c] top-0 uppercase">Employee Position</p>
    </div>
  );
}

function Position() {
  return (
    <div className="absolute contents left-[16px] top-[317px]" data-name="position">
      <Title5 />
      <div className="absolute h-[42px] left-[16px] top-[360px] w-[361px]" data-name="field">
        <div className="absolute bg-white border border-[#e0e4ea] border-solid inset-0 rounded-[8px]" data-name="field" />
        <p className="[word-break:break-word] absolute font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] not-italic right-[27px] text-[#135cca] text-[12px] top-[14px] translate-x-full whitespace-nowrap">{`\uF078`}</p>
        <p className="[word-break:break-word] absolute font-['Mulish:Regular',sans-serif] font-normal leading-[normal] left-[16px] text-[#17243e] text-[14px] top-[11px] whitespace-nowrap">Graphic Designer</p>
      </div>
    </div>
  );
}

function Title6() {
  return (
    <div className="[word-break:break-word] absolute h-[35px] left-[17px] overflow-clip text-[12px] top-[117px] w-[107px] whitespace-nowrap" data-name="title">
      <p className="absolute font-['Mulish:Regular',sans-serif] font-normal leading-[16px] left-[calc(50%-53.5px)] text-[#5d6675] top-[calc(50%+1.5px)]">Employee Name</p>
      <p className="absolute font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] left-0 text-[#23272c] top-0 uppercase">Employee Name</p>
    </div>
  );
}

function No() {
  return (
    <div className="absolute contents left-[17px] top-[117px]" data-name="no">
      <Title6 />
      <div className="absolute h-[40px] left-[17px] top-[160px] w-[361px]" data-name="field">
        <div className="absolute border border-[#1f74ec] border-solid inset-0 rounded-[8px]" data-name="field" />
        <p className="[word-break:break-word] absolute font-['Mulish:Regular',sans-serif] font-normal leading-[normal] left-[12px] text-[#5d6675] text-[14px] top-[10px] whitespace-nowrap">Diana Campos |</p>
      </div>
    </div>
  );
}

function ButtonIcon() {
  return (
    <div className="absolute inset-[0_91.14%_0_0] overflow-clip" data-name="button-icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <circle cx="16" cy="16" fill="var(--fill-0, #F4F5F7)" id="background" r="16" />
      </svg>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] left-1/2 not-italic text-[#343942] text-[16px] text-center top-[calc(50%-8px)] whitespace-nowrap">{`\uF060`}</p>
    </div>
  );
}

function ButtonIconCopy() {
  return (
    <div className="absolute inset-[0_0_0_91.14%] overflow-clip" data-name="button-icon  copy">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <circle cx="16" cy="16" fill="var(--fill-0, #EEF4FE)" id="background" r="16" />
      </svg>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] left-1/2 not-italic text-[#1f74ec] text-[16px] text-center top-[calc(50%-8px)] whitespace-nowrap">{`\uF00D`}</p>
    </div>
  );
}

function Title7() {
  return (
    <div className="absolute h-[32px] left-[16px] overflow-clip top-[61px] w-[361px]" data-name="title">
      <p className="[word-break:break-word] absolute font-['Libre_Franklin:SemiBold',sans-serif] font-semibold leading-[normal] left-[40px] text-[#17243e] text-[22px] top-[3px] whitespace-nowrap">Create Leave</p>
      <ButtonIcon />
      <ButtonIconCopy />
    </div>
  );
}

function Battery() {
  return (
    <div className="absolute contents right-[32.57px] top-[22.6px]" data-name="Battery">
      <div className="absolute border border-black border-solid h-[13px] opacity-35 right-[34.8px] rounded-[4.3px] top-[22.6px] w-[25px]" data-name="Border" />
      <div className="absolute h-[4px] right-[32.57px] top-[27.27px] w-[1.328px]" data-name="Cap">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.32804 4">
          <path d={svgPaths.p32d253c0} fill="var(--fill-0, black)" id="Cap" opacity="0.4" />
        </svg>
      </div>
      <div className="absolute bg-black h-[9px] right-[37px] rounded-[2.5px] top-[24.6px] w-[21px]" data-name="Capacity" />
    </div>
  );
}

function TimeStyle() {
  return (
    <div className="absolute h-[22px] left-[43px] overflow-clip top-[18px] w-[54px]" data-name="Time Style">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] left-[27px] text-[17px] text-black text-center top-[calc(50%-11px)] w-[54px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        9:41
      </p>
    </div>
  );
}

export default function Component33CreateLeave() {
  return (
    <div className="bg-white relative size-full" data-name="33-Create-Leave">
      <div className="absolute h-[42px] left-[16px] top-[912px] w-[361px]" data-name="button">
        <div className="absolute bg-[#1f74ec] inset-0 rounded-[21px]" data-name="background" />
        <Text />
      </div>
      <Reason />
      <Period />
      <Remaining />
      <Type />
      <Department />
      <Position />
      <No />
      <Title7 />
      <div className="absolute h-[53px] left-0 top-0 w-[393px]" data-name="Bars/Status Bars/iPhone/Light">
        <Battery />
        <div className="absolute inset-[43.77%_17.09%_33.4%_78.55%]" data-name="Wifi">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.1416 12.0992">
            <path d={svgPaths.p37e47000} fill="var(--fill-0, black)" id="Wifi" />
          </svg>
        </div>
        <div className="absolute inset-[43.58%_23.36%_33.77%_71.76%]" data-name="Cellular Connection">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2002 12">
            <path d={svgPaths.p367a5c00} fill="var(--fill-0, black)" id="Cellular Connection" />
          </svg>
        </div>
        <TimeStyle />
      </div>
    </div>
  );
}