"use client"

import { usePathname } from "next/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"

function isPathActive(pathname: string, url: string) {
  return url !== "#" && (pathname === url || pathname.startsWith(`${url}/`))
}

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
    items?: {
      title: string
      url: string
      icon: React.ReactNode
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isSubItemActive = (url: string) => isPathActive(pathname, url)
          const isItemActive =
            isPathActive(pathname, item.url) ||
            item.items?.some((subItem) => isSubItemActive(subItem.url)) === true

          return (
            <Collapsible
              key={`${item.title}-${isItemActive}`}
              defaultOpen={true}
              render={<SidebarMenuItem />}
            >
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isItemActive}
                aria-current={isPathActive(pathname, item.url) ? "page" : undefined}
                render={<a href={item.url} />}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <SidebarMenuAction
                    render={<CollapsibleTrigger />}
                    className="aria-expanded:rotate-90"
                  >
                    <ChevronRightIcon />
                    <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const isActive = isSubItemActive(subItem.url)

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              isActive={isActive}
                              aria-current={isActive ? "page" : undefined}
                              render={<a href={subItem.url} />}
                            >
                              {subItem.icon}
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
