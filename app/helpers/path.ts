export class PathService {
    static getPageActivity(path: string, href: string) {
        const pageNamePoints = href.split('/')
        
        const pagename = pageNamePoints[pageNamePoints.length - 1];
        const pathPoints = path.split('/');

        if (pagename == '') {
            return path === '' || path === '/';
        }
       
        return pathPoints.filter(p => p !== '').includes(pagename);
    }

    static withBasePath(path: string) {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

        if (!basePath || basePath === "/") {
            return path;
        }

        return `${basePath.replace(/\/$/, "")}${path}`;
    }
}
