import { Button } from "@/components/ui/button";
import { Job } from "@/types/job";
import { JobList } from "@/components/JobList";
import { JobFilters } from "./JobFilters";
import { getRecommendedJobs } from "./JobRecommendationEngine";
import { filterJobs, sortJobs } from "./JobFilterEngine";
import { useEffect, useState } from "react";

interface JobSectionsProps {
  jobs: Job[];
  searchQuery: string;
  sortOrder: "newest" | "oldest" | "recommended";
  activeSection: "all" | "recommended";
  onSectionChange: (section: "all" | "recommended") => void;
  onSortOrderChange: (order: "newest" | "oldest" | "recommended") => void;
}

export const JobSections = ({
  jobs,
  searchQuery,
  sortOrder,
  activeSection,
  onSectionChange,
  onSortOrderChange
}: JobSectionsProps) => {
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  // Listen for changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const profile = localStorage.getItem('userProfile');
      if (profile) {
        setUserProfile(JSON.parse(profile));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredJobs = filterJobs(jobs, searchQuery);
  const sortedJobs = sortJobs(filteredJobs, sortOrder);
  const recommendedJobs = userProfile ? getRecommendedJobs(filteredJobs, userProfile) : [];

  return (
    <div className="space-y-8">
      <div className="flex justify-center gap-4 mb-6">
        <Button
          variant={activeSection === "all" ? "default" : "outline"}
          onClick={() => onSectionChange("all")}
        >
          All Jobs
        </Button>
        <Button
          variant={activeSection === "recommended" ? "default" : "outline"}
          onClick={() => onSectionChange("recommended")}
        >
          Recommended
        </Button>
      </div>

      {activeSection === "all" && (
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <JobFilters sortOrder={sortOrder} onSortOrderChange={onSortOrderChange} />
          </div>
          <JobList jobs={sortedJobs} />
        </div>
      )}

      {activeSection === "recommended" && (
        <div className="space-y-4">
          {!userProfile && (
            <div className="mb-8 p-4 bg-purple-500/10 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-2">Get Personalized Job Recommendations</h2>
              <p className="mb-4">Complete your profile to receive job recommendations tailored to your skills and experience.</p>
              <Button variant="default" asChild>
                <a href="/profile">Update Profile</a>
              </Button>
            </div>
          )}
          {userProfile && recommendedJobs.length > 0 && (
            <JobList jobs={recommendedJobs} />
          )}
        </div>
      )}
    </div>
  );
};