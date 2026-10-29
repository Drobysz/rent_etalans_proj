import type {
	MetadataRoute,
} from "next";

export default function robots():
	MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap:
			"https://digital-harbor.shop/au_calme_campagne_etalans/sitemap.xml",
	};
}
