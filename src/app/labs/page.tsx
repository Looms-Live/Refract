import Link from 'next/link';
import { getAllPosts, formatDate, type BlogPostMeta } from '@/lib/blog';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function LabsPage() {
    const posts: BlogPostMeta[] = getAllPosts();

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                                Our Blog
                            </h1>
                        </div>

                        {/* Blog Posts */}
                        <div className="space-y-8">
                            {posts.length === 0 ? (
                                <div className="text-center py-16">
                                    <p className="text-black text-lg">No posts found.</p>
                                </div>
                            ) : (
                                posts.map((post) => (
                                    <article
                                        key={post.slug}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex flex-col">
                                            <time className="text-sm text-black mb-2">
                                                {formatDate(post.date)}
                                            </time>
                                            <h2 className="text-2xl font-bold text-black mb-3">
                                                <Link
                                                    href={`/labs/${post.slug}`}
                                                    className="hover:text-teal-700 transition-colors duration-200"
                                                >
                                                    {post.title}
                                                </Link>
                                            </h2>
                                            {post.excerpt && (
                                                <p className="text-black mb-4 leading-relaxed">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                            <Link
                                                href={`/labs/${post.slug}`}
                                                className="inline-flex items-center text-teal-700 font-medium hover:text-teal-800 transition-colors duration-200"
                                            >
                                                Read more
                                                <svg
                                                    className="ml-2 w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </Link>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
