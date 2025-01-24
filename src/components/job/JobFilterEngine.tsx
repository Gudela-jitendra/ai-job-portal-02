import { Job } from "@/types/job";

export const filterJobs = (jobs: Job[], searchQuery: string) => {
  if (!searchQuery) return jobs;
  
  return jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

export const sortJobs = (jobs: Job[], sortOrder: "newest" | "oldest" | "recommended") => {
  switch (sortOrder) {
    case "newest":
      return [...jobs].sort((a, b) => b.postedDate - a.postedDate);
    case "oldest":
      return [...jobs].sort((a, b) => a.postedDate - b.postedDate);
    default:
      return jobs;
  }
};