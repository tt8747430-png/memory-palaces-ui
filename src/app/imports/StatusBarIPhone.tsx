import {BatteryIcon, CellularIcon, WifiIcon,} from "../icons";

function Time({
                  textColor,
              }: {
    textColor?: "black" | "white";
}) {
    return (
        <div
            className="basis-0 box-border flex gap-2.5 grow h-[22px] items-center justify-center pt-0.5 relative shrink-0">
            <div
                className={`font-['SF_Pro:Semibold',_sans-serif] font-[590] leading-[0] shrink-0 text-[17px] ${textColor === "white" ? "text-white" : "text-black"} text-center text-nowrap`}
                style={{fontVariationSettings: "'wdth' 100"}}
            >
                <p className="leading-[22px] whitespace-pre">9:41</p>
            </div>
        </div>
    );
}

function Levels({color}: { color: string }) {
    return (
        <div
            className="basis-0 box-border flex gap-[7px] grow h-[22px] items-center justify-center pt-px relative shrink-0">
            <div className="h-[12.226px] shrink-0 w-[19.2px]">
                <CellularIcon color={color}/>
            </div>
            <div className="h-[12.328px] shrink-0 w-[17.142px]">
                <WifiIcon color={color}/>
            </div>
            <div className="h-[13px] shrink-0 w-[27.328px]">
                <BatteryIcon color={color}/>
            </div>
        </div>
    );
}

export default function StatusBarIPhone({
                                            textColor,
                                        }: {
    textColor?: "black" | "white";
}) {
    const color = textColor === "white" ? "white" : "black";

    return (
        <div className="relative size-full">
            <div className="flex flex-row items-center justify-center relative size-full">
                <div
                    className="box-border flex gap-[154px] items-center justify-center pb-[19px] pt-[21px] px-4 relative size-full">
                    <Time textColor={textColor}/>
                    <Levels color={color}/>
                </div>
            </div>
        </div>
    );
}