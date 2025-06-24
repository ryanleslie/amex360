
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const userCreationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  passwordSuffix: z.string().min(1, 'Password suffix is required'),
  emailPrefix: z.string().min(1, 'Email prefix is required'),
  displayName: z.string().min(1, 'Display name is required'),
  firstName: z.string().min(1, 'First name is required'),
});

type UserCreationForm = z.infer<typeof userCreationSchema>;

export function UserCreationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { createUser } = useAuth();

  // Trigger animation after component mounts
  React.useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const form = useForm<UserCreationForm>({
    resolver: zodResolver(userCreationSchema),
    defaultValues: {
      userId: '',
      passwordSuffix: '',
      emailPrefix: '',
      displayName: '',
      firstName: '',
    },
  });

  const onSubmit = async (data: UserCreationForm) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const fullPassword = `@mex360guest-${data.passwordSuffix}`;
      const fullEmail = `${data.emailPrefix}@guest.local`;

      // First, create the user (without auto sign-in)
      const result = await createUser(data.userId, fullPassword, fullEmail);
      
      if (result.error) {
        setErrorMessage(result.error);
        return;
      }

      // Update the profile with display name and first name
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: data.displayName,
          first_name: data.firstName,
        })
        .eq('user_id', data.userId);

      if (profileError) {
        console.error('Profile update error:', profileError);
        setErrorMessage('User created but failed to update profile information');
        return;
      }

      // Create user role (default to 'user')
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: data.userId,
          role: 'user'
        });

      if (roleError) {
        console.error('Role creation error:', roleError);
        setErrorMessage('User created but failed to assign role');
        return;
      }

      setSuccessMessage(
        `${data.firstName} can now sign in to the application using the credentials:\n\nUser ID: ${data.userId}\nPassword: @mex360guest-${data.passwordSuffix}\n\nThe account has been set up with the same permissions as other guest users`
      );
      form.reset();
    } catch (error) {
      console.error('User creation error:', error);
      setErrorMessage('An unexpected error occurred while creating the user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`p-6 bg-gradient-to-b from-white to-gray-100 transition-all duration-500 ${
      showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Create New User</h3>
          <p className="text-sm text-muted-foreground">Add a new guest user to the system</p>
        </div>

        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 whitespace-pre-line">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input placeholder="cwhertel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordSuffix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Suffix</FormLabel>
                  <FormControl>
                    <Input placeholder="clay" {...field} />
                  </FormControl>
                  <div className="text-xs text-muted-foreground">
                    Full password will be: @mex360guest-{field.value || '[suffix]'}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailPrefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Prefix</FormLabel>
                  <FormControl>
                    <Input placeholder="clay" {...field} />
                  </FormControl>
                  <div className="text-xs text-muted-foreground">
                    Full email will be: {field.value || '[prefix]'}@guest.local
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Clay Hertel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Clay" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating User...' : 'Create User'}
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
}
