import { Employee } from './api.model';

export interface SidebarMenuItem {
  name: string;
  route?: string;
  icon?: string;
  emoji?: string;
  permissions?: string[];
  subItems?: SidebarMenuItem[];
  navigationParams?: { name: string; operationType?: string; }
  sectionDivider?: boolean,
}

export class SidebarService {

  private sidabarMenu: SidebarMenuItem[] = [];

  constructor() {

    this.onInit();

  }

  private onInit(): void {
    this.sidabarMenu = [
      // {
      //   name: 'Dashboard',
      //   route: '/dashboard',
      //   icon: 'auto_graph',
      //   subItems: [],
      //   permissions: ['view.statistics'],
      // },
      {
        name: 'Bridges Development',
        route: '/bridges-development',
        icon: 'water',
        subItems: [],
        permissions: ['view.projects', 'delete.projects', 'update.projects', 'create.projects'],
      },
      {
        name: 'Road Development',
        route: '/road-development',
        icon: 'add_road',
        subItems: [],
        permissions: ['view.projects', 'delete.projects', 'update.projects', 'create.projects'],
      },
      {
        name: 'Road Rehabilitation',
        route: '/road-rehabilitation',
        icon: 'edit_road',
        subItems: [],
        permissions: ['view.projects', 'delete.projects', 'update.projects', 'create.projects'],
      },
    ];
  }


  UserMenu(user: Employee): SidebarMenuItem[] {

    let sidebar: SidebarMenuItem[] = [];

    this.sidabarMenu.filter((item: SidebarMenuItem) => {
      
      if (!item.permissions) {
        
        sidebar.push(item);

      } else {

        // Check if the user has any of the permissions required for this item.
        if (user.Permissions.some((permission) => item.permissions.includes(permission))) {

          sidebar.push({
            name: item.name,
            route: item.route,
            icon: item.icon,
            permissions: item.permissions,
            navigationParams: item.navigationParams,
            sectionDivider: item.sectionDivider ? item.sectionDivider : false,
            subItems: []
          });

          if (!item.sectionDivider) {
            let _subItems: string[] = [];
  
            item.subItems.filter((subItems: SidebarMenuItem) => {
              user.Permissions.filter((permission: string) => {
                if (subItems.permissions.includes(permission)) {
                  
                  // Check if the item has not been added already
                  if (!_subItems.includes(subItems.name)) {
                    _subItems.push(subItems.name);
  
                    sidebar[sidebar.length - 1].subItems.push({
                      name: subItems.name,
                      route: subItems.route,
                      permissions: subItems.permissions,
                      icon: subItems.icon,
                      navigationParams: subItems.navigationParams,
                    });
                  }
                }
              });            
            });
          }
        }
      }
    });

    // console.log('sidebar:', sidebar);

    return sidebar;
  }

  checkAccess(user: Employee, permission: string): boolean {
    return user.Permissions.includes(permission);
  }
}
