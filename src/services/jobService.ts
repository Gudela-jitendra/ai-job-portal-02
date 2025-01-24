import { Job } from "@/types/job";
import { toast } from "@/components/ui/use-toast";

export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const response = await fetch('http://localhost:8080/alljobs');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    toast({
      variant: "destructive",
      title: "Error loading jobs",
      description: "Please check your connection and try again"
    });
    return [];
  }
};