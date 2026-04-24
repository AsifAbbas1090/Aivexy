import { prisma } from '@/lib/prisma'
import PostEditor from '@/components/admin/PostEditor'
import { notFound } from 'next/navigation'

export const metadata = { title: 'Edit Post' }

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id: params.id }, include: { tags: true } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])
  if (!post) notFound()
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Edit Post</h1>
      <PostEditor categories={categories} post={post} />
    </div>
  )
}
