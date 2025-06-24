
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UserCreationFormData } from './types';

interface UserCreationFormFieldsProps {
  form: UseFormReturn<UserCreationFormData>;
  onSubmit: (data: UserCreationFormData) => void;
  isSubmitting: boolean;
}

export function UserCreationFormFields({ form, onSubmit, isSubmitting }: UserCreationFormFieldsProps) {
  return (
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
  );
}
