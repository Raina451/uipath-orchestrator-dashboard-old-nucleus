import React from "react";
import { Home, Package, PlayCircle, ListChecks, Key, Bot } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">UI</span>
          </div>
          <div>
            <div className="text-sm font-semibold">UiPath</div>
            <div className="text-xs text-muted-foreground">Orchestrator</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/')}>
                <Link to="/">
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/processes')}>
                <Link to="/processes">
                  <Package className="w-4 h-4" />
                  <span>Processes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/jobs')}>
                <Link to="/jobs">
                  <PlayCircle className="w-4 h-4" />
                  <span>Jobs</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/queues')}>
                <Link to="/queues">
                  <ListChecks className="w-4 h-4" />
                  <span>Queues</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/assets')}>
                <Link to="/assets">
                  <Key className="w-4 h-4" />
                  <span>Assets</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/robots')}>
                <Link to="/robots">
                  <Bot className="w-4 h-4" />
                  <span>Robots</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-2 text-xs text-muted-foreground border-t">
          <div className="font-medium">Enterprise Dashboard</div>
          <div className="text-[10px] mt-0.5">© Powered by UiPath</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}