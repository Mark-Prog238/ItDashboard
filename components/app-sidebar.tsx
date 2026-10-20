"use client"
// TODO add BP logo menu add toggle theme button
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
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
  FrameIcon,
  PieChartIcon,
  MapIcon,
  TerminalIcon,
  Terminal,
  Settings,
  Users,
  Boxes,
  Workflow,
  Server,
  Tablet
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
      url: "#",
      icon: (
          <Tablet/>
      ),
      items: [
        {
          title: "POS Units",
          icon: <Users/>,
          url: "/dashboard/mobilepos/devices",
          active: true,
        },
        {
          title: "Operators",
          icon: <Terminal/>,
          url: "/dashboard/mobilepos/users",
        },
        {
          title: "Settings",
          icon: <Settings/>,
          url: "#",
        },
      ],
    },
    {
      title: "OTHER APPS",
      url: "#",
      icon: (
          <Boxes
          />
      ),
      items: [
        {
          title: "N8N Workflows",
          url: "http://10.31.1.80:5678/home/workflows",
          icon: (
              <Workflow
              />
          ),
        },
        {
          title: "Zabbix monitoring",
          url: "https://zabbix.butanplin.si/",
          icon: (
              <Server
              />
          ),
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "N8N Workflows",
      url: "http://10.31.1.80:5678/home/workflows",
      icon: (
          <FrameIcon
          />
      ),
    },
    {
      title: "Zabbix monitoring",
      url: "#",
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
    {
      name: "Zabbix",
      url: "#",
      icon: (
        <PieChartIcon
        />
      ),
    },
    {
      name: "Travel",
      url: "https://zabbix.butanplin.si/",
      icon: (
        <MapIcon
        />
      ),
    },
  ],
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
