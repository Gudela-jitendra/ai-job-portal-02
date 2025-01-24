import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { JobList } from "@/components/JobList";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/services/jobService";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Job } from "@/types/job";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "recommended">("recommended");
  const [activeSection, setActiveSection] = useState<"all" | "recommended">("all");

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) return;

    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.description.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      toast({
        title: "No matches found",
        description: "Try adjusting your search terms",
        variant: "destructive"
      });
    }
  };

  const getUserProfile = () => {
    const profile = localStorage.getItem('userProfile');
    return profile ? JSON.parse(profile) : null;
  };

  const sortJobs = (jobsToSort: Job[]) => {
    switch (sortOrder) {
      case "newest":
        return [...jobsToSort].sort((a, b) => b.postedDate - a.postedDate);
      case "oldest":
        return [...jobsToSort].sort((a, b) => a.postedDate - b.postedDate);
      case "recommended":
        return sortByRecommendation(jobsToSort);
      default:
        return jobsToSort;
    }
  };

  const sortByRecommendation = (jobsToSort: Job[]) => {
    const userProfile = getUserProfile();
    
    if (!userProfile?.skills?.length) {
      // If no profile, sort by engagement (likes + comments)
      return [...jobsToSort].sort((a, b) => {
        const engagementA = a.likeCount + a.comments.length;
        const engagementB = b.likeCount + b.comments.length;
        return engagementB - engagementA;
      });
    }

    // If profile exists, prioritize skill matches
    return [...jobsToSort].sort((a, b) => {
      const skillMatchesA = a.requiredSkills.filter(skill => 
        userProfile.skills.includes(skill.toLowerCase())
      ).length;
      const skillMatchesB = b.requiredSkills.filter(skill => 
        userProfile.skills.includes(skill.toLowerCase())
      ).length;
      
      if (skillMatchesB !== skillMatchesA) {
        return skillMatchesB - skillMatchesA;
      }
      
      // If same number of skill matches, sort by engagement
      const engagementA = a.likeCount + a.comments.length;
      const engagementB = b.likeCount + b.comments.length;
      return engagementB - engagementA;
    });
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-red-500">
        Error loading jobs. Please try again later.
      </div>
    );
  }

  const filteredJobs = searchQuery
    ? jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : jobs;

  const sortedJobs = sortJobs(filteredJobs);
  const userProfile = getUserProfile();
  const recommendedJobs = sortByRecommendation(jobs);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container py-8 animate-fade-in">
        <WelcomeHeader 
          onSearch={handleSearch}
          onFilterClick={() => {}}
        />
        
        {!userProfile && (
          <div className="mb-8 p-4 bg-purple-500/10 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-2">Get Personalized Job Recommendations</h2>
            <p className="mb-4">Complete your profile to receive job recommendations tailored to your skills and experience.</p>
            <Link to="/profile">
              <Button variant="default">Update Profile</Button>
            </Link>
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-4">
            <Button
              variant={activeSection === "all" ? "default" : "outline"}
              onClick={() => setActiveSection("all")}
            >
              All Jobs
            </Button>
            <Button
              variant={activeSection === "recommended" ? "default" : "outline"}
              onClick={() => setActiveSection("recommended")}
            >
              Recommended
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ListFilter className="w-4 h-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("recommended")}>
                Recommended
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-8">
          {activeSection === "recommended" ? (
            <JobList jobs={recommendedJobs} />
          ) : (
            <JobList jobs={sortedJobs} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;