import { UnderlinedInnerLink } from "@/components/animations/UnderlinedLink/UnderlinedInnerLink";
import Image from "next/image";

export default function DeveloperPage () {
    return (
        <article className="p-10 max-[560px]:p-3">
            <header className="pb-5">
                <h1 className="text-4xl text-neutral-700 font-bold max-[560px]:text-2xl">
                    Note on the developer 
                </h1>
                <p className="text-neutral-500 max-[560px]:text-xs">
                    if you want to get acquinted with the developer projects you can follow 
                    <span className="w-fit h-fit pl-1 relative">
                        <UnderlinedInnerLink
                            className="text-blue-600"
                            colorLine="primary"
                            href="https://drobysz.vercel.app/en/projects"
                        >
                            the site
                        </UnderlinedInnerLink>
                    </span>
                </p>
            </header>
            <Image
                className="w-full h-[60%] rounded-xl "
                src="/developer.png"
                width={2648}
                height={1334}
                alt="developer project page illustration"
                loading="eager"
            />
        </article>
    )
}