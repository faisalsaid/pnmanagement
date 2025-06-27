import { getAllCategory } from '@/actions/postActions';
import ArticelForm from '../_components/form/ArticelForm';
import { auth } from '@/auth';

const CreateArticlePage = async () => {
  const { data: categories } = await getAllCategory();
  const session = await auth();
  return <ArticelForm categories={categories} authorId={session?.user.id} />;
};

export default CreateArticlePage;
