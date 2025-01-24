import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  skills: z.string().min(2, "Please enter your skills"),
  experience: z.string().min(2, "Please enter your experience"),
  education: z.string().min(2, "Please enter your education"),
  careerGoals: z.string().min(2, "Please enter your career goals"),
});

export const UserProfileForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const existingProfile = localStorage.getItem('userProfile');
  const parsedProfile = existingProfile ? JSON.parse(existingProfile) : {};

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: parsedProfile.fullName || "",
      email: parsedProfile.email || "",
      skills: Array.isArray(parsedProfile.skills) ? parsedProfile.skills.join(", ") : "",
      experience: parsedProfile.experience || "",
      education: parsedProfile.education || "",
      careerGoals: parsedProfile.careerGoals || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const profileData = {
      ...values,
      skills: values.skills.toLowerCase().split(",").map(skill => skill.trim()),
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated. Recommendations will be refreshed.",
    });

    // Navigate back to home page to see updated recommendations
    navigate("/");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills (comma-separated)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="react, typescript, node.js, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your work experience..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your educational background..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="careerGoals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Career Goals</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your career aspirations..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Update Profile
        </Button>
      </form>
    </Form>
  );
};