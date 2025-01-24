import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ResumeUploader = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const parseResume = async (file: File) => {
    // Mock resume parsing - in a real app, this would use a proper resume parsing service
    const mockExtractedData = {
      fullName: "John Doe",
      email: "john@example.com",
      skills: ["JavaScript", "React", "TypeScript", "Node.js"],
      experience: "5 years of frontend development",
      education: "Bachelor's in Computer Science",
      careerGoals: "Looking to grow as a full-stack developer",
    };

    // Show success message
    toast({
      title: "Resume Parsed Successfully",
      description: "Your profile has been auto-filled with resume data.",
    });

    return mockExtractedData;
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    try {
      const extractedData = await parseResume(file);
      
      // Store the extracted data
      localStorage.setItem('userProfile', JSON.stringify(extractedData));
      
      // Navigate to profile page to review auto-filled data
      navigate('/profile');
      
      toast({
        title: "Profile Updated",
        description: "Please review your auto-filled profile data",
      });
    } catch (error) {
      toast({
        title: "Error Parsing Resume",
        description: "There was an error processing your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".pdf"
        onChange={handleResumeUpload}
        className="hidden"
        id="resume-upload"
      />
      <label htmlFor="resume-upload">
        <Button variant="outline" className="cursor-pointer flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Resume
        </Button>
      </label>
    </div>
  );
};