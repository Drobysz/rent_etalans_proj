"use client";

import { cn } from "@/lib/utils";
import { bagel } from "@/fonts/fonts";
import s from "./page.module.scss";
import { redirect } from "next/navigation";

export default function DocsPage () {
    redirect("/documentation/privacy_policy");

    return (
        <h1 className={cn(
            bagel.className,
            s.title,
            s.centralize,
        )}>
            Welcome to the documentation page
        </h1>
    )
}