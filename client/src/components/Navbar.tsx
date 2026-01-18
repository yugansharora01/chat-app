import { Moon, Sun, User, LogOut, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useLocation } from "react-router-dom";

const MobileMenu = () => {
  const { toggleSidebar, isMobile } = useSidebar();
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat");

  if (!isMobile || !isChatPage) return null;

  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
      <Menu className="h-5 w-5" />
    </Button>
  );
};

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === undefined) {
      setTheme("dark");
    }
  }, [theme, setTheme]);

  return (
    <nav className="border-b bg-card">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex items-center gap-2">
           <MobileMenu />
        </div>
        <h1
          className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent cursor-pointer"
          onClick={() => navigate("/")}
        >
          AI Chat
        </h1>


        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-48 bg-popover">
                <DropdownMenuItem className="cursor-pointer">
                  {user?.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};
