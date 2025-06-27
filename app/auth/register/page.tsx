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
import { signupCredentials } from '@/actions/authAction';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import GoogleAuth from '@/components/GoogleAuth';
import { toast } from 'sonner';
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

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-md">
        <CardContent className="p-6 space-y-2">
          <GoogleAuth disabled={form.formState.isSubmitting} />
          <div className="flex items-center space-x-2 mt-6">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>
          <h2 className="text-lg text-center">Create Account</h2>
          <Form {...form}>
            {/* <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4"> */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <fieldset
                disabled={form.formState.isSubmitting}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          className="text-sm"
                          placeholder="e.g. Jhon Doe"
                          {...field}
                        />
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
                          className="text-sm"
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
                          className="text-sm"
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
                          className="text-sm"
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
                  {form.formState.isSubmitting ? 'Processing...' : 'Sign Up'}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-sky-500 underline">
                    Login here
                  </Link>
                </p>
              </fieldset>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
