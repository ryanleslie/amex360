
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus email input on page load
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: "Sign In Failed",
          description: error,
          variant: "destructive",
        });
      } else {
        // Get user data and profile to show first name in welcome message
        const { data: { user } } = await supabase.auth.getUser();
        
        let firstName = 'there';
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', user.id)
            .single();
          
          firstName = profile?.first_name || user.email?.split('@')[0] || 'there';
        }
        
        toast({
          title: `Welcome back, ${firstName}!`,
          description: "You've been signed in successfully.",
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="request">Request Access</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    ref={emailInputRef}
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
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
