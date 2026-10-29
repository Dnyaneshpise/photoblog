/**
 * Seed script — populates the database with realistic starter content.
 * Why: Local development and demos need photos, collections, and settings without manual entry.
 * What: Creates one admin, portfolio settings, categories, sample photos (Unsplash placeholders),
 *       and two collections. Replace image URLs with real Cloudinary uploads later.
 *
 * Run: npx prisma db seed   (or npm run prisma:seed)
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@photoblog.local'
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'changeme-please'

  // Hash password once; never store plaintext.
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Dnyanesh Pise',
    },
  })
  console.log('Admin user:', admin.email)

  // Single row of portfolio settings (identity used by the public site).
  const existingSettings = await prisma.portfolioSettings.findFirst()
  if (!existingSettings) {
    await prisma.portfolioSettings.create({
      data: {
        photographerName: 'Dnyanesh Pise',
        tagline: 'Photographs that hold still for a moment longer.',
        homepageIntro:
          'I photograph light, quiet streets, and the spaces between people. This portfolio is a living collection of those frames.',
        biography:
          'Dnyanesh Pise is a software developer and photographer based in India. Photoblog is both a practice and a product — a space where craft and code meet.',
        artistStatement:
          'I am drawn to restraint. Negative space, natural light, and unposed moments. The goal is not spectacle but presence.',
        contactEmail: 'hello@example.com',
        socialLinks: {
          instagram: 'https://instagram.com/',
          github: 'https://github.com/Dnyaneshpise',
        },
      },
    })
    console.log('Portfolio settings created')
  }

  // Categories for filtering.
  const categories = [
    { name: 'Street', slug: 'street' },
    { name: 'Nature', slug: 'nature' },
    { name: 'Architecture', slug: 'architecture' },
    { name: 'Portrait', slug: 'portrait' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('Categories ready')

  const street = await prisma.category.findUniqueOrThrow({ where: { slug: 'street' } })
  const nature = await prisma.category.findUniqueOrThrow({ where: { slug: 'nature' } })
  const architecture = await prisma.category.findUniqueOrThrow({ where: { slug: 'architecture' } })

  // Placeholder images from Unsplash (free to use). Replace with Cloudinary uploads in admin later.
  const samplePhotos = [
    {
      title: 'Morning on the avenue',
      description: 'Soft side-light on empty pavement before the city wakes.',
      altText: 'Quiet city street at dawn with long shadows',
      imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80',
      width: 1600,
      height: 1067,
      location: 'City centre',
      isFeatured: true,
      isPublished: true,
      sortOrder: 1,
      categoryId: street.id,
    },
    {
      title: 'Forest edge',
      description: 'Where the path ends and the canopy begins.',
      altText: 'Dense green forest path with filtered light',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
      width: 1600,
      height: 1067,
      location: 'Woodland',
      isFeatured: true,
      isPublished: true,
      sortOrder: 2,
      categoryId: nature.id,
    },
    {
      title: 'Concrete rhythm',
      description: 'Repetition and geometry in a modern façade.',
      altText: 'Abstract architectural façade with repeating windows',
      imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80',
      width: 1600,
      height: 1067,
      isFeatured: false,
      isPublished: true,
      sortOrder: 3,
      categoryId: architecture.id,
    },
    {
      title: 'Rain on glass',
      description: 'A temporary map of the sky on a café window.',
      altText: 'Raindrops on a window overlooking a blurred street',
      imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1600&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&q=80',
      width: 1600,
      height: 2400,
      isFeatured: true,
      isPublished: true,
      sortOrder: 4,
      categoryId: street.id,
    },
    {
      title: 'Open field',
      description: 'Wind and sky with nothing in the way.',
      altText: 'Wide open grassy field under a clear sky',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
      width: 1600,
      height: 1067,
      isFeatured: false,
      isPublished: true,
      sortOrder: 5,
      categoryId: nature.id,
    },
  ]

  // Only seed photos if the table is empty (idempotent-ish).
  const photoCount = await prisma.photo.count()
  if (photoCount === 0) {
    for (const p of samplePhotos) {
      await prisma.photo.create({ data: p })
    }
    console.log(`Created ${samplePhotos.length} sample photos`)
  } else {
    console.log(`Photos already exist (${photoCount}) — skipping photo seed`)
  }

  // Collections with ordered membership.
  const allPhotos = await prisma.photo.findMany({ orderBy: { sortOrder: 'asc' } })

  async function ensureCollection(
    title: string,
    slug: string,
    description: string,
    photoIds: string[],
  ) {
    let collection = await prisma.collection.findUnique({ where: { slug } })
    if (!collection) {
      collection = await prisma.collection.create({
        data: {
          title,
          slug,
          description,
          isPublished: true,
          sortOrder: slug === 'street-studies' ? 1 : 2,
          coverPhotoId: photoIds[0] ?? null,
        },
      })
      for (let i = 0; i < photoIds.length; i++) {
        await prisma.photoCollection.create({
          data: {
            collectionId: collection.id,
            photoId: photoIds[i],
            sortOrder: i + 1,
          },
        })
      }
      console.log('Collection:', title)
    }
  }

  const streetIds = allPhotos.filter((p) => p.categoryId === street.id).map((p) => p.id)
  const natureIds = allPhotos.filter((p) => p.categoryId === nature.id).map((p) => p.id)

  await ensureCollection(
    'Street Studies',
    'street-studies',
    'Observations from pavements, windows, and the in-between hours of the city.',
    streetIds,
  )
  await ensureCollection(
    'Open Ground',
    'open-ground',
    'Landscapes and edges of forest — places where scale resets.',
    natureIds,
  )

  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
