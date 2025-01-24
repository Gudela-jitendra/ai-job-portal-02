import { Link } from "react-router-dom";
import { UserCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ResumeUploader } from "@/components/ResumeUploader";

const Navbar = () => {
  return (
    <header className="bg-card shadow-md backdrop-blur-sm sticky top-0 z-10">
      <div className="container py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="text-2xl font-bold hover:text-primary transition-colors cursor-pointer"
            aria-label="Go to home page"
          >
            AI-Powered Job Portal
          </Link>
          <Link to="/">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <ResumeUploader />
          <Link to="/profile">
            <Button variant="outline" className="flex items-center gap-2">
              <UserCircle className="w-5 h-5" />
              Profile
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;