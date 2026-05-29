import {Alignment, Fit, Layout, useRive, useStateMachineInput} from '@rive-app/react-canvas';
import {useEffect} from 'react';

interface RiveAnimationProps {
    src: string;
    stateMachineName?: string;
    triggerInput?: string;
    booleanInput?: string;
    booleanValue?: boolean;
    className?: string;
}

export function RiveAnimation({
                                  src,
                                  stateMachineName,
                                  triggerInput,
                                  booleanInput,
                                  booleanValue,
                                  className = "w-full h-full"
                              }: RiveAnimationProps) {
    const {rive, RiveComponent} = useRive({
        src,
        stateMachines: stateMachineName,
        layout: new Layout({
            fit: Fit.Contain,
            alignment: Alignment.Center,
        }),
        autoplay: true,
    });

    const trigger = useStateMachineInput(rive, stateMachineName || "", triggerInput || "");
    const boolInput = useStateMachineInput(rive, stateMachineName || "", booleanInput || "");

    // Optional: Trigger an input on load
    useEffect(() => {
        if (trigger && rive) {
            trigger.fire();
        }
    }, [trigger, rive]);

    useEffect(() => {
        if (boolInput && booleanValue !== undefined) {
            boolInput.value = booleanValue;
        }
    }, [boolInput, booleanValue]);

    return (
        <div className={className}>
            <RiveComponent/>
        </div>
    );
}
