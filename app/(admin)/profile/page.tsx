const ProfilePage = () => {
  return (
    <div className="flex flex-col xl:flex-row gap-8">
      <div className="w-full space-y-6 xl:w-2/3">
        <div className="bg-primary-foreground p-4 rounded-lg ">
          <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
            <h1>All Category</h1>
          </div>
          {/* <CategoryTable columns={categoryColumns} data={categories} /> */}
        </div>
      </div>
      <div className="w-full space-y-6 xl:w-1/3">
        <div className="bg-primary-foreground p-4 rounded-lg ">
          {/* <CategoryForm /> */}
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg "></div>
      </div>
    </div>
  );
};

export default ProfilePage;
