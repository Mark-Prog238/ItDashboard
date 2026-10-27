"use client"
// TODO add BP logo menu add toggle theme button
import * as React from "react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  TerminalIcon,
  Calendar,
  Terminal,
  Settings,
  Users,
  Boxes,
  Workflow,
  Shield,
  Tablet,
  Laptop,
  Activity
} from "lucide-react"
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Mobile POS",
      active: true,
      url: "#",
      icon: (
          <Tablet/>
      ),
      items: [
        {
          title: "POS Units",
          icon: <Terminal/>,
          url: "/mobilepos/devices",
          target: "",
          active: true,
        },
        {
          title: "Operators",
          icon: <Users/>,
          url: "/mobilepos/users",
          target: "",

        },
        {
          title: "Settings",
          icon: <Settings/>,
          url: "#",
          target: "",

        },
      ],
    },
    {
      title: "Administration",
      url: "#",
      icon: (
          <Shield
          />
      ),
      items: [
        {
          title: "Koledar Odsotnosti",
          url: "/calendar",
          target: "_blank",
          icon: (
              <Calendar/>
          ),
        },
      ],
    },
    {
      title: "IT Tools",
      url: "#",
      icon: (
          <Boxes
          />
      ),
      items: [
        {
          title: "pfSense Firewall",
          url: "https://10.31.230.4/",
          target: "_blank",
          icon: (
              <Shield/>
          ),
        },
        {
          title: "Endpoint Central",
          url: "https://siljswdeploy:8383/",
          target: "_blank",
          icon: (
              <Laptop/>
          ),
        },
        {
          title: "Zabbix Monitoring",
          url: "https://zabbix.butanplin.si/",
          target: "_blank",
          icon: (
              <Activity
              />
          ),
        },
        {
          title: "N8N Workflows",
          url: "http://10.31.1.80:5678/home/workflows",
          target: "_blank",
          icon: (
              <Workflow
              />
          ),
        },
      ],
    },
  ],
/*  navSecondary: [
    {
      title: "N8N Workflows",
      url: "http://10.31.1.80:5678/home/workflows",
      target: "_blank",
      icon: (
          <FrameIcon
          />
      ),
    },
    {
      title: "Zabbix monitoring",
      url: "http://zabbix.butanplin.si",
      target: "_blank",
      icon: (
          <PieChartIcon
          />
      ),
    },
  ],
  links: [
    {
      name: "N8N Automation",
      url: "http://10.31.1.80:5678/",
      icon: (
        <FrameIcon
        />
      ),
    },
  ],*/
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <TerminalIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {/*TODO add logo instead of TEXT*/}
                <span className="truncate font-medium">Butan Plin</span>
                <span className="truncate text-xs">Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
       {/* <NavProjects projects={data.links} />*/}
          {/*  <NavSecondary items={data.navSecondary} className="mt-auto" />*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
