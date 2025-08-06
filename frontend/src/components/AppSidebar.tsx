import { useState } from "react";
import { ShoppingCart, Leaf, Apple, Wheat, Wrench, Home, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { categories } from "@/data/products";

const iconMap = {
  vegetables: Leaf,
  fruits: Apple,
  seeds: Wheat,
  tools: Wrench,
};

interface AppSidebarProps {
  onCategorySelect?: (categoryId: string) => void;
  selectedCategory?: string;
}

export function AppSidebar({ onCategorySelect, selectedCategory }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-r border-border/5">
      <SidebarContent className="bg-gradient-to-b from-primary via-primary/90 to-primary-dark">
        {/* Company Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div className="text-white">
              <h2 className="font-bold text-base">AI Alliance</h2>
              <p className="text-sm opacity-90">Agriculture NGO</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className="text-white/80 font-semibold text-sm mb-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/" 
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-white/25 text-white font-semibold shadow-lg backdrop-blur-sm' 
                          : 'text-white/80 hover:bg-white/15 hover:text-white'
                      }`
                    }
                  >
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/cart" 
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-white/25 text-white font-semibold shadow-lg backdrop-blur-sm' 
                          : 'text-white/80 hover:bg-white/15 hover:text-white'
                      }`
                    }
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Cart</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/admin" 
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-white/25 text-white font-semibold shadow-lg backdrop-blur-sm' 
                          : 'text-white/80 hover:bg-white/15 hover:text-white'
                      }`
                    }
                  >
                    <Settings className="w-5 h-5" />
                    <span>Admin</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories */}
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className="text-white/80 font-semibold text-sm mb-3">
            Product Categories
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {categories.map((category) => {
                const Icon = iconMap[category.id as keyof typeof iconMap] || Leaf;
                const isSelected = selectedCategory === category.id;
                return (
                  <SidebarMenuItem key={category.id}>
                    <SidebarMenuButton 
                      onClick={() => onCategorySelect?.(category.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full ${
                        isSelected 
                          ? 'bg-white/25 text-white font-semibold shadow-lg backdrop-blur-sm' 
                          : 'text-white/80 hover:bg-white/15 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{category.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-white/10">
          <div className="text-center text-white/60 text-xs">
            <p>© 2024 AI Alliance</p>
            <p>Agriculture NGO</p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

//to review