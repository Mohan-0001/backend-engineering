import React from "react";

const VARIANTS = ["primary", "secondary", "ghost"] as const;

type Variant = (typeof VARIANTS)[number];

type BadgeProps = {
    lable: string,
    variant?: Variant
}

export function Badge({lable, variant = "primary"}: BadgeProps){
    const styles : Record<Variant, React.CSSProperties> = {
        primary: {
            color: "red"
        },
        "secondary": {
            color: "yellow"
        },
        "ghost": {
            color: "black"
        }
    }

    return <span style={styles[variant]}>{lable}</span>
}