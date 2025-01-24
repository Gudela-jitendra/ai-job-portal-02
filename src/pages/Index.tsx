import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { JobList } from "@/components/JobList";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/services/jobService";
import { Job } from "@/types/job";
import { JobFilters } from "@/components/job/JobFilters";
import { JobSections } from "@/components/job/JobSections";

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

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container py-8 animate-fade-in">
        <WelcomeHeader 
          onSearch={handleSearch}
          onFilterClick={() => {}}
        />
        
        <JobSections
          jobs={jobs}
          searchQuery={searchQuery}
          sortOrder={sortOrder}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onSortOrderChange={setSortOrder}
        />
      </div>
    </div>
  );
};

export default Index;