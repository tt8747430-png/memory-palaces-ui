import svgPaths from "./svg-gdih11qle9";
import imgCheckmarkIconBlueG092KCopy1 from "./08c418c3a6bbfac71afdc32aade5884a201edce6.png";
import { imgCheckmarkIconBlueG092KCopy } from "./svg-chqvc";

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

function Progress() {
  return (
    <div className="absolute contents left-[16px] top-[117px]" data-name="progress">
      <div className="absolute bg-[#faab3c] h-[6px] left-[266px] rounded-[3px] top-[117px] w-[109px]" data-name="3 active" />
      <div className="absolute bg-[#0eb01d] h-[6px] left-[16px] rounded-[3px] top-[117px] w-[109px]" data-name="1" />
      <div className="absolute bg-[#0eb01d] h-[6px] left-[141px] rounded-[3px] top-[117px] w-[109px]" data-name="2" />
    </div>
  );
}

function ButtonIcon() {
  return (
    <div className="absolute inset-[10%_91.14%_10%_0] overflow-clip" data-name="button-icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <circle cx="16" cy="16" fill="var(--fill-0, #F4F5F7)" id="background" r="16" />
      </svg>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Font_Awesome_6_Pro:Regular',sans-serif] leading-[normal] left-1/2 not-italic text-[#343942] text-[16px] text-center top-[calc(50%-8px)] whitespace-nowrap">{`\uF060`}</p>
    </div>
  );
}

function Title() {
  return (
    <div className="absolute h-[40px] left-[16px] overflow-clip top-[61px] w-[361px]" data-name="title">
      <p className="[word-break:break-word] absolute font-['Libre_Franklin:SemiBold',sans-serif] font-semibold leading-[normal] left-[44px] text-[#17243e] text-[22px] top-[7px] whitespace-nowrap">Create Vacancy</p>
      <ButtonIcon />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bg-[#eef4fe] content-stretch flex inset-[0_1px_1px_0] items-center px-[16px] py-[9px] rounded-[100px]">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] min-w-px relative text-[#17243e] text-[14px] text-center">Create Vacancy</p>
    </div>
  );
}

function Title1() {
  return (
    <div className="[word-break:break-word] absolute inset-[82.13%_42.66%_9.95%_5.54%] overflow-clip text-[12px] whitespace-nowrap" data-name="title">
      <p className="absolute font-['Mulish:Regular',sans-serif] font-normal leading-[16px] left-[calc(50%-93.5px)] text-[#5d6675] top-[calc(50%+1.5px)]">This will be displayed on job page</p>
      <p className="absolute font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] left-0 text-[#23272c] top-0 uppercase">Show contacts</p>
    </div>
  );
}

function Showing() {
  return (
    <div className="absolute contents inset-[82.13%_1.66%_4.52%_5.54%]" data-name="showing">
      <Title1 />
      <div className="absolute inset-[91.86%_1.66%_4.52%_5.54%]" data-name="checkbox">
        <div className="absolute left-0 size-[16px] top-0" data-name="checkbox/light-ui/check">
          <div className="absolute bg-white border border-[#e0e4ea] border-solid inset-0 rounded-[4px]" data-name="checkbox" />
          <div className="absolute bg-[#4e1bd9] left-[3px] rounded-[3px] size-[10px] top-[3px]" data-name="color" />
        </div>
        <p className="[word-break:break-word] absolute font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] left-[22px] text-[#23272c] text-[12px] top-px whitespace-nowrap">Show the name and phone number on this job page</p>
      </div>
    </div>
  );
}

function Title2() {
  return (
    <div className="[word-break:break-word] absolute inset-[13.57%_48.48%_78.51%_5.54%] overflow-clip text-[12px] whitespace-nowrap" data-name="title">
      <p className="absolute font-['Mulish:Regular',sans-serif] font-normal leading-[16px] left-[calc(50%-83px)] text-[#5d6675] top-[calc(50%+1.5px)]">Person to contact for inquiries</p>
      <p className="absolute font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] left-0 text-[#23272c] top-0 uppercase">Contact Person</p>
    </div>
  );
}

function Field() {
  return (
    <div className="absolute inset-[23.3%_5.54%_67.19%_5.54%] overflow-clip" data-name="field">
      <div className="absolute bg-white border border-[#e0e4ea] border-solid inset-0 rounded-[12px]" data-name="field" />
      <p className="[word-break:break-word] absolute font-['Mulish:Regular',sans-serif] font-normal leading-[16px] left-[37px] text-[#5d6675] text-[12px] top-[13px] whitespace-nowrap">Position name</p>
      <p className="[word-break:break-word] absolute font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] left-[16px] not-italic text-[#969da6] text-[14px] top-[14px] whitespace-nowrap">{`\uF007`}</p>
    </div>
  );
}

function Name() {
  return (
    <div className="absolute contents inset-[13.57%_5.54%_67.19%_5.54%]" data-name="name">
      <Title2 />
      <Field />
    </div>
  );
}

function Title3() {
  return (
    <div className="[word-break:break-word] absolute inset-[36.43%_65.1%_55.66%_5.54%] overflow-clip text-[12px] whitespace-nowrap" data-name="title">
      <p className="absolute font-['Mulish:Regular',sans-serif] font-normal leading-[16px] left-[calc(50%-53px)] text-[#5d6675] top-[calc(50%+1.5px)]">Phone for inquiries</p>
      <p className="absolute font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] left-0 text-[#23272c] top-0 uppercase">Contact Phone</p>
    </div>
  );
}

function Field1() {
  return (
    <div className="absolute contents left-[20px] top-[203px]" data-name="field">
      <div className="absolute inset-[45.93%_5.54%_44.57%_5.54%] rounded-[12px]" data-name="field">
        <div aria-hidden="true" className="absolute border border-[#1f74ec] border-solid inset-[-0.5px] pointer-events-none rounded-[12.5px]" />
      </div>
      <p className="[word-break:break-word] absolute font-['Mulish:Medium',sans-serif] font-medium leading-[normal] left-[57px] text-[#17243e] text-[12px] top-[216px] whitespace-nowrap">(123) 456-7890 |</p>
      <p className="[word-break:break-word] absolute font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] left-[36px] not-italic text-[#1f74ec] text-[14px] top-[217px] whitespace-nowrap">{`\uF095`}</p>
    </div>
  );
}

function Phone() {
  return (
    <div className="absolute contents left-[20px] top-[161px]" data-name="phone">
      <Title3 />
      <Field1 />
    </div>
  );
}

function Title4() {
  return (
    <div className="[word-break:break-word] absolute inset-[59.28%_52.35%_32.81%_5.54%] overflow-clip text-[12px] whitespace-nowrap" data-name="title">
      <p className="absolute font-['Mulish:Regular',sans-serif] font-normal leading-[16px] left-[calc(50%-76px)] text-[#5d6675] top-[calc(50%+1.5px)]">Extra contact info if needed</p>
      <p className="absolute font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] left-0 text-[#23272c] top-0 uppercase">Additional Contact</p>
    </div>
  );
}

function Field2() {
  return (
    <div className="absolute inset-[69%_5.54%_21.49%_5.54%] overflow-clip" data-name="field">
      <div className="absolute bg-white border border-[#e0e4ea] border-solid inset-0 rounded-[12px]" data-name="field" />
      <p className="[word-break:break-word] absolute font-['Mulish:Regular',sans-serif] font-normal leading-[16px] left-[16px] text-[#5d6675] text-[12px] top-[13px] whitespace-nowrap">Skype, whatsapp, etc</p>
    </div>
  );
}

function AsitionalContact() {
  return (
    <div className="absolute contents inset-[59.28%_5.54%_21.49%_5.54%]" data-name="asitional-contact">
      <Title4 />
      <Field2 />
    </div>
  );
}

function Contacts() {
  return (
    <div className="absolute h-[442px] left-[16px] overflow-clip top-[147px] w-[361px]" data-name="contacts">
      <div className="absolute bg-white border border-[#e0e4ea] border-solid inset-0 rounded-[20px]" data-name="background" />
      <Showing />
      <Name />
      <Phone />
      <AsitionalContact />
      <p className="[word-break:break-word] absolute font-['Libre_Franklin:SemiBold',sans-serif] font-semibold leading-[normal] left-[20px] text-[#23272c] text-[20px] top-[20px] whitespace-nowrap">Contact information</p>
    </div>
  );
}

function Text() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[17px] left-1/2 overflow-clip top-[calc(50%-0.5px)] w-[36px]" data-name="text">
      <p className="[word-break:break-word] absolute font-['Libre_Franklin:SemiBold',sans-serif] font-semibold leading-[normal] left-0 text-[14px] text-white top-0 whitespace-nowrap">Done</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute inset-[83.33%_5.54%_5.38%_5.54%] overflow-clip" data-name="button">
      <div className="absolute bg-[#1f74ec] inset-0 rounded-[21px]" data-name="background" />
      <Text />
    </div>
  );
}

function Image() {
  return (
    <div className="absolute contents inset-[11.83%_30.47%_50.54%_30.75%]" data-name="image">
      <div className="absolute inset-[11.83%_30.47%_50.54%_30.75%]" data-name="Mask" />
      <div className="absolute inset-[10.75%_26.87%_45.43%_27.98%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[10px_4px] mask-size-[140px_140px]" style={{ maskImage: `url('${imgCheckmarkIconBlueG092KCopy}')` }} data-name="Checkmark Icon Blue.G09.2k Copy">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgCheckmarkIconBlueG092KCopy1} />
        </div>
      </div>
    </div>
  );
}

function Modal() {
  return (
    <div className="absolute h-[372px] left-[16px] overflow-clip top-[440px] w-[361px]" data-name="modal">
      <div className="absolute bg-white inset-0 rounded-[20px]" data-name="background" />
      <Button />
      <p className="[word-break:break-word] absolute font-['Mulish:SemiBold',sans-serif] font-semibold leading-[normal] left-[13.85%] right-[13.57%] text-[#5d6675] text-[14px] text-center top-[calc(50%+38px)]">Exciting news! Your new vacancy is ready for applications. Expect top talent to apply soon!</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Libre_Franklin:SemiBold',sans-serif] font-semibold leading-[normal] left-[calc(50%+1px)] text-[#23272c] text-[20px] text-center top-[calc(50%+6px)] whitespace-nowrap">{`Vacancy Creation Success! `}</p>
      <Image />
      <div className="absolute bg-[#e0e4ea] inset-[4.3%_43.21%_94.62%_43.49%] rounded-[2.5px]" data-name="indicator" />
    </div>
  );
}

export default function Component18VacancyCreateSuccessfully() {
  return (
    <div className="bg-white relative size-full" data-name="18-Vacancy-Create-Successfully">
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
      <Progress />
      <div className="absolute h-[21px] left-[82px] top-[831px] w-[230px]" data-name="Bars/Home Indicators/iPhone/Light - Landscape">
        <div className="-translate-x-1/2 absolute bg-black bottom-[8px] h-[5px] left-1/2 rounded-[100px] w-[140px]" data-name="Home Indicator" />
      </div>
      <Title />
      <div className="absolute h-[42px] left-[17px] top-[770px] w-[360px]" data-name="button">
        <Frame />
      </div>
      <Contacts />
      <div className="absolute bg-[#23272c] h-[852px] left-0 opacity-50 top-0 w-[393px]" data-name="overlay" />
      <Modal />
    </div>
  );
}