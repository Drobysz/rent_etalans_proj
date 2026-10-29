import type {
	MetadataRoute,
} from "next";

export default function sitemap():
	MetadataRoute.Sitemap {
	const baseUrl =
		"https://digital-harbor.shop/au_calme_campagne_etalans";

	const routes = [
		{ route: "", lastModified: "2026-10-20" },
		{ route: "/cancel", lastModified: "2026-10-20" },
		{ route: "/success", lastModified: "2026-10-20" },
		{ route: "/documentation", lastModified: "2026-10-20" },
		{ route: "/housing/purchases", lastModified: "2026-10-20" },
		{ route: "/housing/reservation", lastModified: "2026-10-20" },
		{ route: "/housing/services", lastModified: "2026-10-20" },
	];

	return routes.map(
		({ route, lastModified }) => ({
			url: `${baseUrl}${route}`,
			lastModified:
				new Date(lastModified),
			changeFrequency:
				"monthly",
			priority:
				route === "" ? 1 : 0.8,
		})
	);
}
