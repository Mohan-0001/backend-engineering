import {Suspense} from 'react'

type ParamsType = {
    params: Promise<{
        username: string;
    }>
}

async function ProfileContent({params}: ParamsType) {
    const { username } = await params;

    return (
        <div>
            Dynamic Profile name -: {username}
        </div>
    )
}

export default function Page({params} : ParamsType) {
    return (
        <Suspense fallback={<div>Loading Content...</div>}>
            <ProfileContent params = {params}/>
        </Suspense>
    )
}