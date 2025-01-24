import { Job } from "@/types/job";
import { toast } from "@/components/ui/use-toast";

interface UserProfile {
  skills: string[];
  experience: number;
}

export const getRecommendedJobs = (jobs: Job[], userProfile: UserProfile | null) => {
  if (!userProfile) {
    console.log("No user profile found for recommendations");
    toast({
      title: "Profile Required",
      description: "Please complete your profile to see job recommendations",
      variant: "destructive"
    });
    return [];
  }

  const userSkills = userProfile.skills.map((skill: string) => skill.toLowerCase());
  const userExperience = parseFloat(userProfile.experience.toString()) || 0;

  console.log("User Profile:", {
    skills: userSkills,
    experience: userExperience
  });

  const recommendedJobs = jobs.filter(job => {
    const jobSkills = job.requiredSkills.map(skill => skill.toLowerCase());
    const matchingSkills = jobSkills.filter(jobSkill => 
      userSkills.some(userSkill => 
        jobSkill === userSkill || 
        jobSkill.includes(userSkill) || 
        userSkill.includes(jobSkill)
      )
    );
    
    const skillMatchPercentage = matchingSkills.length / jobSkills.length;
    const hasMatchingSkills = skillMatchPercentage >= 0.3;

    const jobExperience = job.experienceRequired.years;
    const isExperienceMatch = Math.abs(userExperience - jobExperience) <= 2;

    return hasMatchingSkills && isExperienceMatch;
  });

  if (recommendedJobs.length === 0) {
    toast({
      title: "No Matching Jobs",
      description: "Try updating your skills or experience to see more matches.",
      variant: "destructive"
    });
  }

  return recommendedJobs;
};