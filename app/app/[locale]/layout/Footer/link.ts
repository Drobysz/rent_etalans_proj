import { PathService } from "@/helpers/path";
const ps = PathService;

const links = [
    { 
        title: "Airbnb", 
        link: "https://www.airbnb.fr/users/profile/1591217550336237727?previous_page_name=PdpHomeMarketplace", 
        img: ps.withBasePath("/sm_icons/airbnb.svg") 
    },
    { 
        title: "Booking", 
        link: "https://shorturl.at/VQq5z", 
        img: ps.withBasePath("/sm_icons/booking.svg") 
    },
    { 
        title: "Whatsapp", 
        link: "https://wa.me/33636652035", 
        img: ps.withBasePath("/sm_icons/whatsapp.svg") 
    },
];

export default links;
