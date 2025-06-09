interface SlugParams {
  slug: string;
}

interface DetailPostPorps {
  params: Promise<SlugParams>;
}
const page = async ({ params }: DetailPostPorps) => {
  const { slug } = await params;
  return <div>page: {slug}</div>;
};

export default page;
