/*import { MENU_OPTIONS_JURIDICAL_PROCESSES } from '../common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
import { MENU_OPTIONS_REQUEST_MANAGE_RETURN } from '../common/constants/request/manage-return/menu-manage-return';
import { MENU_OPTIONS_SECURITY } from '../common/constants/security/security-menu';
import { ADMINISTRATIVE_PROCESSES_ROUTES } from '../common/routes/administrative-processes.routes';
import { CATALOGS_ROUTES } from '../common/routes/catalogs.routes';
import { COMMERCIALIZATION_ROUTES } from '../common/routes/commercialization.routes';
import { DOCUMENTATION_COMPLEMENTARY } from '../common/routes/documentation-complementary';
import { DOCUMENTS_RECEPTION_ROUTES } from '../common/routes/documents-reception.routes';
import { EXECUTIVE_PROCESSES_ROUTES } from '../common/routes/executive-processes.routes';
import { FINAL_DESTINATION_PROCESS_ROUTES } from '../common/routes/final-destination-process.routes';
import { GENERAL_PROCESSES_ROUTES } from '../common/routes/general-processes.routes';
import { JUDICIAL_PHYSICAL_RECEPTION_ROUTES } from '../common/routes/judicial-physical-reception.routes';
import { MASTER_FILES } from '../common/routes/master-file.routes';
import { PARAMETERIZATION_ROUTES } from '../common/routes/parameterization.routes';
import { SCHEDULING_DELIVERIES } from '../common/routes/scheduling-deliveries.routes';
import { APPRAISALS_ROUTES } from '../common/routes/siab-web/appraisals.routes';
import { CLAIMS_CONTROL_ROUTES } from '../common/routes/siab-web/claims-control.routes';
import { COMMERCIALIZATION_SW_ROUTES } from '../common/routes/siab-web/commercialization-sw.routes';
import { CONSULTATION_ROUTES } from '../common/routes/siab-web/consultation.routes';
import { INDICATORS_ROUTES } from '../common/routes/siab-web/indicators.routes';
import { MAINTENANCE_ROUTES } from '../common/routes/siab-web/maintenance.routes';
import { PARAMETRIZATION_ROUTES } from '../common/routes/siab-web/parametrization.routes';
import { REPORTS_ROUTES } from '../common/routes/siab-web/reports.routes';
import { SAMI_ROUTES } from '../common/routes/siab-web/simi.routes';*/
import { ADMIN_ROUTES, ENCARGADO_ROUTES } from '../common/routes/admin.routes';
import { ADMINSISTEM_ROUTES } from '../common/routes/adminSistem.routes';
import { CATALOGS_ROUTES } from '../common/routes/catalogs.routes';
import { CONTROL_ROUTES } from '../common/routes/control.routes';
import { SERVICES_ENCAR_ROUTES, SERVICES_ROUTES } from '../common/routes/services.routes';
import { IMenuItem } from './interfaces/menu.interface';

export const MENU_ADMIN_SIS: IMenuItem[] = [
  /*SIAB ROUTES*/
  {
    label: 'CONTROL DE ACCESO',
    icon: 'bx bx-shield-alt-2', 
    subItems: [
      ...ADMINSISTEM_ROUTES
    ],
  },
  {
    label: 'ADMINISTRACIÓN',
    icon: 'bx-buildings', 
    subItems: [
      ...ADMIN_ROUTES
    ],
  },
  /*SIAB-WEB ROUTES*/
  {
    label: 'SERVICIOS',
    icon: 'bx-analyse',
    subItems: [
      ...SERVICES_ROUTES
    ],
  },
  /*SAMI ROUTES*/
  {
    label: 'CONTROL',
    icon: 'bx-purchase-tag',
    subItems: [
      ...CONTROL_ROUTES
    ]
  },

  {
    label: 'CATALOGOS',
    icon: 'bx-server',
    subItems: [
      ...CATALOGS_ROUTES
    ]
  },

];

export const MENU_JEFE_NEGOCIO: IMenuItem[] = [
  /*SIAB ROUTES*/
  {
    label: 'ADMINISTRACIÓN',
    icon: 'bx-buildings', 
    subItems: [
      ...ADMIN_ROUTES
    ],
  },
  /*SIAB-WEB ROUTES*/
  {
    label: 'SERVICIOS',
    icon: 'bx-analyse',
    subItems: [
      ...SERVICES_ROUTES
    ],
  },
  /*SAMI ROUTES*/
  {
    label: 'CONTROL',
    icon: 'bx-purchase-tag',
    subItems: [
      ...CONTROL_ROUTES
    ]
  },

  /*{
    label: 'CATALOGOS',
    icon: 'bx-server',
    subItems: [
      ...CATALOGS_ROUTES
    ]
  },*/

];



export const MENU_ENCARGADO: IMenuItem[] = [
  /*SIAB ROUTES*/
 /* {
    label: 'ADMINISTRACIÓN',
    icon: 'bx-buildings', 
    subItems: [
      ...ENCARGADO_ROUTES
    ],
  },*/
  /*SIAB-WEB ROUTES*/
  {
    label: 'SERVICIOS',
    icon: 'bx-analyse',
    subItems: [
      ...SERVICES_ENCAR_ROUTES
    ],
  },
  /*SAMI ROUTES*/
  {
    label: 'CONTROL',
    icon: 'bx-purchase-tag',
    subItems: [
      ...CONTROL_ROUTES
    ]
  },

  /*{
    label: 'CATALOGOS',
    icon: 'bx-server',
    subItems: [
      ...CATALOGS_ROUTES
    ]
  },*/

];



