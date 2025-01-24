import { Job } from "@/types/job";
import { toast } from "@/hooks/use-toast";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, retries: number = 0): Promise<Response> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.log(`Retry attempt ${retries + 1} of ${MAX_RETRIES}`);
      await delay(RETRY_DELAY);
      return fetchWithRetry(url, retries + 1);
    }
    throw error;
  }
};

export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const response = await fetchWithRetry('http://localhost:8080/alljobs');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    let errorMessage = "Unable to load jobs. ";
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage += "Please check your internet connection.";
    } else {
      errorMessage += "Please try again later.";
    }
    
    toast({
      variant: "destructive",
      title: "Connection Error",
      description: errorMessage
    });
    
    return [];
  }
};