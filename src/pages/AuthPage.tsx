
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AuthPage = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(userId, password);
      if (error) {
        toast({
          title: "Sign In Failed",
          description: error,
          variant: "destructive",
        });
      } else {
        // Fetch user profile to get first name for personalized message
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, display_name')
          .eq('user_id', userId)
          .single();

        const firstName = profile?.first_name || profile?.display_name || userId;
        
        toast({
          title: `Welcome, ${firstName}!`,
          description: "You have been signed in successfully.",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div 
      className="min-h-screen p-6 flex items-center justify-center"
      style={{
        backgroundImage: 'url(https://i.imgur.com/MsHNAik.png)',
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <Card className="bg-gradient-to-b from-white to-gray-100 animate-fade-in w-full max-w-md">
        <CardHeader className="text-center px-6 sm:px-12">
          <div className="mb-4 mt-6">
            <img 
              src="https://i.imgur.com/1fFddP4.png" 
              alt="Amex Logo" 
              className="mx-auto w-full max-w-[276px] h-auto object-contain"
            />
          </div>
        </CardHeader>
        <CardContent className="px-6 sm:px-12">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="request">Request Access</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter your user ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Please wait..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="request">
              <div className="space-y-4 mt-4">
                <div className="text-sm text-muted-foreground text-center leading-relaxed px-4 py-4 space-y-4">
                  <p>
                    To request read-only access to R's Amex 360º dashboard, please send a direct message to <span className="font-medium">@wealthplan</span> via discord and guest login credentials will be provisioned.
                  </p>
                  <p>
                    IP addresses and user sessions will be logged.
                  </p>
                </div>
                <Button 
                  asChild 
                  className="w-full"
                >
                  <a 
                    href="https://wplan.co/discord" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Request Access
                  </a>
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              © {currentYear} WealthPlan™ by Ryan Leslie.{" "}
              <span className="sm:inline block">All rights reserved.</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
