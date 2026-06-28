import Image from "next/image";

export default function MealsPage () {
    return (
        <article className="p-4">
            <header className="pb-5">
                <h1 className="font-bold text-neutral-700 text-4xl">
                    Breakfast
                </h1>
                <p className="text-neutral-500 text-sm">
                    This article will list the dishes that may be served for breakfast.
                </p>
            </header>

            <Image
                className="h-80 w-60 rounded-xl"
                width={125}
                height={250}
                src="/breakfast.jpg"
                alt="Breakfast illustration"
                loading="eager"
            />

            <ul className="flex flex-col gap-1 text-neutral-500 pl-1 pt-4 max-[560px]:text-sm">
                <li>
                    Fruits: Kiwi, bananas, oranges, avacado.
                </li>
                <li>
                    Drinks: Tea, Coffee, Milk, Water.
                </li>
                <li>
                    Baked goods: rose-shaped buns, pie, pancakes, baguettes.
                </li>
                <li>
                    Additional: jam produced by us, walnuts. 
                </li>
            </ul>
        </article>
    )
}