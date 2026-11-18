import {CopyButton, CopyButtonIcon} from "@animate-ui/react/primitives/buttons/copy";
import * as React from "react";

export function copyToClipboard(val: string) {
    return (
        <div className={'flex flex-row items-center justify-start gap-2 '}>
            <CopyButton
                content={val}
                delay={1000}
                aria-label={`Copy ${val}`}
            >
                <CopyButtonIcon
                    icon={val}
                    copiedIcon="Kopirano"
                />
            </CopyButton>
        </div>
    )
}