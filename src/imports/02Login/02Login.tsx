import svgPaths from "./svg-sg2rfa5lq5";

function Text() {
  return (
    <div
      className="absolute font-medium inset-[91.17%_25.95%_5.94%_25.7%] leading-[normal] overflow-clip text-[#17243e] whitespace-nowrap"
      data-name="text"
    >
      <p className="absolute font-['Mulish:Medium',sans-serif] left-[calc(50%-95px)] text-[12px] top-[calc(50%-7.5px)]">{`Don't have an Account?`}</p>
      <p className="absolute font-['Libre_Franklin:Medium',sans-serif] left-[calc(50%+46px)] text-[14px] top-[calc(50%-8.5px)]">
        Sing up
      </p>
    </div>
  );
}

function IconFacebook() {
  return (
    <div
      className="absolute inset-[33.33%_70.27%_33.33%_20.27%]"
      data-name="icon-facebook"
    >
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14 14"
      >
        <g id="icon-facebook">
          <path
            d={svgPaths.p2ba6bb80}
            fill="url(#paint0_linear_3_154)"
            id="Path"
          />
          <path
            d={svgPaths.p29332300}
            fill="var(--fill-0, white)"
            id="Path_2"
          />
        </g>
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="paint0_linear_3_154"
            x1="13.7922"
            x2="13.7922"
            y1="13.581"
            y2="-0.00259168"
          >
            <stop stopColor="#0062E0" />
            <stop offset="1" stopColor="#19AFFF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Facebook() {
  return (
    <div
      className="absolute inset-[74.02%_10.18%_18.85%_52.16%] overflow-clip"
      data-name="facebook"
    >
      <div
        className="absolute bg-[#eef4fe] inset-0 rounded-[21px]"
        data-name="background"
      />
      <IconFacebook />
      <p className="absolute font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] left-[52px] text-[#17243e] text-[14px] top-[12px] whitespace-nowrap">
        Facebook
      </p>
    </div>
  );
}

function IconGogle() {
  return (
    <div
      className="absolute inset-[33.33%_63.76%_33.33%_26.85%]"
      data-name="icon gogle"
    >
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14 14"
      >
        <g id="icon gogle">
          <g id="Object">
            <mask
              height="14"
              id="mask0_3_142"
              maskUnits="userSpaceOnUse"
              style={{ maskType: "luminance" }}
              width="14"
              x="0"
              y="0"
            >
              <path
                clipRule="evenodd"
                d={svgPaths.p194cfe00}
                fill="var(--fill-0, white)"
                fillRule="evenodd"
                id="a"
              />
            </mask>
            <g mask="url(#mask0_3_142)" />
          </g>
          <g id="Object_2">
            <mask
              height="14"
              id="mask1_3_142"
              maskUnits="userSpaceOnUse"
              style={{ maskType: "luminance" }}
              width="14"
              x="0"
              y="0"
            >
              <path
                clipRule="evenodd"
                d={svgPaths.p194cfe00}
                fill="var(--fill-0, white)"
                fillRule="evenodd"
                id="a_2"
              />
            </mask>
            <g mask="url(#mask1_3_142)">
              <path
                d={svgPaths.pcdf6c00}
                fill="var(--fill-0, #EA4335)"
                id="Path"
              />
            </g>
          </g>
          <g id="Object_3">
            <mask
              height="14"
              id="mask2_3_142"
              maskUnits="userSpaceOnUse"
              style={{ maskType: "luminance" }}
              width="14"
              x="0"
              y="0"
            >
              <path
                clipRule="evenodd"
                d={svgPaths.p194cfe00}
                fill="var(--fill-0, white)"
                fillRule="evenodd"
                id="a_3"
              />
            </mask>
            <g mask="url(#mask2_3_142)">
              <path
                d={svgPaths.p2dda5940}
                fill="var(--fill-0, #34A853)"
                id="Path_2"
              />
            </g>
          </g>
          <mask
            height="14"
            id="mask3_3_142"
            maskUnits="userSpaceOnUse"
            style={{ maskType: "luminance" }}
            width="14"
            x="0"
            y="0"
          >
            <path
              clipRule="evenodd"
              d={svgPaths.p194cfe00}
              fill="var(--fill-0, white)"
              fillRule="evenodd"
              id="a_4"
            />
          </mask>
          <g mask="url(#mask3_3_142)">
            <path
              d={svgPaths.p17ad0170}
              fill="var(--fill-0, #4285F4)"
              id="Path_3"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Google() {
  return (
    <div
      className="absolute inset-[74.02%_51.91%_18.85%_10.18%] overflow-clip"
      data-name="google"
    >
      <div
        className="absolute bg-[#eef4fe] inset-0 rounded-[21px]"
        data-name="background"
      />
      <p className="absolute font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] left-[62px] text-[#17243e] text-[14px] top-[12px] whitespace-nowrap">
        Google
      </p>
      <IconGogle />
    </div>
  );
}

function Divider() {
  return (
    <div
      className="absolute inset-[66.04%_10.18%_31.41%_10.18%] overflow-clip"
      data-name="divider"
    >
      <div
        className="absolute inset-[46.67%_60.38%_46.67%_0]"
        data-name="line"
      >
        <div
          className="absolute bg-white border border-[#e0e4ea] border-solid inset-0"
          data-name="line"
        />
      </div>
      <div
        className="absolute inset-[46.67%_0_46.67%_61.34%]"
        data-name="line"
      >
        <div
          className="absolute bg-white border border-[#e0e4ea] border-solid inset-0"
          data-name="line"
        />
      </div>
      <p className="absolute font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%-8.5px)] text-[#23272c] text-[12px] top-[calc(50%-7.5px)] uppercase whitespace-nowrap">
        or
      </p>
    </div>
  );
}

function Text1() {
  return (
    <div
      className="absolute inset-[55.6%_44.27%_41.51%_44.27%] overflow-clip"
      data-name="text"
    >
      <p className="absolute font-['Libre_Franklin:SemiBold',sans-serif] font-semibold leading-[normal] left-[calc(50%-22.5px)] text-[14px] text-white top-[calc(50%-8.5px)] whitespace-nowrap">
        Sing in
      </p>
    </div>
  );
}

function Button() {
  return (
    <div
      className="absolute contents inset-[53.48%_10.18%_39.39%_10.18%]"
      data-name="button"
    >
      <div
        className="absolute bg-[#1f74ec] inset-[53.48%_10.18%_39.39%_10.18%] rounded-[24px]"
        data-name="background"
      />
      <Text1 />
    </div>
  );
}

function Field() {
  return (
    <div
      className="absolute inset-[35.38%_0_0_0] overflow-clip"
      data-name="field"
    >
      <div
        className="absolute bg-white border border-[#e0e4ea] border-solid inset-0 rounded-[12px]"
        data-name="field"
      />
      <p className="absolute font-['Font_Awesome_6_Pro:Solid',sans-serif] leading-[normal] not-italic right-[34px] text-[#969da6] text-[14px] top-[15px] translate-x-full whitespace-nowrap">{`\uF070`}</p>
      <p className="absolute font-['Mulish:Regular',sans-serif] font-normal leading-[16px] left-[16px] text-[#5d6675] text-[12px] top-[13px] whitespace-nowrap">
        Enter Your Password
      </p>
    </div>
  );
}

function Password() {
  return (
    <div
      className="absolute inset-[29.03%_10.18%_59.93%_10.18%] overflow-clip"
      data-name="password"
    >
      <Field />
      <p className="absolute font-['Mulish:SemiBold',sans-serif] font-semibold leading-[normal] left-[16px] text-[#343942] text-[12px] top-0 uppercase whitespace-nowrap">
        Password
      </p>
    </div>
  );
}

function Field1() {
  return (
    <div
      className="absolute inset-[35.38%_0_0_0] overflow-clip"
      data-name="field"
    >
      <div
        className="absolute bg-white border border-[#e0e4ea] border-solid inset-0 rounded-[12px]"
        data-name="field"
      />
      <p className="absolute font-['Mulish:Regular',sans-serif] font-normal leading-[16px] left-[16px] text-[#5d6675] text-[12px] top-[13px] whitespace-nowrap">
        example@email.com
      </p>
    </div>
  );
}

function Email() {
  return (
    <div
      className="absolute inset-[15.28%_10.18%_73.68%_10.18%] overflow-clip"
      data-name="email"
    >
      <Field1 />
      <p className="absolute font-['Mulish:SemiBold',sans-serif] font-semibold leading-[normal] left-[16px] text-[#343942] text-[12px] top-0 uppercase whitespace-nowrap">
        Email
      </p>
    </div>
  );
}

function Login() {
  return (
    <div
      className="absolute h-[589px] left-0 overflow-clip top-[263px] w-[393px]"
      data-name="login"
    >
      <div
        className="absolute bg-white h-[589px] left-0 right-0 rounded-tl-[20px] rounded-tr-[20px] top-0"
        data-name="background"
      />
      <div
        className="absolute inset-[94.23%_32.06%_0_32.32%]"
        data-name="Bars/Status Bars/iPhone/Light Copy"
      >
        <div
          className="-translate-x-1/2 absolute bg-black bottom-[8px] h-[5px] left-1/2 rounded-[100px] w-[140px]"
          data-name="Home Indicator"
        />
      </div>
      <Text />
      <Facebook />
      <Google />
      <Divider />
      <Button />
      <p className="absolute font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%+52.5px)] text-[#1f74ec] text-[12px] top-[calc(50%-41.5px)] whitespace-nowrap">
        Forgot Password?
      </p>
      <div
        className="absolute inset-[42.78%_60.81%_54.5%_10.18%]"
        data-name="checkbox"
      >
        <div
          className="absolute left-0 size-[16px] top-0"
          data-name="checkbox/uncheck"
        >
          <div
            className="absolute bg-white border border-[#e0e4ea] border-solid inset-0 rounded-[4px]"
            data-name="checkbox"
          />
        </div>
        <p className="absolute font-['Libre_Franklin:Medium',sans-serif] font-medium leading-[normal] left-[22px] text-[#23272c] text-[12px] top-px whitespace-nowrap">
          Remember me
        </p>
      </div>
      <Password />
      <Email />
      <p className="absolute font-['Libre_Franklin:SemiBold',sans-serif] font-semibold leading-[normal] left-[40px] text-[#17243e] text-[22px] top-[40px] whitespace-nowrap">
        Log In
      </p>
    </div>
  );
}

function Title() {
  return (
    <div
      className="absolute contents left-[94px] top-[109px]"
      data-name="title"
    >
      <div
        className="absolute h-[24px] left-[94px] top-[109px] w-[20.486px]"
        data-name="Path"
      >
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 20.4856 24"
        >
          <path
            d={svgPaths.p2edae0c0}
            fill="var(--fill-0, #F4F5F7)"
            id="Path"
          />
        </svg>
      </div>
      <div
        className="absolute h-[23.37px] left-[117.35px] top-[109.31px] w-[4.918px]"
        data-name="Path"
      >
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 4.91781 23.3701"
        >
          <path
            d={svgPaths.padd1680}
            fill="var(--fill-0, #F4F5F7)"
            id="Path"
          />
        </svg>
      </div>
      <div
        className="absolute h-[17.323px] left-[125.03px] top-[115.68px] w-[16.752px]"
        data-name="Shape"
      >
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 16.7523 17.3228"
        >
          <path
            clipRule="evenodd"
            d={svgPaths.p1c2cc9f0}
            fill="var(--fill-0, #F4F5F7)"
            fillRule="evenodd"
            id="Shape"
          />
        </svg>
      </div>
      <div
        className="absolute h-[16.693px] left-[142.52px] top-[115.99px] w-[16.919px]"
        data-name="Path"
      >
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 16.9194 16.6929"
        >
          <path
            d={svgPaths.p736e380}
            fill="var(--fill-0, #F4F5F7)"
            id="Path"
          />
        </svg>
      </div>
      <div
        className="absolute h-[17.323px] left-[159.96px] top-[115.68px] w-[16.752px]"
        data-name="Shape"
      >
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 16.7523 17.3228"
        >
          <path
            clipRule="evenodd"
            d={svgPaths.p1c2cc9f0}
            fill="var(--fill-0, #F4F5F7)"
            fillRule="evenodd"
            id="Shape"
          />
        </svg>
      </div>
      <div
        className="absolute h-[17.008px] left-[179.32px] top-[115.68px] w-[11.041px]"
        data-name="Path"
      >
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 11.0413 17.0079"
        >
          <path
            d={svgPaths.p399a8080}
            fill="var(--fill-0, #F4F5F7)"
            id="Path"
          />
        </svg>
      </div>
      <div
        className="absolute h-[16.693px] left-[191.78px] top-[115.99px] w-[24.595px]"
        data-name="Path"
      >
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 24.5954 16.6929"
        >
          <path
            d={svgPaths.p11cda100}
            fill="var(--fill-0, #FAAB3C)"
            id="Path"
          />
        </svg>
      </div>
      <div
        className="absolute h-[23.37px] left-[218.75px] top-[109.31px] w-[4.981px]"
        data-name="Shape"
      >
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 4.98127 23.3701"
        >
          <path
            clipRule="evenodd"
            d={svgPaths.p7e78700}
            fill="var(--fill-0, #FAAB3C)"
            fillRule="evenodd"
            id="Shape"
          />
        </svg>
      </div>
      <div
        className="absolute h-[17.323px] left-[226.08px] top-[115.68px] w-[15.261px]"
        data-name="Path"
      >
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15.2611 17.3228"
        >
          <path
            d={svgPaths.p217c7e00}
            fill="var(--fill-0, #FAAB3C)"
            id="Path"
          />
        </svg>
      </div>
      <div
        className="absolute h-[17.323px] left-[243.25px] top-[115.68px] w-[16.752px]"
        data-name="Shape"
      >
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 16.7523 17.3228"
        >
          <path
            clipRule="evenodd"
            d={svgPaths.p1c2cc9f0}
            fill="var(--fill-0, #FAAB3C)"
            fillRule="evenodd"
            id="Shape"
          />
        </svg>
      </div>
    </div>
  );
}

function Logo1() {
  return (
    <div
      className="absolute contents left-[40px] top-[99px]"
      data-name="logo"
    >
      <div
        className="absolute h-[40.6px] left-[41.5px] top-[102.4px] w-[38.498px]"
        data-name="Path"
      >
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 38.498 40.5998"
        >
          <path
            clipRule="evenodd"
            d={svgPaths.p7d8fa70}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Path"
          />
        </svg>
      </div>
      <div
        className="absolute h-[31.285px] left-[49.15px] top-[110.45px] w-[29.664px]"
        data-name="Path"
      >
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 29.6636 31.2849"
        >
          <path
            clipRule="evenodd"
            d={svgPaths.p244c8400}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Path"
          />
        </svg>
      </div>
      <div
        className="absolute h-[8.016px] left-[40px] top-[99px] w-[7.603px]"
        data-name="Oval"
      >
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 7.60278 8.01638"
        >
          <ellipse
            cx="3.80139"
            cy="4.00819"
            fill="var(--fill-0, #0EB01D)"
            id="Oval"
            rx="3.80139"
            ry="4.00819"
          />
        </svg>
      </div>
      <div
        className="absolute h-[6.11px] left-[63.29px] top-[125.04px] w-[5.795px]"
        data-name="Path"
      >
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 5.79463 6.10986"
        >
          <path
            clipRule="evenodd"
            d={svgPaths.p38adcf80}
            fill="var(--fill-0, #FAAB3C)"
            fillRule="evenodd"
            id="Path"
          />
        </svg>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div
      className="absolute contents left-[40px] top-[99px]"
      data-name="logo"
    >
      <Title />
      <Logo1 />
    </div>
  );
}

function Battery() {
  return (
    <div
      className="absolute contents right-[32.57px] top-[22.6px]"
      data-name="Battery"
    >
      <div
        className="absolute border border-solid border-white h-[13px] opacity-35 right-[34.8px] rounded-[4.3px] top-[22.6px] w-[25px]"
        data-name="Border"
      />
      <div
        className="absolute h-[4px] right-[32.57px] top-[27.27px] w-[1.328px]"
        data-name="Cap"
      >
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 1.32804 4"
        >
          <path
            d={svgPaths.p32d253c0}
            fill="var(--fill-0, white)"
            id="Cap"
            opacity="0.4"
          />
        </svg>
      </div>
      <div
        className="absolute bg-white h-[9px] right-[37px] rounded-[2.5px] top-[24.6px] w-[21px]"
        data-name="Capacity"
      />
    </div>
  );
}

function TimeStyle() {
  return (
    <div
      className="absolute h-[22px] left-[43px] overflow-clip top-[18.5px] w-[54px]"
      data-name="Time Style"
    >
      <p
        className="absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] left-0 right-0 text-[17px] text-center text-white top-[calc(50%-11px)]"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        9:41
      </p>
    </div>
  );
}

export default function Component02Login() {
  return (
    <div
      className="bg-white relative size-full"
      data-name="02-Login"
    >
      <div
        className="absolute bg-[#1f74ec] h-[854px] left-0 top-0 w-[393px]"
        data-name="background"
      />
      <Login />
      <p className="absolute font-['Libre_Franklin:SemiBold',sans-serif] font-semibold leading-[normal] left-[40px] text-[#f4f5f7] text-[20px] top-[159px] w-[293px]">
        Simplify your Cleverwise access with our effortless
        sign-in process
      </p>
      <Logo />
      <div
        className="absolute h-[53px] left-0 top-0 w-[393px]"
        data-name="Bars/Status Bars/iPhone/Light"
      >
        <Battery />
        <div
          className="absolute inset-[43.77%_17.09%_33.4%_78.55%]"
          data-name="Wifi"
        >
          <svg
            className="absolute block inset-0 size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 17.1416 12.1"
          >
            <path
              d={svgPaths.p3d02d800}
              fill="var(--fill-0, white)"
              id="Wifi"
            />
          </svg>
        </div>
        <div
          className="absolute inset-[43.58%_23.36%_33.77%_71.76%]"
          data-name="Cellular Connection"
        >
          <svg
            className="absolute block inset-0 size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 19.2002 12"
          >
            <path
              d={svgPaths.p367a5c00}
              fill="var(--fill-0, white)"
              id="Cellular Connection"
            />
          </svg>
        </div>
        <TimeStyle />
      </div>
    </div>
  );
}