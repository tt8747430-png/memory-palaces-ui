import * as React from "react"

import {cn, keepInViewOnFocus} from "./utils"

/**
 * Shared multi-line field. Must forward refs (React 18): react-hook-form's
 * `register` attaches a ref to track mount state. Without forwardRef the ref is
 * dropped, the field validates as `undefined`, and submit silently fails.
 *
 * This holds prose (descriptions, hints, explanations), so unlike the
 * single-line `Input` (terms and names) it leaves autocorrect and spell-check
 * on, where they help. `autoComplete="off"` still hides the iOS autofill /
 * contact bar that was stealing space above the keyboard. 16px text on touch
 * avoids the focus zoom, and `keepInViewOnFocus` lifts the field above the
 * keyboard. The box grows with its content (where supported) and caps at 40dvh,
 * so a long entry stays scrollable instead of overflowing its sheet.
 */
const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    React.ComponentProps<"textarea">
>(function Textarea({className, onFocus, ...props}, ref) {
    return (
        <textarea
            ref={ref}
            data-slot="textarea"
            autoComplete="off"
            autoCapitalize="sentences"
            autoCorrect="on"
            spellCheck={true}
            onFocus={(e) => {
                onFocus?.(e)
                keepInViewOnFocus(e.currentTarget)
            }}
            className={cn(
                "field-sizing-content min-h-16 max-h-[40dvh] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
                className
            )}
            {...props}
        />
    )
})

export {Textarea}
