import { getAllCategory } from '@/action/postActions';
import ArticelForm from '../_components/form/ArticelForm';

const CreateArticlePage = async () => {
  const { data: categories } = await getAllCategory();
  return <ArticelForm categories={categories} />;
};

export default CreateArticlePage;
