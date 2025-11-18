"use client";

import { useState } from "react";

export function useSidebar(initialState = true) {
  const [isCollapsed, setIsCollapsed] = useState(initialState);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const collapseSidebar = () => {
    setIsCollapsed(true);
  };

  const expandSidebar = () => {
    setIsCollapsed(false);
  };

  return {
    isCollapsed,
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
  };
}
