function withBasePath(path: string) {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

    if (!basePath || basePath === "/") {
        return path;
    }

    return `${basePath.replace(/\/$/, "")}${path}`;
}

const links = [
    { 
        title: "Airbnb", 
        link: "https://www.airbnb.fr/users/profile/1591217550336237727?previous_page_name=PdpHomeMarketplace", 
        img: withBasePath("/sm_icons/airbnb.svg") 
    },
    { 
        title: "Booking", 
        link: "https://shorturl.at/VQq5z", 
        img: withBasePath("/sm_icons/booking.svg") 
    },
    { 
        title: "Whatsapp", 
        link: "https://wa.me/33636652035", 
        img: withBasePath("/sm_icons/whatsapp.svg") 
    },
];

export default links;
