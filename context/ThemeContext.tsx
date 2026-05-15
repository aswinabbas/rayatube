"use client";
import { createContext, useContext, useEffect, useState } from "react";
type Theme = "light"|"dark";
const Ctx = createContext<{theme:Theme;toggle:()=>void}>({theme:"light",toggle:()=>{}});
export function ThemeProvider({children}:{children:React.ReactNode}){
  const [theme,setTheme]=useState<Theme>("light");
  useEffect(()=>{
    const s=localStorage.getItem("kt_theme") as Theme|null;
    const p=window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light";
    const r=s??p; setTheme(r);
    document.documentElement.classList.toggle("dark",r==="dark");
  },[]);
  const toggle=()=>setTheme(t=>{
    const n=t==="light"?"dark":"light";
    localStorage.setItem("kt_theme",n);
    document.documentElement.classList.toggle("dark",n==="dark");
    return n;
  });
  return <Ctx.Provider value={{theme,toggle}}>{children}</Ctx.Provider>;
}
export const useTheme=()=>useContext(Ctx);
