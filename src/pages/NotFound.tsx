
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-reddit-mediumGray">
      <Header />
      <Sidebar />
      
      <main className="pt-20 pb-10 px-4 md:ml-16">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-9xl font-bold text-reddit-orange mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">Hmm... this page doesn't exist</p>
          <p className="text-gray-500 mb-8">
            The link you followed may be broken, or the page may have been removed.
          </p>
          <Link to="/">
            <Button className="px-6 py-2 bg-reddit-orange hover:bg-reddit-orange/90">
              Go Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
