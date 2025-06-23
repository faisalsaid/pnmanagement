'use client';

// import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { registerSchema, RegisterSchema } from '@/lib/zod';
// import { useFormState } from 'react-dom';
import { signupCredentials } from '@/action/authAction';
import { Separator } from '@/components/ui/separator';
import { FaGoogle } from 'react-icons/fa';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import GoogleAuth from '@/components/GoogleAuth';
import { toast } from 'sonner';
// import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    const id = toast.loading('Register account...');
    const res = await signupCredentials({ data });

    toast.dismiss(id);

    if (!res.ok) {
      // Error validasi field level
      if ('fieldErrors' in res) {
        Object.values(res.fieldErrors)
          .flat()
          .forEach((msg) => toast.error(msg));
        return;
      }
      toast.error(res.error);
      return;
    }

    toast.success('Account created successfully!');
    router.push('/auth/login');
  };

  // const handleGoogleSignup = () => {
  //   // TODO: Integrate with Google OAuth
  //   console.log('Google Signup');
  // };

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-md">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Create Account
          </h2>

          <Form {...form}>
            {/* <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4"> */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <fieldset
                disabled={form.formState.isSubmitting}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Jhon Doe" {...field} />
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
                        <Input
                          placeholder="e.g. jhon-doe@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-sky-500 underline">
                    Login here
                  </Link>
                </p>
              </fieldset>

              <div className="flex items-center space-x-2">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">or</span>
                <Separator className="flex-1" />
              </div>

              <GoogleAuth disabled={form.formState.isSubmitting} />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
