
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserCreationFormFields } from './UserCreationFormFields';
import { UserCreationMessages } from './UserCreationMessages';
import { userCreationSchema, UserCreationFormData } from './types';

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

  const form = useForm<UserCreationFormData>({
    resolver: zodResolver(userCreationSchema),
    defaultValues: {
      userId: '',
      passwordSuffix: '',
      emailPrefix: '',
      displayName: '',
      firstName: '',
    },
  });

  const onSubmit = async (data: UserCreationFormData) => {
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

        <UserCreationMessages 
          successMessage={successMessage}
          errorMessage={errorMessage}
        />

        <UserCreationFormFields
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </Card>
  );
}
