import 'dotenv/config';

import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcrypt';

function parseBoolean(value: string | undefined, defaultValue: boolean) {
  if (value === undefined) return defaultValue;
  return ['1', 'true', 'yes', 'y', 'on'].includes(value.toLowerCase());
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is not set. Create a .env file (or set env var) before running the seed.',
    );
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });

  const adminEmail = process.env.ADMIN_EMAIL ?? 'yaman@gmail.com';
  const adminName = process.env.ADMIN_NAME ?? 'Yaman';
  const adminPassword = process.env.ADMIN_PASSWORD ?? '12345678';
  const forceAdminPassword = parseBoolean(
    process.env.FORCE_ADMIN_PASSWORD,
    false,
  );

  const adminPasswordHash = await hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: adminName,
      password: adminPasswordHash,
      role: 'admin',
    },
    update: {
      name: adminName,
      role: 'admin',
      ...(forceAdminPassword ? { password: adminPasswordHash } : {}),
    },
    select: { id: true, email: true, role: true },
  });

  const categoryNames = ['Electronics', 'Books', 'Home & Kitchen'];
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({
        where: { name },
        create: { name },
        update: {},
      }),
    ),
  );

  const byName = new Map(categories.map((c) => [c.name, c] as const));

  const productsToEnsure = [
    {
      name: 'Wireless Headphones',
      description: 'Bluetooth over-ear headphones with noise isolation.',
      price: new Prisma.Decimal('79.99'),
      categoryName: 'Electronics',
      imageUrl: null as string | null,
    },
    {
      name: 'TypeScript Handbook',
      description: 'A practical guide to TypeScript for backend developers.',
      price: new Prisma.Decimal('24.50'),
      categoryName: 'Books',
      imageUrl: null as string | null,
    },
    {
      name: 'Stainless Steel Bottle',
      description: 'Insulated bottle for hot/cold drinks.',
      price: new Prisma.Decimal('14.99'),
      categoryName: 'Home & Kitchen',
      imageUrl: null as string | null,
    },
  ];

  let createdProducts = 0;
  for (const product of productsToEnsure) {
    const category = byName.get(product.categoryName);
    if (!category) continue;

    const existing = await prisma.product.findFirst({
      where: {
        name: product.name,
        categoryId: category.id,
      },
      select: { id: true },
    });

    if (existing) continue;

    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        categoryId: category.id,
      },
    });
    createdProducts += 1;
  }

  console.log('Seed completed');
  console.log('Admin:', adminUser);
  console.log('Categories:', categories.map((c) => ({ id: c.id, name: c.name })));
  console.log('New products created:', createdProducts);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
