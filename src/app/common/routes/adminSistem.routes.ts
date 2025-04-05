import { IMenuItem } from "src/app/core/interfaces/menu.interface";

export const ADMINSISTEM_ROUTES: IMenuItem[] = [
    {
        label: 'Usuarios',
        icon: 'bx-buildings',
        link: '/pages/catalogs/users',
        /*subItems: [
            {
                label: 'Alojamientos',
                link: '/pages/catalogs/accommodations',
            },
            {
                label: 'Encargados',
                link: '/pages/catalogs/inCharges',
            },
        ]*/
    },
    {
        label: 'Roles',
        icon: 'bx-buildings',
        link: '/pages/catalogs/role',
    },
    {
        label: 'Permisos',
        icon: 'bx-buildings',
        link: '/pages/catalogs/permission',
    }
]