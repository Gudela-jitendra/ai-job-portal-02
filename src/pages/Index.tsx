import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { JobList } from "@/components/JobList";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/services/jobService";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Job } from "@/types/job";

const Index = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "recommended">("recommended");

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

  const handleFilterClick = () => {
    toast({
      title: "Filters",
      description: "Filter functionality coming soon!",
    });
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

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container py-8 animate-fade-in">
        <WelcomeHeader 
          onSearch={handleSearch}
          onFilterClick={handleFilterClick}
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

        <div className="mb-6 flex justify-end gap-2">
          <Button
            variant={sortOrder === "recommended" ? "default" : "outline"}
            onClick={() => setSortOrder("recommended")}
          >
            Recommended
          </Button>
          <Button
            variant={sortOrder === "newest" ? "default" : "outline"}
            onClick={() => setSortOrder("newest")}
          >
            Newest First
          </Button>
          <Button
            variant={sortOrder === "oldest" ? "default" : "outline"}
            onClick={() => setSortOrder("oldest")}
          >
            Oldest First
          </Button>
        </div>

        <JobList jobs={sortedJobs} />
      </div>
    </div>
  );
};

export default Index;