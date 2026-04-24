'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Eye } from 'lucide-react'
import { slugify } from '@/lib/utils'

interface Category { id: string; name: string }
interface Post {
  id: string; title: string; slug: string; excerpt?: string | null; content: string
  coverImage?: string | null; published: boolean; featured: boolean; sponsored: boolean
  readTime?: number | null; categoryId: string; tags: { name: string }[]
}

interface Props {
  categories: Category[]
  post?: Post
}

export default function PostEditor({ categories, post }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    coverImage: post?.coverImage || '',
    categoryId: post?.categoryId || (categories[0]?.id || ''),
    tags: post?.tags.map(t => t.name).join(', ') || '',
    published: post?.published ?? false,
    featured: post?.featured ?? false,
    sponsored: post?.sponsored ?? false,
    readTime: post?.readTime?.toString() || '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      ...(name === 'title' && !post ? { slug: slugify(value) } : {}),
    }))
  }

  async function handleSave(publish?: boolean) {
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        published: publish !== undefined ? publish : form.published,
        readTime: form.readTime ? parseInt(form.readTime) : null,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      }
      const method = post ? 'PATCH' : 'POST'
      const url = post ? `/api/posts/${post.id}` : '/api/posts'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to save post')
      const data = await res.json()
      router.push('/admin/posts')
    } catch (e: any) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
      {/* Main editor */}
      <div className="space-y-5">
        {error && <div className="p-3 bg-red-900/30 text-red-400 text-sm rounded-lg">{error}</div>}

        <div>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Post title..."
            className="w-full text-3xl font-bold bg-transparent text-white placeholder-gray-600 border-0 outline-none"
          />
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">slug:</span>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="text-xs text-gray-400 bg-transparent border-b border-gray-700 outline-none flex-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Excerpt</label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            rows={2}
            placeholder="Short description shown in article cards..."
            className={textareaCls}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Content (MDX / Markdown)</label>
            <button onClick={() => setPreview(!preview)} className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300">
              <Eye className="w-3.5 h-3.5" /> {preview ? 'Edit' : 'Preview'}
            </button>
          </div>
          {preview ? (
            <div className="prose-custom prose-custom-invert min-h-[400px] rounded-xl bg-gray-800 p-6 text-sm text-gray-300"
              dangerouslySetInnerHTML={{ __html: form.content.replace(/\n/g, '<br/>') }} />
          ) : (
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={20}
              placeholder="Write your article in Markdown or MDX..."
              className={textareaCls + ' font-mono text-sm'}
            />
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Cover Image URL</label>
          <input name="coverImage" value={form.coverImage} onChange={handleChange} placeholder="https://..." className={inputCls} />
        </div>
      </div>

      {/* Sidebar controls */}
      <div className="space-y-4">
        {/* Publish actions */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-200 mb-4">Publish</h3>
          <div className="space-y-3">
            <button
              onClick={() => handleSave(false)}
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 text-sm font-medium transition-colors disabled:opacity-60"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={loading || !form.title || !form.content}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {form.published ? 'Update' : 'Publish Now'}
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-200">Details</h3>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Category</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} className={selectCls}>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="ai, writing, seo" className={inputCls} />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Read Time (minutes)</label>
            <input name="readTime" value={form.readTime} onChange={handleChange} type="number" min="1" className={inputCls} />
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-800">
            {(['published', 'featured', 'sponsored'] as const).map(key => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-300 capitalize">{key}</span>
                <input
                  type="checkbox"
                  name={key}
                  checked={form[key] as boolean}
                  onChange={handleChange}
                  className="w-4 h-4 accent-brand-600"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500'
const textareaCls = 'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none'
const selectCls = 'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500'
