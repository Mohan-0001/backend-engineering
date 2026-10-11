import type { PropsWithChildren, ReactNode } from "react"


type PanelProps = {
    title: string,
    children? : ReactNode
}

export function Panel({title, children} : PanelProps) {
    return (
        <section>
            <h1>{title}</h1>
            <div>{children ?? <em>No Children Present</em>}</div>
        </section>
    )
}


interface RequiredChildrenProps extends PropsWithChildren {
    title: string,
    children: string
}

export function RequiredChildrenPanel({title, children} : RequiredChildrenProps) {
    return (
        <section>
            <h1>{title}</h1>
            <div>{children ?? <em>No Children Present</em>}</div>
        </section>
    )
}