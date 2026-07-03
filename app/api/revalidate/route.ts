import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const secret = authHeader?.replace('Bearer ', '') || request.nextUrl.searchParams.get('secret')

  if (!REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'REVALIDATION_SECRET not configured' }, { status: 500 })
  }

  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  let body: { collection?: string; slug?: string }
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const { collection, slug } = body

  try {
    const collectionPaths: Record<string, string[]> = {
      pariwisata: ['/pariwisata', '/'],
      irigasi: ['/irigasi', '/'],
      kesehatan: ['/kesehatan', '/'],
      festival: ['/festival', '/'],
      kegiatan: ['/kegiatan', '/'],
      umkm: ['/umkm', '/'],
      lingkungan: ['/lingkungan', '/'],
      airTanah: ['/air-tanah', '/'],
      desa: ['/tentang-sambelia', '/'],
      tentang: ['/tentang-sambelia', '/'],
      profilTim: ['/profil-tim', '/'],
      settings: ['/', '/tentang-sambelia', '/peta'],
    }

    if (collection && collectionPaths[collection]) {
      for (const p of collectionPaths[collection]) {
        revalidatePath(p)
      }
      if (slug) {
        revalidatePath(`/${collection}/${slug}`)
      }
    } else {
      revalidatePath('/')
    }

    return NextResponse.json({ revalidated: true, collection, slug: slug ?? null, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ error: 'Revalidation failed', details: String(err) }, { status: 500 })
  }
}