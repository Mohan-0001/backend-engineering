import { Suspense } from 'react';

type UrlParamsType = {
    params : Promise<{
        slug? : string[]
    }>
}

async function DynamicProfileRoute({params}: UrlParamsType) {
    const {slug} = await params;
    console.log(slug);
    if(!slug){
        return (
            <div>
                No Url Route Define
            </div>
        )
    }
    return (
        <div>
            Path Segments: {slug.join("/")}
        </div>
    )
}

export default async function DynamicProfilePage({params}: UrlParamsType) {
    return (
        <Suspense fallback={<div> Loading... </div>}>
            <DynamicProfileRoute params = {params} />
        </Suspense>
    )
}