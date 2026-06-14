function withBasePath(path: string) {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

    if (!basePath || basePath === "/") {
        return path;
    }

    return `${basePath.replace(/\/$/, "")}${path}`;
}

const links = [
    { title: "Airbnb", link: "#", img: withBasePath("/sm_icons/airbnb.svg") },
    { title: "Booking", link: "#", img: withBasePath("/sm_icons/booking.svg") },
    { title: "Whatsapp", link: "#", img: withBasePath("/sm_icons/whatsapp.svg") },
];

export default links;
