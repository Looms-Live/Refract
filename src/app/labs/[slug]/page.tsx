import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPostSlugs, getPostBySlug, formatDate, type BlogPost } from '@/lib/blog';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  
  let post: BlogPost;
  
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back to Labs */}
          <Link
            href="/labs"
            className="inline-flex items-center text-teal-700 hover:text-teal-800 font-medium mb-8 transition-colors duration-200"
          >
            <svg
              className="mr-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Labs
          </Link>

          {/* Article */}
          <article className="bg-white text-black rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <header className="px-8 py-12 border-b border-gray-200">
              <time className="text-sm text-black mb-4 block">
                {formatDate(post.date)}
              </time>
              <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                {post.title}
              </h1>
            </header>

            {/* Content */}
            <div className="px-8 py-12">
              <div
                className="prose prose-lg prose-gray max-w-none
                  prose-headings:text-black prose-headings:font-bold
                  prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
                  prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8
                  prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6
                  prose-p:text-black prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-teal-700 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-black prose-strong:font-semibold
                  prose-code:text-teal-700 prose-code:bg-teal-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                  prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-6 prose-pre:overflow-x-auto
                  prose-blockquote:border-l-4 prose-blockquote:border-teal-700 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-black
                  prose-ul:mb-6 prose-ol:mb-6
                  prose-li:text-black prose-li:mb-2"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </article>

          {/* Navigation */}
          <div className="mt-12 text-center">
            <Link
              href="/labs"
              className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              <svg
                className="mr-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              All Posts
            </Link>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
