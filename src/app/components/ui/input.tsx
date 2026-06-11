import * as React from "react"
import {Input as InputPrimitive} from "@base-ui/react/input"

import {cn, keepInViewOnFocus} from "./utils"

/**
 * Must forward refs (React 18): react-hook-form's `register` attaches a ref to
 * track field mount state. Without forwardRef the ref is dropped, RHF treats
 * the field as unmounted, and its value validates as `undefined`.
 *
 * Font stays at 16px on touch (`text-base`, only dropping to 14px at `md`) so
 * iOS never zoom-jumps on focus, and `keepInViewOnFocus` lifts the field above
 * the keyboard.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    function Input({className, type, onFocus, ...props}, ref) {
        return (
            <InputPrimitive
                ref={ref}
                type={type}
                data-slot="input"
                // Suppress the iOS autofill / contact accessory bar and
                // password-manager overlays — they steal space above the keyboard
                // and we never want contact data in these fields. Callers can
                // still override by passing their own autoComplete.
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="sentences"
                spellCheck={false}
                data-1p-ignore=""
                data-lpignore="true"
                onFocus={(e) => {
                    onFocus?.(e)
                    keepInViewOnFocus(e.currentTarget)
                }}
                className={cn(
                    "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
                    className
                )}
                {...props}
            />
        )
    }
)

export {Input}
