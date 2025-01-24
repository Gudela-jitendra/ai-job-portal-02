import { Job } from "@/types/job";
import { toast } from "@/components/ui/use-toast";

interface UserProfile {
  skills: string[];
  experience: string;
}

export const getRecommendedJobs = (jobs: Job[], userProfile: UserProfile | null) => {
  if (!userProfile) {
    console.log("No user profile found for recommendations");
    return [];
  }

  const userSkills = userProfile.skills.map((skill: string) => skill.toLowerCase());
  const userExperience = parseFloat(userProfile.experience) || 0;

  console.log("Processing recommendations with user profile:", {
    skills: userSkills,
    experience: userExperience
  });

  const recommendedJobs = jobs.filter(job => {
    // Match skills
    const jobSkills = job.requiredSkills.map(skill => skill.toLowerCase());
    const matchingSkills = jobSkills.filter(jobSkill => 
      userSkills.some(userSkill => 
        jobSkill === userSkill || 
        jobSkill.includes(userSkill) || 
        userSkill.includes(jobSkill)
      )
    );
    
    const skillMatchPercentage = matchingSkills.length / jobSkills.length;
    const hasMatchingSkills = skillMatchPercentage >= 0.3; // At least 30% skill match

    // Match experience
    const jobExperience = job.experienceRequired.years;
    const isExperienceMatch = Math.abs(userExperience - jobExperience) <= 2;

    console.log(`Job ${job.title} - Skills Match: ${hasMatchingSkills}, Experience Match: ${isExperienceMatch}`);

    return hasMatchingSkills && isExperienceMatch;
  });

  console.log(`Found ${recommendedJobs.length} recommended jobs`);

  if (recommendedJobs.length === 0) {
    toast({
      title: "No Matching Jobs",
      description: "Try updating your skills or experience to see more matches.",
      variant: "destructive"
    });
  }

  return recommendedJobs;
};