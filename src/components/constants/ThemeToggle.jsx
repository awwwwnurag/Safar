import useTheme from "@/Context/DarkMode/ThemeProvider";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="h-12 w-12">
      {theme === "dark" ? (
        <Moon className="h-7 w-7" />
      ) : (
        <Sun className="h-7 w-7" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ThemeToggle;
