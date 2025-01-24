import { Button } from "@/components/ui/button";
import { Job } from "@/types/job";
import { JobList } from "@/components/JobList";
import { JobFilters } from "./JobFilters";
import { toast } from "@/components/ui/use-toast";

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
  const getUserProfile = () => {
    const profile = localStorage.getItem('userProfile');
    return profile ? JSON.parse(profile) : null;
  };

  const filterJobs = (jobsToFilter: Job[]) => {
    if (!searchQuery) return jobsToFilter;
    return jobsToFilter.filter(job =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const sortJobs = (jobsToSort: Job[]) => {
    switch (sortOrder) {
      case "newest":
        return [...jobsToSort].sort((a, b) => b.postedDate - a.postedDate);
      case "oldest":
        return [...jobsToSort].sort((a, b) => a.postedDate - b.postedDate);
      case "recommended":
        return getRecommendedJobs(jobsToSort);
      default:
        return jobsToSort;
    }
  };

  const getRecommendedJobs = (jobsToFilter: Job[]) => {
    const userProfile = getUserProfile();
    
    if (!userProfile) {
      console.log("No user profile found for recommendations");
      toast({
        title: "Profile Required",
        description: "Please complete your profile to see job recommendations",
        variant: "destructive"
      });
      return [];
    }

    // Convert profile data to lowercase for better matching
    const userSkills = userProfile.skills.map((skill: string) => skill.toLowerCase());
    const userExperience = parseFloat(userProfile.experience) || 0;

    console.log("User Profile:", {
      skills: userSkills,
      experience: userExperience
    });

    const recommendedJobs = jobsToFilter.filter(job => {
      // Match skills (more strict matching)
      const jobSkills = job.requiredSkills.map(skill => skill.toLowerCase());
      const matchingSkills = jobSkills.filter(jobSkill => 
        userSkills.some(userSkill => 
          jobSkill === userSkill || // Exact match
          jobSkill.includes(userSkill) || // Job skill contains user skill
          userSkill.includes(jobSkill) // User skill contains job skill
        )
      );
      
      const skillMatchPercentage = matchingSkills.length / jobSkills.length;
      const hasMatchingSkills = skillMatchPercentage >= 0.3; // At least 30% skill match

      // Match experience (more precise range)
      const jobExperience = job.experienceRequired.years;
      const isExperienceMatch = Math.abs(userExperience - jobExperience) <= 2; // Within 2 years range

      console.log("Job Match Analysis:", {
        jobTitle: job.title,
        jobSkills,
        matchingSkills,
        skillMatchPercentage,
        hasMatchingSkills,
        userExperience,
        jobExperience,
        isExperienceMatch
      });

      // Return true only if BOTH skills AND experience match
      return hasMatchingSkills && isExperienceMatch;
    });

    if (recommendedJobs.length === 0) {
      toast({
        title: "No Matching Jobs",
        description: "No jobs match your current profile. Try updating your skills or experience.",
        variant: "destructive"
      });
    }

    return recommendedJobs;
  };

  const filteredJobs = filterJobs(jobs);
  const sortedJobs = sortJobs(filteredJobs);
  const recommendedJobs = getRecommendedJobs(filteredJobs);
  const userProfile = getUserProfile();

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
          <JobList jobs={recommendedJobs} />
        </div>
      )}
    </div>
  );
};