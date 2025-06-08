import { auth } from '@/auth';

const ProfilePage = async () => {
  const session = await auth();
  return (
    <div className="flex flex-col xl:flex-row gap-8">
      <div className="w-full space-y-6 xl:w-2/3">
        <div className="bg-primary-foreground p-4 rounded-lg ">
          <div className="mb-8 px-4 py-2 bg-secondary rounded-md space-y-4">
            <h1>My Profile</h1>
            <div className="space-y-2">
              <p className="capitalize">{session?.user.name}</p>
              <p>{session?.user.email}</p>
              <p className="capitalize">
                {session?.user.role.toLocaleLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full space-y-6 xl:w-1/3">
        <div className="bg-primary-foreground p-4 rounded-lg "></div>
        <div className="bg-primary-foreground p-4 rounded-lg "></div>
      </div>
    </div>
  );
};

export default ProfilePage;
