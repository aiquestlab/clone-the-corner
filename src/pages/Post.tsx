
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { PostDetail } from '@/components/posts/PostDetail';

const Post = () => {
  return (
    <div className="min-h-screen bg-reddit-mediumGray">
      <Header />
      <Sidebar />
      
      <main className="pt-20 pb-10 px-4 md:ml-16">
        <div className="max-w-3xl mx-auto">
          <PostDetail />
        </div>
      </main>
    </div>
  );
};

export default Post;
