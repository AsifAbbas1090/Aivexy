import { prisma } from '@/lib/prisma'
import PostEditor from '@/components/admin/PostEditor'

export const metadata = { title: 'New Post' }

export default async function NewPostPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">New Post</h1>
      <PostEditor categories={categories} />
    </div>
  )
}
