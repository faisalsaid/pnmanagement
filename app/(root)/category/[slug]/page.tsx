type SlugProps = { slug: string };

type CategoryPageProps = {
  params: Promise<SlugProps>;
};

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  return <div>{slug}</div>;
};

export default CategoryPage;
