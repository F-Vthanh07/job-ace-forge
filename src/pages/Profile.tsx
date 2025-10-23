import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <AvatarFallback className="text-2xl font-bold gradient-primary text-white">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">John Doe</h1>
                <p className="text-muted-foreground mb-3">Senior Frontend Developer</p>
                <Button className="gradient-primary">Edit Profile Photo</Button>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="firstName" defaultValue="John" className="pl-10" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="lastName" defaultValue="Doe" className="pl-10" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" defaultValue="john.doe@example.com" className="pl-10" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="phone" defaultValue="+84 123 456 789" className="pl-10" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="location" defaultValue="Ho Chi Minh City, Vietnam" className="pl-10" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" rows={4} defaultValue="Passionate frontend developer with 5+ years of experience..." className="mt-1" />
                  </div>

                  <Button className="gradient-primary">Save Changes</Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="professional">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Professional Details</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentRole">Current Role</Label>
                    <div className="relative mt-1">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="currentRole" defaultValue="Senior Frontend Developer" className="pl-10" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="education">Education</Label>
                    <div className="relative mt-1">
                      <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="education" defaultValue="Bachelor's in Computer Science" className="pl-10" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input id="experience" type="number" defaultValue="5" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Textarea id="skills" rows={3} defaultValue="React, TypeScript, Node.js, Tailwind CSS" className="mt-1" />
                  </div>

                  <Button className="gradient-primary">Update Professional Info</Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Change Password</h3>
                    <div className="space-y-3">
                      <Input type="password" placeholder="Current password" />
                      <Input type="password" placeholder="New password" />
                      <Input type="password" placeholder="Confirm new password" />
                      <Button>Update Password</Button>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-3 text-destructive">Danger Zone</h3>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
